# Backend — Visão Geral

> O que o backend é, por que existe, e como está organizado hoje. Para o que falta fazer, ver [ROADMAP.md](ROADMAP.md).

---

## 1. O que é e por que existe

O backend (`backend/`) é uma API Spring Boot 3.3 / Java 21 que vai substituir o `localStorage` do frontend como fonte de verdade de tudo: perfil do usuário, assinatura, progresso de curso, jogos/XP, gamificação, ranking e correção de escrita por IA.

**Estado hoje:** só o contexto `user` (Profile + UserPreferences) está implementado, com autenticação real via Supabase JWT já funcionando ponta a ponta. **O frontend ainda não consome nada disso** — nenhuma chamada `fetch`/`axios` sai do `frontend/src` hoje; login, cadastro e `ProtectedRoute` continuam 100% mockados em `localStorage` (ver [frontend/docs/OVERVIEW.md](../../frontend/docs/OVERVIEW.md)). Os dois projetos vivem no mesmo monorepo mas não se conhecem — não há proxy nem env var apontando o frontend para `localhost:8081`.

## 2. Objetivos / contextos (bounded contexts)

| Contexto | Papel | Status |
|---|---|---|
| `user` | Perfil (`Profile`) + preferências (`UserPreferences`) | ✅ implementado |
| `subscription` | Assinatura paga que dá acesso à área do aluno | 🔲 planejado — bloqueado por decisão de gateway (seção 7) |
| `course` (catálogo) | Cursos/capítulos/tópicos/exercícios/léxico, hoje estático em `frontend/src/data/courses.ts` | 🔲 planejado |
| `progress` | Leitura de tópico, tentativas de exercício, resultado de quiz/prova | 🔲 planejado |
| `study` | Heartbeat de tempo de estudo, streak (derivado, não armazenado) | 🔲 planejado |
| `gamification` | XP (ledger), conquistas, missões diárias | 🔲 planejado |
| `game` | Categorias de jogo e progresso por fase | 🔲 planejado |
| `ranking` | Query agregada sobre XP — sem tabela própria no MVP | 🔲 planejado |
| `writing` | Correção de escrita via IA (substitui o mock de `Aula.tsx`) | 🔲 planejado |

## 3. Arquitetura hexagonal (Ports and Adapters)

Cada operação de negócio é modelada como uma porta de entrada (`domain/ports/in`, interface UseCase + Command), implementada por um service em `application/service`, que depende só de portas de saída (`domain/ports/out`) — nunca de um adapter concreto. Adapters (`adapter/in/rest`, `adapter/out/persistence`) plugam nas portas e concentram tudo que é framework/infraestrutura (HTTP, JPA, Spring Security).

As camadas são **globais** (compartilhadas por todos os contextos), não um pacote isolado por bounded context — decisão consciente para seguir a organização de um projeto de referência; se isso virar dor conforme mais contextos entrarem, revisitar.

**Regra para todo contexto novo:** espelhar exatamente o layout do contexto `user` — criar o mesmo subpacote `<contexto>` em `domain/ports/in`, `domain/ports/out`, `application/service`, `adapter/out/persistence`, `adapter/out/persistence/mapper` e `adapter/in/rest/mapper` (mais `request`/`response` se tiver DTOs próprios). Controllers sempre em `adapter/in/rest/api`, nunca em subpacote por contexto.

Estrutura real hoje (✅ implementado · 🔲 planejado):

