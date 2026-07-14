# Arquitetura

**Versão:** 1.0
**Padrão:** Frontend SPA desacoplado (hoje standalone) + Backend Spring Boot package-by-feature
**Status:** Frontend funcional e independente · Backend em implementação (Fase 0 e Fase 1 concluídas — ver [ROADMAP](../ROADMAP.md))

> Este documento descreve a arquitetura **atual** dos dois projetos e a arquitetura **alvo** depois que forem integrados (Fase 2 — "Backend Real" do roadmap). Onde os dois divergem, isso é dito explicitamente.

---

## 1. Visão geral (estado atual)

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│      frontend/ (React SPA)   │        │   backend/ (Spring Boot)     │
│                              │        │                              │
│  Todo o estado em            │   ✗    │  /api/health                 │
│  localStorage. Nenhuma       │  ainda │  /api/users/me (GET/PUT)     │
│  chamada de rede real.       │  não   │  Auth: valida JWT do Supabase│
│  TanStack Query configurado  │  ligados│  H2 (local) / Postgres       │
│  mas sem fetch remoto.       │        │  (Supabase, perfil `supabase`)│
└─────────────────────────────┘        └──────────────┬───────────────┘
                                                        │ JDBC/JPA
                                                 ┌──────▼───────┐
                                                 │   Supabase    │
                                                 │  Auth + DB    │
                                                 └───────────────┘
```

Os dois projetos vivem no mesmo monorepo mas **não se conhecem**: não há proxy, nem chamadas do frontend para `localhost:8081`. O frontend hoje seria funcional mesmo que a pasta `backend/` não existisse.

---

## 2. Arquitetura do frontend

### 2.1 Provider nesting (`App.tsx`)

```
ErrorBoundary
  → ThemeProvider (forcedTheme="light" — dark mode desabilitado de propósito)
    → QueryClientProvider (TanStack Query — hoje sem fetch remoto, é scaffolding)
      → TooltipProvider
        → LanguageProvider (i18n pt/en)
          → BrowserRouter
