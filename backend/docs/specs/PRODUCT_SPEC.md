# SpanishAI Platform — Especificação de Produto

> Plataforma gamificada para aprendizado de espanhol, construída com React + Vite + Tailwind + shadcn/ui no frontend e Spring Boot 3.3 / Java 21 no backend (em implementação).

---

## 1. Visão geral

O **SpanishAI Platform** combina:

- **Curso estruturado** por níveis (A1 → B2) com capítulos, tópicos, quizzes e flashcards
- **Jogos interativos** (Memória, Lacunas, Caça-palavras) com sistema de XP e estrelas
- **Dashboard gamificado** com streak, missões diárias, conquistas e ranking
- **Áudio de pronúncia** via Web Speech API nativa
- **Suporte a PT-BR e EN** (i18n completo)

Hoje todo o estado do frontend é persistido em **localStorage** — o backend (`backend/`) existe como projeto separado, com Fase 0 (fundação) e Fase 1 (perfil de usuário) já implementadas, mas ainda não consumido pelo frontend. Ver [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md) para o estado de integração e [ROADMAP.md](../ROADMAP.md) para o plano de migração.

---

## 2. Stack técnico

### Frontend

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 + SWC, gerenciador Bun (npm também funciona) |
| Estilo | Tailwind CSS 3 + tailwindcss-animate |
| Componentes | shadcn/ui (Radix UI) |
| Roteamento | React Router DOM v6 |
| Animações | Framer Motion 12 |
| Estado servidor | TanStack Query 5 (scaffolding — sem fetch remoto ainda) |
| Formulários | React Hook Form + Zod |
| Notificações | Sonner + Radix Toast |
| Testes | Vitest + Testing Library |
| Tema | next-themes (forçado em `light`, decisão intencional) |

### Backend

| Camada | Tecnologia |
|---|---|
| Framework | Spring Boot 3.3.4 / Java 21 |
| Persistência | Spring Data JPA + Flyway (migrations versionadas, `ddl-auto=validate`) |
| Banco | H2 in-memory (perfil `local`) / PostgreSQL via Supabase (perfil `supabase`) |
| Autenticação | Supabase Auth — JWT ES256/P-256 validado via JWKS (OAuth2 Resource Server) |
| Mapeamento DTO↔Entity | MapStruct (compile-time, sem reflection em runtime) |
| Documentação de API | springdoc-openapi (Swagger UI em `/swagger-ui.html`) |
| Porta | 8081 |

---

## 3. Estrutura de pastas (frontend, resumo)

```
frontend/src/
├── App.tsx / main.tsx
├── assets/               # imagens estáticas (cidades, aulas)
├── components/
│   ├── ui/               # shadcn/ui
│   ├── course/           # AudioButton, ChapterQuiz, Flashcards
│   ├── dashboard/        # DashboardLayout, DashboardSidebar
│   ├── games/            # GapsGame, MemoryGame, WordSearchGame
│   └── landing/           # Seções da Landing Page
├── data/                 # courses.ts, games.ts, cities.ts, dele.ts, exam-banks.ts
├── i18n/                 # LanguageContext, locales/pt.ts, locales/en.ts
├── lib/                  # course-progress.ts, dashboard-stats.ts, progress.ts, stage-builders.ts, preferences.ts
└── pages/                # rotas públicas + pages/dashboard/*
```