```
com.spanishai.backend
├── domain/
│   ├── model/                    ✅ Profile, UserPreferences — POJOs puros, sem JPA/Spring
│   ├── exception/                ✅ ResourceNotFoundException, InvalidRequestException
│   └── ports/
│       ├── in/user/              ✅ GetProfileUseCase, UpdateProfileUseCase, GetPreferencesUseCase, UpdatePreferencesUseCase
│       └── out/user/             ✅ ProfileRepository, UserPreferencesRepository
├── application/
│   └── service/user/             ✅ ProfileService, UserPreferencesService
├── adapter/
│   ├── in/rest/
│   │   ├── api/                  ✅ HealthController, ProfileController
│   │   ├── mapper/user/          ✅ ProfileRestMapper, UserPreferencesRestMapper
│   │   ├── request/user/         ✅ ProfileUpdateRequest, UserPreferencesUpdateRequest
│   │   ├── response/             ✅ ApiError (compartilhado)
│   │   ├── response/user/        ✅ ProfileResponse, UserPreferencesResponse
│   │   └── GlobalExceptionHandler.java  ✅
│   └── out/persistence/
│       ├── entity/                ✅ BaseJpaEntity, ProfileJpaEntity, UserPreferencesJpaEntity
│       ├── user/                  ✅ *JpaRepository, *PersistenceAdapter
│       └── mapper/user/           ✅ ProfilePersistenceMapper, UserPreferencesPersistenceMapper
├── infrastructure/config/          ✅ SecurityConfig, CorsConfig, JpaAuditingConfig, OpenApiConfig, JwtDecoder
├── security/                       ✅ CurrentUserProvider, jwt/SupabaseJwtDecoderConfig
│
│   -- contextos futuros entram nos mesmos domain/application/adapter acima --
├── 🔲 subscription        assinatura/billing (schema depende da decisão de gateway, ver seção 7)
├── 🔲 course/catalog      Course, Chapter, Topic, TopicBlock, Exercise, LexiconEntry
├── 🔲 course/progress     TopicRead, ExerciseAttempt, ChapterQuizResult, ExamResult
├── 🔲 study               StudySession (tempo de estudo, streak derivado por query)
├── 🔲 gamification/xp     XpTransaction (ledger append-only)
├── 🔲 gamification/achievement  Achievement, ProfileAchievement
├── 🔲 gamification/mission      DailyMissionProgress
├── 🔲 game                GameCategory, GameProgress
├── 🔲 ranking             somente leitura — query agregada sobre xp_transactions
└── 🔲 writing             WritingSubmission (correção de IA)
```

**Responsabilidade de cada camada:**

| Camada | Responsabilidade | Não deve fazer |
|---|---|---|
| `domain/model` | Modelo de negócio puro (POJO), sem anotação de framework | Conhecer JPA, Spring, HTTP |
| `domain/ports/in` | Interface UseCase por operação + `record` de Command | Implementação — só contrato |
| `domain/ports/out` | Interface para persistência/integrações externas | Detalhe de infraestrutura (JPA, SQL) |
| `application/service` | Implementa UseCases, orquestra `ports/out`, fronteira `@Transactional`, lança exceções de domínio | Ler `SecurityContextHolder`, conhecer DTO/HTTP/JPA |
| `adapter/in/rest` | Resolve usuário autenticado (`CurrentUserProvider`), monta Command, valida (`@Valid`), chama UseCase, mapeia resposta | Lógica de negócio |
| `adapter/out/persistence` | Entidades JPA, `JpaRepository`, mapeamento entidade↔domínio | Lógica de negócio |
| `infrastructure/config` | Config Spring pura (security, CORS, auditing, OpenAPI) | Lógica de negócio |
| `security` | Validação de JWT, resolução do usuário autenticado, autorização por rota | Emitir tokens (isso é do Supabase Auth) |

## 4. Segurança

- **Auth:** Supabase Auth emite os tokens (JWT **ES256/P-256**, sem secret simétrico — não HS256), Spring Boot só valida via **JWKS** (`NimbusJwtDecoder`, cacheado/rotacionado automaticamente). Valida `issuer` e `aud` contendo `"authenticated"`.
- **Usuário atual:** `CurrentUserProvider` extrai `sub` (UUID) do JWT — nenhum service confia em `profileId` vindo do corpo da requisição.
- **Perfil criado lazily:** na primeira request autenticada, usando `email`/`user_metadata` do token — funciona igual para cadastro por e-mail e por Google, sem trigger de banco.
- **Rotas públicas** (`SecurityConfig.PUBLIC_PATHS`): `/api/health`, `/h2-console/**` (só perfil `local`), `/v3/api-docs/**`, `/swagger-ui/**`, `/swagger-ui.html`. **Todo o resto exige token válido** (`anyRequest().authenticated()`) — retorna `401` mesmo para rotas inexistentes, antes do dispatcher.
- **CORS:** `CorsConfig` restringe `/api/**` a uma única origem (`app.cors.allowed-origin`, hoje `http://localhost:8080`) com `allowCredentials(true)`. Precisa virar parametrizável por ambiente quando existir domínio de produção.
- **Sessão:** API stateless (`SessionCreationPolicy.STATELESS`), CSRF desabilitado (API só-Bearer-token).
- **Por que a correção de IA nunca pode ser chamada direto do cliente** (relevante quando o contexto `writing` existir): a API key do provedor de IA não pode existir no bundle do frontend; precisa logar/auditar submissões; precisa normalizar a resposta do modelo antes de devolver ao cliente.