```

### 2.2 Roteamento

```
Rotas públicas            ProtectedRoute (checa localStorage["spanish-ai-user"])
  /                          └── DashboardLayout
  /login                          ├── /dashboard/*
  /cadastro                       ├── /jogos/*
                                  ├── /cursos/*
                                  ├── /aula/:id
                                  └── /dele/:id
```

`ProtectedRoute` (`src/components/ProtectedRoute.tsx`) é hoje apenas um guard client-side — qualquer um pode escrever a chave no localStorage e "logar". Isso é esperado enquanto não há backend (ver [specs/SECURITY.md](../specs/SECURITY.md)).

### 2.3 Fluxo de dados

```
data/courses.ts ──► pages/Capitulo.tsx
data/games.ts   ──► pages/Fase.tsx
      │
lib/course-progress.ts  ◄──► localStorage["spanish-ai-course-v1"]
lib/progress.ts         ◄──► localStorage["spanish-ai-progress-v1"]
lib/dashboard-stats.ts  ──► agrega os dois acima + missões/conquistas/XP
      │
pages/dashboard/*  ──► lê stats agregadas e exibe
```

Não há API real: "login" apenas salva `{ name, email }` em `localStorage["spanish-ai-user"]`.

### 2.4 Decisões de arquitetura do frontend

| Decisão | Razão |
|---|---|
| **localStorage** em vez de Context/Zustand para estado de progresso | Estado persistente entre sessões, sem necessidade de reatividade entre múltiplos componentes simultâneos. TanStack Query já está pronto para substituir quando o backend real assumir a escrita. |
| **Framer Motion** em vez de CSS puro | Muitas transições de entrada/saída coordenadas (preloader → landing, tab switches, celebração de capítulo) que seriam complexas em CSS puro. |
| Tema sempre `light` (`forcedTheme` em `App.tsx`) | Consistência visual da landing page — decisão intencional, não esquecimento. Reverter é trivial (remover `forcedTheme`). |
| **Web Speech API** em vez de áudio gravado | Placeholder funcional até haver recurso para gravar/hospedar áudio nativo em espanhol. Entrega valor imediato sem dependência externa — comportamento inconsistente entre browsers é o trade-off conhecido (Firefox em particular). |

---

## 3. Arquitetura do backend

### 3.1 Estilo: package-by-feature, não package-by-layer

Cada módulo de domínio é um pacote com suas próprias camadas internas (`controller`, `service`, `repository`, `entity`, `dto`), em vez de pacotes transversais gigantes (`controllers/`, `services/`, `entities/`) onde tudo de todos os domínios fica misturado. Cada bounded context (usuário, curso, progresso, jogos, gamificação, IA) evolui isoladamente.

### 3.2 Estrutura de pacotes (✅ implementado · 🔲 planejado)

```
com.spanishai.backend
│
├── config/                       ✅ SecurityConfig, CorsConfig, JpaAuditingConfig, OpenApiConfig
├── common/                       ✅ BaseEntity, ApiError, GlobalExceptionHandler, exceptions de domínio
├── security/                     ✅ SupabaseJwtDecoderConfig (JWKS/ES256), CurrentUserProvider
│
├── user/                         ✅ Profile (provisionamento lazy), GET/PUT /api/users/me
│                                  ✅ UserPreferences (provisionamento lazy), GET/PUT /api/users/me/preferences
├── course/
│   ├── catalog/                  🔲 Course, Chapter, Topic, TopicBlock, Exercise, LexiconEntry
│   └── progress/                 🔲 TopicRead, ExerciseAttempt, ChapterQuizResult, ExamResult
├── study/                        🔲 StudySession (tempo de estudo, streak derivado por query)
├── gamification/
│   ├── xp/                       🔲 XpTransaction (ledger append-only)
│   ├── achievement/               🔲 Achievement, ProfileAchievement
│   └── mission/                   🔲 DailyMissionProgress
├── game/                         🔲 GameCategory, GameProgress
├── ranking/                       🔲 somente leitura — query agregada sobre xp_transactions
└── writing/                       🔲 WritingSubmission (correção de IA — feature "Aula")
```

Detalhe de módulos, endpoints e ordem de implementação: ver [ROADMAP.md](../ROADMAP.md) e [api/API_SPEC.md](../api/API_SPEC.md).

### 3.3 Responsabilidade de cada camada

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| **Controller** | Fronteira HTTP: recebe DTO, valida (`@Valid`), chama o service, devolve DTO. Documentação OpenAPI (`@Tag`/`@Operation`). | Lógica de negócio, acesso direto a repository |
| **Service** | Regras de negócio, orquestra repositories, fronteira transacional (`@Transactional`), lança exceções de domínio. | Conhecer detalhes de HTTP (status codes, headers) |
| **Repository** | Interfaces Spring Data JPA; `@Query` customizado quando a derivação por nome não basta (ex.: agregação de ranking). | Lógica de negócio |
| **Entity** | Mapeamento JPA 1:1 com tabelas do Postgres/H2. Auditoria (`@CreatedDate`/`@LastModifiedDate`). | Validação de regra de negócio complexa |
| **DTO** | Contrato de API, desacoplado da entidade (evita vazar proxies do Hibernate). Mapeamento via MapStruct. | — |
| **Security** | Validação de JWT do Supabase, resolução do usuário autenticado (`CurrentUserProvider`), autorização por rota. | Emitir tokens (isso é do Supabase Auth) |

---

## 4. Arquitetura de comunicação (alvo — Fase 2 do roadmap de produto)

```
┌──────────────┐   (1) signup / login / OAuth Google         ┌───────────────┐
│              │ ───────────────────────────────────────────►│   Supabase    │
│    React     │◄───────────────────────────────────────────│     Auth      │
│  (frontend)  │   access_token (JWT ES256) + refresh_token   └───────────────┘
│              │
│              │   (2) toda chamada de negócio, com            ┌───────────────┐
│              │       Authorization: Bearer <jwt>             │  Spring Boot  │
│              │ ───────────────────────────────────────────► │    Backend    │
│              │◄─────────────────────────────────────────── │  (porta 8081) │
└──────────────┘   JSON (DTOs de resposta)                     └───────┬───────┘
                                                                        │ JDBC/JPA
                                                                ┌───────▼───────┐
                                                                │   Supabase    │
                                                                │   Postgres    │
                                                                │ (schema public)│
                                                                └───────────────┘
```

O React **nunca** fala diretamente com o Postgres, e fala com o Supabase **apenas** para autenticação. Todo dado de negócio (cursos, progresso, jogos, XP, ranking, correção de IA) passa pelo Spring Boot — isso mantém o backend como única fonte de verdade e evita duplicar lógica de desbloqueio/XP/conquistas em JS no cliente (a causa raiz de vários bugs documentados em [ROADMAP.md](../ROADMAP.md), seção "Problemas conhecidos").

### 4.1 Fluxo de autenticação (já implementado no backend, pendente de troca no frontend)

1. **Cadastro/login**: React chama `supabase-js` diretamente (`signUp` / `signInWithPassword` / `signInWithOAuth({provider: 'google'})`) — substitui o mock atual em `localStorage["spanish-ai-user"]`.
2. Toda requisição ao backend carrega `Authorization: Bearer <access_token>`.
3. `SupabaseJwtDecoderConfig` (✅ implementado) valida o JWT via JWKS (`ES256`/P-256, sem secret simétrico compartilhado), checando `issuer` e `aud=authenticated`.
4. `CurrentUserProvider` (✅ implementado) extrai o `sub` (UUID) do token.
5. `ProfileService` (✅ implementado) resolve esse UUID contra `profiles`; se não existir, provisiona a linha na hora (lazy provisioning), usando `email`/`user_metadata` do token como fonte dos valores default — funciona igual para cadastro por e-mail e por Google.
6. Rotas públicas hoje: `/api/health`, `/api/users` (⚠️ ver nota abaixo), `/h2-console/**`, `/v3/api-docs/**`, `/swagger-ui/**`. Todo o resto exige token válido (`anyRequest().authenticated()`).

> **Nota:** `SecurityConfig.PUBLIC_PATHS` hoje lista `"/api/users"` (sem `/**`), o que na prática não libera `/api/users/me` — o matcher não cobre subpaths. Vale confirmar se essa é a intenção (endpoint de perfil deveria exigir auth mesmo) antes de generalizar o padrão para outros módulos.

### 4.2 Exemplo de fluxo de dados fim a fim (planejado — completar um exercício)

```
React: usuário responde exercício
  → POST /api/progress/exercises/{exerciseId}/attempts  { answer, correct }
    Header: Authorization: Bearer <jwt>

Spring Boot:
  1. Filtro OAuth2 Resource Server valida o JWT → profile_id resolvido
  2. ProgressController valida payload (@Valid) → chama ProgressService
  3. ProgressService:
     - grava ExerciseAttempt (log, não só um boolean)
     - recalcula % de conclusão do capítulo (ver specs/BUSINESS_RULES.md)
     - se cruzou o threshold de desbloqueio (≥80%), destrava o próximo capítulo
     - se for a primeira vez que este exercício é acertado, dispara XpService.award(...)
     - dispara AchievementEvaluationService (verifica badges desbloqueados)
  4. Retorna ProgressResponseDTO { chapterCompletion, unlockedNext, xpAwarded, achievementsUnlocked[] }

React: atualiza a UI com a resposta — sem recalcular nada localmente
```

O ponto central do redesenho: **o frontend deixa de calcular qualquer regra de negócio** (% de conclusão, threshold de desbloqueio, XP, streak) — passa só a exibir o que o backend devolve.

---

## 5. Decisões de arquitetura chave (backend)

| Decisão | Alternativa considerada | Por quê |
|---|---|---|
| **Supabase Auth** emite os tokens; Spring Boot só valida | Auth 100% própria no Spring Security + tabela de senhas | Resolve o Google OAuth sem reimplementar OAuth2; menor superfície de segurança (reset de senha, verificação de e-mail ficam no Supabase) |
| JWT validado via **JWKS (ES256/P-256)** | Secret compartilhado (HS256) | Supabase assina com JWT Signing Keys em ECC — não existe secret simétrico. JWKS também permite rotação de chave sem reimplantar o backend |
| Perfil criado **lazily** na primeira request autenticada | Trigger SQL no `auth.users`, ou endpoint `/register` explícito | Funciona igual para signup por e-mail e por Google; lógica fica em Java testável, não em trigger de banco |
| XP como **ledger append-only** (`xp_transactions`) | Coluna `total_xp` mutável | Auditável; elimina a classe de bug de estado assíncrono já vista no frontend; total é sempre `SUM()` |
| Conteúdo pedagógico com colunas **JSONB** onde a forma varia | Tabela própria por tipo de bloco | A estrutura já é uma union type flexível em TS; normalizar tudo criaria 6+ tabelas raramente consultadas isoladamente |
| **Flyway** desde o início | `ddl-auto=update` | `ddl-auto=update` só é aceitável em protótipo local; dado real de usuário precisa de migrations versionadas (`ddl-auto=validate` em todos os perfis, ver `application.yml`) |
| Streak e "missões de hoje" são **derivados por query**, não armazenados | Coluna `current_streak` | Elimina a classe de bug de fuso horário do frontend — cálculo centralizado sobre dados brutos (`study_sessions`) |
| **package-by-feature** | package-by-layer (`controllers/`, `services/`, `entities/`) | Evita pacotes gigantes com todos os domínios misturados; cada bounded context evolui isolado |

---

## 6. Estado atual vs. arquitetura alvo

| Área | Hoje | Alvo (ver ROADMAP) |
|---|---|---|
| Autenticação | localStorage mock (`spanish-ai-user`) | Supabase Auth + JWT validado pelo backend |
| Progresso de curso/jogos | localStorage, calculado no cliente | Persistido no Postgres via Spring Boot, calculado no servidor |
| Guarda de rota | `ProtectedRoute` client-side | Mantém-se client-side para UX, mas toda API exige token válido — sem essa camada, o dado real não pode ser acessado de qualquer forma |
| Correção de escrita (Aula) | 100% mockada (`mockAnalyze`) | Módulo `writing/` + Claude API, mediado pelo backend (ver [ai/AI_SPEC.md](../ai/AI_SPEC.md)) |
| Senha | Comparação em texto puro no cliente | Gerenciada inteiramente pelo Supabase Auth (ver [specs/SECURITY.md](../specs/SECURITY.md)) |