Estrutura de pacotes do backend: ver [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md#3-arquitetura-do-backend).

---

## 4. Páginas e rotas (frontend)

| Rota | Página | Descrição |
|---|---|---|
| `/` | `Landing` | Landing page pública com preloader animado |
| `/login` | `Login` | Formulário + Google Auth (mock — ver [specs/SECURITY.md](SECURITY.md)) |
| `/cadastro` | `Cadastro` | Registro de conta (mock) |
| `/dashboard` | `DashboardHome` | Visão geral: XP, streak, missões, ranking, conquistas |
| `/dashboard/cursos` | `DashboardCursos` | Seleção de nível de curso |
| `/dashboard/jogos` | `DashboardJogos` | Hub de jogos |
| `/dashboard/progresso` | `DashboardProgresso` | Gráfico semanal, histórico de quizzes |
| `/dashboard/perfil` | `DashboardPerfil` | Perfil do usuário |
| `/dashboard/perfil/editar` | `DashboardPerfilEditar` | Edição de perfil |
| `/dashboard/configuracoes` | `DashboardConfig` | Preferências (som, tamanho de fonte, etc.) |
| `/jogos` | `Jogos` | Lista de categorias de jogos |
| `/jogos/:catId` | `Categoria` | Fases disponíveis da categoria |
| `/jogos/:catId/:level/:stage` | `Fase` | Jogo em execução |
| `/cursos` | `Cursos` | Todos os níveis (A1–B2) |
| `/cursos/:level` | `NivelCurso` | Capítulos do nível com % de progresso |
| `/cursos/:level/capitulo/:chapterId` | `Capitulo` | Tabs: Conteúdo / Exercícios / Quiz / Revisão |
| `/cursos/:level/prueba` | `Prueba` | Prova final do nível |
| `/dele/:id` | `DeleDetail` | Detalhe do exame DELE |
| `/aula/:id` | `Aula` | Aula avulsa com correção por IA (mock — ver [ai/AI_SPEC.md](../ai/AI_SPEC.md)) |
| `*` | `NotFound` | 404 |

> `src/pages/Index.tsx` existe no repositório mas não está registrado em nenhuma rota — sobra do template inicial (Lovable/`vite_react_shadcn_ts`). Candidato a remoção.

---

## 5. Módulos de negócio (frontend)

### `data/courses.ts` — hierarquia pedagógica

```typescript
Course { level: "A1"|"A2"|"B1"|"B2", title, chapters: Chapter[] }
Chapter { id, number, title/titleEn, summary/summaryEn, briefReview?,
          topics: Topic[], lexicon: LexiconEntry[], flashcards?, quiz?, commonMistakes? }
Topic { id, title, titleEn, blocks: TopicBlock[], exercises: Exercise[] }
Exercise { id, type: "multiple-choice"|"fill-in", question/questionEn, options?, answer, explanation? }
LexiconEntry { es, pt, en?, tag?, example? }
```

### `lib/course-progress.ts` — CRUD de progresso (`localStorage["spanish-ai-course-v1"]`)

| Função | O que faz |
|---|---|
| `markTopicRead` | Marca tópico como lido |
| `markExerciseCorrect` | Registra exercício correto |
| `saveExam` / `saveChapterQuiz` | Salva resultado da prova/quiz |
| `getChapterCompletionPercent` / `getLevelCompletionPercent` | Ver fórmulas em [specs/BUSINESS_RULES.md](BUSINESS_RULES.md) |
| `isChapterUnlocked` / `isLevelUnlocked` | Ver thresholds em [specs/BUSINESS_RULES.md](BUSINESS_RULES.md) |
| `getStreak` / `registerStudyToday` | Dias consecutivos de estudo |
| `getRecommendedChapter` | Primeiro capítulo não-concluído desbloqueado |

### `lib/dashboard-stats.ts` — agregação

Combina curso + jogos, adiciona missões diárias, 8 conquistas, XP total, atividade semanal e histórico de quizzes. Detalhe completo em [specs/BUSINESS_RULES.md](BUSINESS_RULES.md).

### `lib/progress.ts` — progresso de jogos (`localStorage["spanish-ai-progress-v1"]`)

```typescript
ProgressState = {
  [catId: string]: {
    [levelId: string]: { [stage: number]: { stars: 1|2|3, xp: number, completedAt: number } }
  }
}
```

### `lib/stage-builders.ts` — geração procedural de fases

`buildGapsStage`, `buildMemoryStage`, `buildWordSearchStage` — o conteúdo dos jogos é gerado em código, nunca virou dado estático nem (no roadmap) tabela de banco.

---

## 6. Componentes principais

| Componente | Papel |
|---|---|
| `DashboardLayout.tsx` | Wrapper com sidebar responsiva (`<Outlet />`) |
| `Capitulo.tsx` | Coração do curso — tabs Conteúdo/Exercícios/Quiz/Revisão; marca tópicos lidos ao entrar; celebração ao atingir 100% |
| `ChapterQuiz.tsx` | Shuffle de questões, `multiple-choice`/`fill-in`, feedback imediato, salva só se novo score for melhor |
| `Flashcards.tsx` | Flip animation (Framer Motion), botões "Já sei"/"Não sei" (fila de revisão) |
| `AudioButton.tsx` | `SpeechSynthesisUtterance` (`lang="es-ES"`), velocidade normal/lenta, desabilita graciosamente se indisponível |
| `GameShell.tsx` | Shell dos jogos — header de progresso, resultado, navegação |

---

## 7. Jogos

| ID | Jogo | Status |
|---|---|---|
| `memoria` | Memória (pares ES/PT) | Disponível |
| `lacunas` | Preencher Lacunas | Disponível |
| `palavras` | Caça-palavras | Disponível |
| (outros) | Conjugação de verbos, Ditado, Ordenar frases | "Em breve" — ver [ROADMAP.md](../ROADMAP.md) |

Fórmulas de pontuação (`computeStars`/`computeXp`): ver [specs/BUSINESS_RULES.md](BUSINESS_RULES.md).

---

## 8. Internacionalização (i18n)

- Dois locales: `"pt"` (PT-BR) e `"en"` (Inglês)
- Detecção automática via `navigator.language` ou `localStorage["spanish-ai-locale"]`
- `useT()` retorna o objeto de traduções do locale atual; `useLanguage()` retorna `{ locale, setLocale, t }`
- Strings em `src/i18n/locales/pt.ts` e `en.ts` (~800 chaves cada)
- Helpers de conteúdo bilíngue: `pickL(pt, en, locale)` e `pickLArr(ptArr, enArr, locale)`

---

## 9. Setup e comandos

### Frontend (a partir de `frontend/`)

```bash
bun install        # ou npm install
bun dev             # dev server em http://localhost:8080 (porta fixa, ver vite.config.ts)
bun build            # build de produção -> dist/
bun build:dev        # build em modo development
bun preview          # servir o build de produção localmente
bun lint             # ESLint
bun test             # Vitest (run once)
bun test:watch       # Vitest (watch mode)
```

### Backend (a partir de `backend/`)

```bash
./mvnw spring-boot:run   # roda em http://localhost:8081
./mvnw test               # roda os testes (JUnit 5 + Spring Boot Test)
```

### Variáveis de ambiente

Frontend hoje não precisa de `.env` (tudo é localStorage). Quando a integração acontecer (ver ROADMAP):

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CLIENT_ID=
```

Backend, perfil `supabase` (ver [database/SCHEMA.md](SCHEMA.md#10-perfis-de-configuração-de-banco) e [infra/INFRA.md](../infra/INFRA.md)):

```env
SUPABASE_DB_URL=
SUPABASE_DB_USERNAME=
SUPABASE_DB_PASSWORD=
```

### Deploy

`bun build` gera `dist/`, publicável em qualquer host estático (Vercel, Netlify, GitHub Pages). Deploy do backend: ver [infra/INFRA.md](../infra/INFRA.md).