## 5. Banco de dados

**Motor:** PostgreSQL (Supabase, produção) · H2 in-memory (perfil `local`, dev, modo compatibilidade Postgres). **Fonte de verdade:** Flyway — `ddl-auto=validate` em todos os perfis, Hibernate nunca altera schema, só confere.

Convenções: toda tabela usa `id UUID` como PK (`gen_random_uuid()`, exceto `profiles`); `profiles.id` é o mesmo UUID de `auth.users.id`; toda tabela de domínio tem `created_at`/`updated_at`.

**Migrations aplicadas:**

| Versão | Arquivo | Conteúdo |
|---|---|---|
| V1 | `V1__baseline.sql` | Baseline vazio — schema `public` versionado pelo Flyway |
| V2 | `V2__create_profiles_table.sql` | Cria `profiles` |
| V3 | `V3__create_user_preferences_table.sql` | Cria `user_preferences` |

**Schema atual — `user` (✅ implementado):**

`profiles` (estende `auth.users` 1:1, gerenciada pelo Supabase): `id uuid PK` (sempre o mesmo UUID de `auth.users.id`, atribuído pelo backend no provisionamento lazy, nunca gerado pelo Postgres — por isso a entidade JPA `Profile` implementa `Persistable<UUID>` em vez de estender `BaseEntity`), `name`, `avatar_url` (nullable), `locale` (`pt`|`en`), `timezone` (IANA, ex. `America/Sao_Paulo` — usado para bucketing de `study_sessions` no futuro), `created_at`, `updated_at`.

`user_preferences` (1:1 com `profiles`): `profile_id` (PK/FK), `font_size`, `sound_enabled`, `show_translation`, `reminder_time` (nullable), `notifications_enabled`.

**Schema alvo por contexto futuro:**

```
# course.catalog — somente leitura para o aluno, escrita via seed importado de courses.ts
courses (id, level [A1|A2|B1|B2|C1|C2] unique, title, title_en)
  └─< chapters (id, course_id FK, number, title, title_en, summary, summary_en, brief_review, common_mistakes JSONB)
        ├─< topics (id, chapter_id FK, order, title, title_en)
        │     ├─< topic_blocks (id, topic_id FK, order, kind, content JSONB)
        │     └─< exercises (id, topic_id FK?, chapter_id FK?, type, is_quiz, question(_en), options(_en) JSONB, answer, explanation(_en))
        └─< lexicon_entries (id, chapter_id FK, es, pt, en, tag, example, is_flashcard)

# course.progress — exercise_attempts é log completo (não só "última tentativa"), base para adaptação de dificuldade futura
topic_reads          (profile_id FK, topic_id FK, read_at)                        PK composta
exercise_attempts    (id, profile_id FK, exercise_id FK, is_correct, attempted_at)
chapter_quiz_results (id, profile_id FK, chapter_id FK, score, total, taken_at)
exam_results         (id, profile_id FK, course_level, score, total, taken_at)

# study — sem streak armazenado; study_date calculado via now() AT TIME ZONE profiles.timezone (nunca UTC puro)
study_sessions (profile_id FK, study_date DATE, seconds_studied INT)              PK composta

# gamification — XP total = SUM(amount), nunca coluna mutável; definição de missão fica em código, tabela só guarda progresso do dia
xp_transactions (id, profile_id FK, amount, reason, reference_type, reference_id, created_at)
achievements         (id, code unique, name(_en), description(_en), icon)         catálogo, seed
profile_achievements (profile_id FK, achievement_id FK, unlocked_at)               PK composta
daily_mission_progress (profile_id FK, mission_code, mission_date, current_count, target_count, completed, bonus_claimed)  PK composta

# game — UPSERT sempre atualiza completed_at a toda conclusão (mesmo empatando), stars/xp só sobrescritos se ≥ anterior
game_categories (id, code unique, name(_en), status [available|coming_soon])
game_progress   (profile_id FK, category_code FK, level, stage, stars, xp_earned, completed_at)  PK composta

# ranking — sem tabela própria no MVP: query agregada (SUM + RANK() OVER) sobre xp_transactions.
# Decisão de produto pendente: manter perfis fictícios semeados como "bots" ou aceitar ranking pequeno no início.

# writing — feedback em JSONB porque a forma da resposta de IA pode evoluir sem migration
writing_submissions (id, profile_id FK, lesson_ref, original_text, corrected_text, feedback JSONB, score, created_at)
```

