# Frontend — Visão Geral

> O que o produto é, para quem, e como o código está organizado hoje. Para o que falta fazer, ver [ROADMAP.md](ROADMAP.md).

---

## 1. Visão de produto

**SpanishAI Platform** é um curso de espanhol **100% guiado por IA**, vendido por assinatura. A jornada do usuário é:

1. **Landing page pública** (`Landing.tsx`) — apresenta o produto para quem ainda não é cliente: o que é o curso, os módulos/níveis (A1 → C2, os seis níveis do CEFR), os jogos, a preparação para o DELE, e o valor da assinatura. Informativa e aberta a todos, sem gate.
2. **Cadastro** (`Cadastro.tsx`) — a pessoa cria a conta (nome/e-mail/senha ou login social Google) **e** informa os dados de pagamento da assinatura. Os dados bancários/cartão devem passar por um **gateway de pagamento externo** (nunca processados diretamente pela aplicação) — decisão de fornecedor (Stripe vs. Mercado Pago/Asaas) ainda pendente, ver [backend/docs/OVERVIEW.md §7](../../backend/docs/OVERVIEW.md#7-modelo-de-negócio-assinatura--sem-código-ainda).
3. **Área logada** (`/dashboard/*`, `/jogos/*`, `/cursos/*`, `/aula/:id`, `/dele/:id`) — depois do cadastro/login, o usuário entra direto na experiência completa: dashboard com progresso, jogos, todos os níveis de curso, provas/exercícios, preparação para o DELE e configurações pessoais. Não existe uma área de administração separada para equipe interna — é a mesma área do aluno, só que logada (às vezes chamada informalmente de "backoffice" — é a mesma coisa).

**Planos de assinatura:** Free (acesso limitado, escopo exato ainda a definir), Mensal (R$ 89,90/mês) e Anual (R$ 699,90/ano, ~35% mais barato que 12 meses do mensal) — os dois pagos dão acesso completo (todos os níveis, jogos, DELE, correção de IA). A tela de preços (`LandingPricing.tsx`) já mostra esses três planos.

## 2. Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build | Vite 5 + SWC, gerenciador Bun (npm também funciona) |
| Estilo | Tailwind CSS 3 + tailwindcss-animate |
| Componentes | shadcn/ui (Radix UI) |
| Roteamento | React Router DOM v6 |
| Animações | Framer Motion 12 |
| Estado servidor | TanStack Query 5 — **scaffolding**, sem fetch remoto ainda |
| Formulários | React Hook Form + Zod |
| Notificações | Sonner + Radix Toast |
| Testes | Vitest + Testing Library |
| Tema | next-themes, forçado em `light` (decisão intencional, ver seção 8) |

## 3. Arquitetura atual: por camada técnica (não por módulo/feature)

O código hoje é organizado **por tipo técnico**, não por domínio de negócio — não existe `src/features/` nem `src/modules/`:

```
frontend/src/
├── pages/                # uma pasta flat por página+rota; só dashboard/ tem subpasta própria
│   └── dashboard/
├── components/
│   ├── ui/               # primitivos shadcn/ui, sem lógica de negócio
│   ├── course/            # AudioButton, ChapterQuiz, Flashcards
│   ├── dashboard/         # DashboardLayout, DashboardSidebar
│   ├── games/              # GapsGame, MemoryGame, WordSearchGame
│   └── landing/            # todas as seções da landing (hero, preços, depoimentos...)
├── data/                  # courses.ts, games.ts, cities.ts, dele.ts, exam-banks.ts
├── lib/                   # course-progress.ts, dashboard-stats.ts, progress.ts, stage-builders.ts, preferences.ts, utils.ts
├── i18n/                  # LanguageContext, locales/pt.ts, locales/en.ts
└── hooks/
```

Ou seja: o conteúdo de curso (`data/courses.ts`), a lógica de progresso (`lib/course-progress.ts`) e a página que os consome (`pages/Capitulo.tsx`) vivem em três pastas de topo diferentes — não há uma pasta que "seja dona" de tudo que é curso, ou de tudo que é auth, do início ao fim. As subpastas dentro de `components/` (`course/`, `dashboard/`, `games/`, `landing/`) têm nomes de feature, mas guardam só componentes de UI — os dados e a lógica de negócio da mesma feature moram em `data/`/`lib/`, separados.

**Isso não é um erro a corrigir agora** — é o padrão real do projeto hoje, documentado aqui para não ser confundido com uma arquitetura modular/por feature (que teria uma pasta só por domínio contendo página+componentes+dados+lógica). Vale reconsiderar migrar para módulos se o número de páginas/domínios crescer muito e a navegação entre `pages/`, `components/`, `lib/` e `data/` para entender uma única feature começar a doer.

## 4. Provider nesting e mapa de rotas

Provider nesting em `App.tsx`:

```
ErrorBoundary
 → ThemeProvider (forcedTheme="light")
   → QueryClientProvider (TanStack Query — sem fetch remoto ainda)
     → TooltipProvider
       → LanguageProvider (i18n pt/en)
         → BrowserRouter
```

**Rotas públicas:**

| Rota | Página |
|---|---|
| `/` | `Landing` |
| `/login` | `Login` |
| `/cadastro` | `Cadastro` |
| `*` | `NotFound` |

**Rotas protegidas** (`ProtectedRoute` → `DashboardLayout`):

| Rota | Página | Descrição |
|---|---|---|
| `/dashboard` | `DashboardHome` | XP, streak, missões, ranking, conquistas |
| `/dashboard/cursos` | `DashboardCursos` | Seleção de nível |
| `/dashboard/jogos` | `DashboardJogos` | Hub de jogos |
| `/dashboard/progresso` | `DashboardProgresso` | Progresso agregado, tempo de estudo |
| `/dashboard/perfil` | `DashboardPerfil` | Perfil do usuário |
| `/dashboard/perfil/editar` | `DashboardPerfilEditar` | Edição de perfil (ver nota de segurança na seção 6) |
| `/dashboard/configuracoes` | `DashboardConfig` | Preferências (som, fonte, notificações) |
| `/jogos` | `Jogos` | Lista de categorias de jogos |
| `/jogos/:catId` | `Categoria` | Fases da categoria |
| `/jogos/:catId/:level/:stage` | `Fase` | Jogo em execução |
| `/cursos` | `Cursos` | Todos os níveis (A1–C2) |
| `/cursos/:level` | `NivelCurso` | Capítulos do nível |
| `/cursos/:level/capitulo/:chapterId` | `Capitulo` | Conteúdo / Exercícios / Quiz / Revisão |
| `/cursos/:level/prueba` | `Prueba` | Prova final do nível |
| `/dele/:id` | `DeleDetail` | Detalhe do exame DELE |
| `/aula/:id` | `Aula` | Aula avulsa com correção por IA (mock, ver [ROADMAP.md](ROADMAP.md)) |

`ProtectedRoute` (`src/components/ProtectedRoute.tsx`) hoje só checa `Boolean(localStorage.getItem("spanish-ai-user"))` — sem validação de token, sem expiração.

## 5. Domínios centrais e chaves de `localStorage`

- **Conteúdo de curso** — `src/data/courses.ts`: `Course (A1–C2) > Chapter > Topic > Block/Exercise/LexiconEntry`. Dado estático, sem persistência.
- **Progresso de curso** — `src/lib/course-progress.ts`, chave `spanish-ai-course-v1`. Tópicos lidos, exercícios corretos, notas de quiz/prova, streak de estudo.
- **Progresso de jogos** — `src/lib/progress.ts`, chave `spanish-ai-progress-v1`. Formato: `{ [catId]: { [levelId]: { [stage]: { stars, xp, completedAt } } } }`.
- **Agregação do dashboard** — `src/lib/dashboard-stats.ts` combina os dois anteriores e adiciona missões diárias, 8 conquistas, XP total (`Math.floor(XP/100)+1` = nível do usuário), atividade semanal e heartbeat real de tempo de estudo (`spanish-ai-study-time-v1`, via `registerStudyHeartbeat()` a cada 30s enquanto a aba está visível — ver `Capitulo.tsx`).
- **Jogos** — `src/lib/stage-builders.ts` gera proceduralmente o conteúdo dos três jogos implementados (Memória, Lacunas/`GapsGame`, Caça-palavras/`WordSearchGame`); os demais aparecem como "em breve" em `src/data/games.ts`.
- **i18n** — `src/i18n/` suporta só `pt` e `en`, detectado por `navigator.language` ou `localStorage["spanish-ai-locale"]`. `useT()`/`useLanguage()`; conteúdo bilíngue usa `pickL(pt, en, locale)`/`pickLArr(...)`.

## 6. Regras de negócio implementadas hoje no cliente

Hoje todas calculadas em `src/lib/`; o roadmap do backend move este cálculo para o servidor (ver [backend/docs/OVERVIEW.md §5](../../backend/docs/OVERVIEW.md#5-banco-de-dados)).

- **Conclusão de capítulo:** `% = (tópicos lidos/total)×50 + (exercícios corretos/total)×30 + (quiz ≥ 70% ? 20 : 0)`. Nível = média dos capítulos × 0.9 + 10% se a prova final foi feita.
- **Desbloqueio:** capítulo/nível anterior precisa ter ≥ 80% de conclusão. A1 e Capítulo 1 sempre desbloqueados.
- **XP e nível:** XP = soma do XP dos jogos + bônus de missões. `Nível = Math.floor(XP/100)+1`; barra de progresso = XP atual / (nível × 100).
- **Streak:** dias consecutivos de estudo, calculado retroativamente a partir de hoje sobre os dias com heartbeat registrado.
- **Pontuação de jogos:** `computeStars(ratio)`: `<0.7` → 1 estrela, `<0.95` → 2, `≥0.95` → 3. `computeXp(stars, level) = base × stars`, `base` = A1:30 · A2:40 · B1:60 · B2:80 · C1:100 · C2:120.
- **Ranking:** posição/XP do próprio aluno são reais (`getTotalXp()`); os outros 24 perfis são fixos/fictícios (`MOCK_COMPETITORS`), pois não existe backend com múltiplos usuários reais ainda.
- **Quiz de texto livre:** score acumulado de forma síncrona (`useRef`); resposta comparada via `normalizeAnswer()` (trim + lowercase + remoção de acento, `src/lib/utils.ts`) — corrigido para tolerar acentuação.

## 7. Componentes principais

| Componente | Papel |
|---|---|
| `DashboardLayout.tsx` | Wrapper com sidebar responsiva (`<Outlet />`) |
| `Capitulo.tsx` | Coração do curso — tabs Conteúdo/Exercícios/Quiz/Revisão, marca tópicos lidos, celebra 100% |
| `ChapterQuiz.tsx` | Shuffle de questões, `multiple-choice`/`fill-in`, feedback imediato |
| `Flashcards.tsx` | Flip animation, botões "Já sei"/"Não sei" (fila de revisão) |
| `AudioButton.tsx` | `SpeechSynthesisUtterance` (`lang="es-ES"`), velocidade normal/lenta |
| `GameShell.tsx` | Shell dos jogos — header de progresso, resultado, navegação |
| `GoogleAuthButton.tsx` | Hoje é mock — simula login Google e grava usuário fake no `localStorage` |

## 8. Decisões intencionais

- **Dark mode desativado** (`forcedTheme="light"` em `App.tsx`) — consistência visual da landing page, não esquecimento.
- **Áudio via Web Speech API nativa** (`AudioButton.tsx`) — placeholder até existir áudio gravado real; comportamento inconsistente entre browsers é o trade-off conhecido (Firefox em particular).
- **Variante do espanhol: base peninsular (Espanha), com notas das variantes latino-americanas** — vale para todo o conteúdo de `data/courses.ts` (A1 → C2) e deve ser seguido ao criar conteúdo novo:
  - Gramática e vocabulário ensinados como padrão são os da Espanha: *vosotros* como plural informal (incluindo o imperativo *hablad/sentaos*), Pretérito Perfecto para o passado recente (*hoy he comido*), *móvil, ordenador, coche, piso, conducir, zumo, echar de menos, quedar con*.
  - Onde a América Latina difere, o conteúdo **mostra a alternativa em nota/dica** em vez de omiti-la: *ustedes* para tudo, *extrañar*, Indefinido cobrindo o passado recente, *celular/computadora/carro/manejar*. O capítulo 13 do B1 (variantes regionais) concentra os contrastes.
  - Exercícios e quizzes **não podem ter como única resposta certa uma forma que seria correta em uma variante e marcada errada na outra** (ex.: não pedir Perfecto × Indefinido com *hoy* como pergunta fechada).

## 9. Estado de integração com o backend

**Zero hoje.** Nenhuma chamada `fetch`/`axios` sai de `frontend/src` — login, cadastro, Google Auth, `ProtectedRoute` e a tela de preços são 100% mock/estático. `TanStack Query` está montado em `App.tsx` mas não busca nada remoto — é scaffolding para a integração futura (ver [backend/docs/OVERVIEW.md](../../backend/docs/OVERVIEW.md) e [ROADMAP.md](ROADMAP.md)).