**Perfis de configuração de banco:**

| Perfil | Arquivo | Banco |
|---|---|---|
| `local` (default) | `application-local.yml` | H2 in-memory, console em `/h2-console` |
| `supabase` | `application-supabase.yml` | Postgres real via `SUPABASE_DB_URL`/`SUPABASE_DB_USERNAME`/`SUPABASE_DB_PASSWORD` (env vars, nada hardcoded) |

Em ambos os perfis, a autenticação **sempre** aponta para o Supabase Auth hospedado (`supabase.auth.project-url` em `application.yml`) — Auth é um serviço gerenciado separado do banco de dados de negócio.

## 6. API

**Base URL (local):** `http://localhost:8081` · **Docs interativas:** Swagger UI em `/swagger-ui.html`, OpenAPI JSON em `/v3/api-docs`.

**Endpoints implementados:**

| Endpoint | Auth | Descrição |
|---|---|---|
| `GET /api/health` | não | Health check |
| `GET /api/users/me` | sim | Perfil do usuário — provisionamento lazy no primeiro acesso |
| `PUT /api/users/me` | sim | Atualiza perfil (`name`, `avatarUrl?`, `locale`, `timezone` — precisa ser IANA válido) |
| `GET /api/users/me/preferences` | sim | Preferências — provisionamento lazy com defaults |
| `PUT /api/users/me/preferences` | sim | Atualiza preferências |

**Endpoints planejados por módulo** (ordem de dependência):

| # | Módulo | Endpoints representativos | Depende de |
|---|---|---|---|
| — | `subscription` | `POST /api/subscriptions/checkout`, webhook do gateway, `GET /api/subscriptions/me` | user, gateway de pagamento (seção 7) |
| — | `course.catalog` | `GET /api/courses`, `GET /api/courses/{level}/chapters/{id}` | user |
| — | `course.progress` | `POST /api/progress/topics/{id}/read`, `.../exercises/{id}/attempts`, `.../chapters/{id}/quiz`, `POST /api/progress/exams` | user, course.catalog |
| — | `study` | `POST /api/study/heartbeat`, `GET /api/study/streak` | user |
| — | `gamification.xp` | `GET /api/xp/total`, `GET /api/xp/history` | user |
| — | `gamification.achievement` | `GET /api/achievements` | gamification.xp, course.progress, game |
| — | `gamification.mission` | `GET /api/missions/today` | course.progress, game, study |
| — | `game` | `GET /api/games/categories`, `POST /api/games/{category}/{level}/{stage}/complete` | user, gamification.xp |
| — | `ranking` | `GET /api/ranking` | gamification.xp |
| — | `writing` | `POST /api/writing/correct`, `GET /api/writing/history` | user, Claude API externo |

**Formato de erro** (`ApiError`, `GlobalExceptionHandler`, para tudo fora de 401/403 que o filtro OAuth2 já trata):

```json
{ "timestamp": "2026-07-13T12:00:00Z", "status": 404, "message": "Descrição do erro", "details": ["campo: motivo"] }
```

| Exceção | Status |
|---|---|
| `ResourceNotFoundException` | 404 |
| `InvalidRequestException` | 400 |
| `MethodArgumentNotValidException` (`@Valid` falhou) | 400, com `details` por campo |
| Qualquer outra `Exception` | 500, mensagem genérica — nunca vaza stack trace |

## 7. Modelo de negócio (assinatura) — 🔲 sem código ainda

- **3 planos:**
  - **Free** — acesso limitado, sem custo. Escopo exato de features ainda **a definir** (produto pendente de decisão: quais níveis/jogos/quantidade de correções de IA ficam liberados).
  - **Mensal** — R$ 89,90/mês, acesso completo à área do aluno (todos os níveis A1–C2, jogos, DELE, correção de IA).
  - **Anual** — R$ 699,90/ano (equivalente a ~R$ 58,33/mês — cerca de 35% mais barato que 12 parcelas do mensal), mesmo acesso completo do plano Mensal.
- O gate de assinatura (Mensal/Anual) acontece no **cadastro/checkout**, antes de entrar na área logada com acesso completo — a landing page continua pública e aberta a todos, e o Free permite criar conta sem pagamento.
- **Dados de pagamento passam por um gateway externo** (nunca armazenados/processados diretamente por este backend) — decisão de fornecedor ainda pendente: **Stripe vs. Mercado Pago/Asaas** (os dois últimos com suporte nativo a Pix, relevante para o público BR). Essa escolha bloqueia o desenho detalhado do schema (`subscriptions`, `subscription_events`), do webhook e do SDK a integrar.
- Hoje não existe nenhum código de billing/checkout/webhook, nem no frontend nem no backend.

## 8. Infra & deploy

**Topologia hoje:** frontend é build estático (qualquer host — Vercel/Netlify/GitHub Pages), backend é um JAR único rodando em `:8081`. Os dois não estão ligados — sem proxy reverso, sem env var do frontend apontando pro backend.

**Variáveis de ambiente (backend, perfil `supabase`):**
```env
SPRING_PROFILES_ACTIVE=supabase
SUPABASE_DB_URL=jdbc:postgresql://<host>:5432/postgres
SUPABASE_DB_USERNAME=
SUPABASE_DB_PASSWORD=
```
Nenhuma credencial hardcoded — tudo vem de env var.

**Migrations:** `spring.flyway.locations=classpath:db/migration`, `schemas=public` (schemas `auth`/`storage`/`realtime` são geridos pelo próprio Supabase). Rodam automaticamente no boot.

**Observabilidade:** perfil `local` liga log `TRACE` para `org.springframework.security*` — útil em dev, mas verboso demais pra produção; revisar antes de qualquer deploy real. Nenhuma stack de métricas/tracing (Actuator, Micrometer, Sentry) existe ainda.

**Deploy:** backend ainda não tem pipeline/host de produção definido, roda via `./mvnw spring-boot:run`. Ao decidir hospedagem: atualizar `app.cors.allowed-origin` pro domínio real, mover `SUPABASE_DB_*` para secrets do ambiente, revisar nível de log.

## 9. Testes existentes

- `BackendApplicationTests` — smoke test do contexto Spring.
- `FlywayMigrationTests` — migrations V1–V3 aplicam limpo, nada pendente.
- `Phase0EndpointTests` — health público, rota protegida retorna 401 sem token, OpenAPI público.
- `ProfileIntegrationTests` / `UserPreferencesIntegrationTests` — provisionamento lazy, mapeamento de metadata do Google, GET/PUT, validação, 401 sem token.
- `ProfilePersistenceAdapterTest` / `UserPreferencesPersistenceAdapterTest` — corrida de concorrência no insert.
- `ProfileServiceTest` — provisionamento a partir de metadata, fallbacks de nome, rejeição de timezone inválido.
- `SupabaseProfileConfigurationTest` — perfil `supabase` resolve config com credenciais fake.

Cobertura hoje é inteiramente do contexto `user` + infra transversal (security, Flyway, contexto Spring).

## 10. Decisões arquiteturais chave

| Decisão | Alternativa considerada | Por quê |
|---|---|---|
| Supabase Auth emite tokens, Spring Boot só valida | Auth 100% própria (Spring Security + tabela de senhas) | Resolve Google OAuth sem reimplementar OAuth2; menor superfície de segurança |
| JWT validado via JWKS (ES256/P-256) | Secret compartilhado (HS256) | Supabase assina com ECC — não existe secret simétrico; JWKS permite rotação de chave sem reimplantar |
| Perfil criado lazily na primeira request autenticada | Trigger SQL ou endpoint `/register` explícito | Funciona igual para e-mail e Google; lógica em Java testável, não em trigger |
| XP como ledger append-only (`xp_transactions`) | Coluna `total_xp` mutável | Auditável; elimina a classe de bug de estado assíncrono já visto no frontend |
| Conteúdo pedagógico com JSONB onde a forma varia | Tabela própria por tipo de bloco | Já é union type flexível em TS; normalizar criaria 6+ tabelas raramente consultadas isoladamente |
| Flyway desde o início | `ddl-auto=update` | `update` só é aceitável em protótipo local; dado real precisa de migrations versionadas |
| Streak e missões diárias derivados por query, não armazenados | Coluna `current_streak` | Elimina a classe de bug de fuso horário do frontend — cálculo centralizado sobre dados brutos |
| Hexagonal com camadas globais | package-by-feature (um pacote por bounded context) | Domínio isolado de framework; cada operação testável via UseCase sem Spring. Trade-off aceito: pacotes compartilhados por todos os contextos — revisitar se virar dor |
| Dados de pagamento via gateway externo | Processar/armazenar cartão/conta bancária no próprio backend | Evita escopo de compliance PCI-DSS; Stripe/Mercado Pago/Asaas já resolvem isso |
