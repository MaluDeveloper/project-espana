# Frontend — Roadmap

> Tudo que falta implementar/corrigir no frontend, em ordem de prioridade. Para o que o frontend já é hoje, ver [OVERVIEW.md](OVERVIEW.md). Para o roadmap do backend, ver [backend/docs/ROADMAP.md](../../backend/docs/ROADMAP.md).

---

## Pendências abertas

- [ ] **Correção de IA real em "Aula"** (`Aula.tsx`, `mockAnalyze`) — hoje 100% mockada, devolve feedback fixo pra qualquer texto. É a promessa central do produto sem implementação real por trás; alto impacto. Depende da Fase 7 do [backend/docs/ROADMAP.md](../../backend/docs/ROADMAP.md).
- [ ] **`GoogleAuthButton.tsx` é só visual** — não implementa OAuth real, grava um usuário fake no `localStorage`. Resolvido "de graça" assim que a Fase 1/2 de integração com o backend (Supabase Auth com Google como provider) entrar.
- [ ] **Cadastro precisa coletar dados de pagamento** — hoje `Cadastro.tsx` só pede nome/e-mail/senha. Falta integrar com o gateway de pagamento externo escolhido (ver [backend/docs/OVERVIEW.md §7](../../backend/docs/OVERVIEW.md#7-modelo-de-negócio-assinatura--sem-código-ainda)) antes de liberar acesso à área logada.
- [ ] Notificações/lembretes sem implementação real (`DashboardConfig.tsx`, `preferences.ts`) — toggles existem na UI mas não disparam nada.
- [ ] Senha em texto puro no `localStorage` (`DashboardPerfilEditar.tsx`) — aceitável só até existir backend; nunca reintroduzir comparação client-side depois que a auth migrar.
- [ ] Testar `AudioButton` em Firefox (Web Speech API tem suporte inconsistente).
- [x] ~~Auditar profundidade/qualidade do conteúdo em `data/courses.ts`~~ — feito. Todos os 6 níveis têm 13 capítulos, mas a densidade cai muito depois do A2 e **piora progressivamente** (o oposto do esperado num nível avançado):

  | Nível | Tópicos/capítulo | Exercícios/tópico | Flashcards | `briefReview` |
  |---|---|---|---|---|
  | A1 | 1.9 | 8.7 | 13/13 | 13/13 |
  | A2 | 6.3 | 8.2 | 12/13 | 13/13 |
  | B1 ✅ | 3.2 | 6.3 | 13/13 | 13/13 |
  | B2 | 2.4 | 3.6 | **0/13** | 13/13 |
  | C1 | 2.5 | 2.8 | **0/13** | 13/13 |
  | C2 | 3.1 | 2.5 | **0/13** | 13/13 |

  **Pendências concretas que saem desta auditoria:**
  - [ ] B1–C2 estão abaixo da meta de 3–5 tópicos/capítulo e 5–10 exercícios/tópico — precisam de mais tópicos e exercícios por capítulo, na mesma proporção do A2.
    - B1: exercícios ✅ — +79 exercícios com explicação PT/EN, média subiu de 3.9 para 5.4 por tópico (todos os tópicos dos caps. 1–11 com 6–9). Tópicos ✅ — +15 tópicos (caps. 1–11 agora com 3 cada; média 3.2 tópicos/capítulo e 5.6 exercícios/tópico). Quiz ✅ — +104 perguntas com explicação PT/EN, todos os 13 capítulos com 10 (antes 1–4). Léxico ✅ — +48 entradas com exemplo, todos os 13 capítulos com 8 (antes 3–6), sem repetir os flashcards. Caps. 12–13 ✅ — +28 exercícios nos tópicos de projeto/referência (todos com ≥ 5). **B1 concluído:** 3.2 tópicos/capítulo, 6.3 exercícios/tópico (mín. 5), 10 perguntas de quiz, 8 entradas de léxico, 10 flashcards e `briefReview` PT/EN em todos os 13 capítulos.
  - [ ] Nenhum capítulo de B2, C1 ou C2 tem `flashcards` — o componente `Flashcards.tsx` fica vazio nesses níveis inteiros. (B1 ✅ — 10 flashcards por capítulo.)
  - [x] ~~B1 tem `briefReview` só nos capítulos 12 e 13~~ — capítulos 1 a 11 preenchidos (PT/EN).

## Integração com backend real

- [ ] Trocar login/cadastro mockado por `supabase-js` real (`signUp`/`signInWithPassword`/`signInWithOAuth({provider:'google'})`) + chamada ao backend (ver [backend/docs/OVERVIEW.md](../../backend/docs/OVERVIEW.md))
- [ ] Migrar os `localStorage` writes para chamadas de API via TanStack Query
- [ ] Gate de rota por assinatura ativa — `ProtectedRoute` passa a checar assinatura, não só sessão
- [ ] Sincronização de progresso entre dispositivos
- [ ] Ranking real com múltiplos usuários (remove `MOCK_COMPETITORS`)

## Conteúdo & jogos

- [ ] Novos jogos: conjugação de verbos, ditado (Speech-to-Text), ordenar palavras para formar frases
- [ ] Diálogos — implementar o bloco `dialogue` (tipo já planejado em `data/courses.ts`: `{ kind: "dialogue", lines: { speaker, es, pt }[] }`), renderizado com `AudioButton` por linha

## Gamificação avançada

- [ ] Ligas semanais (grupos de 20–30 usuários, reset semanal)
- [ ] Sistema de notificações (Web Push API ou OneSignal)
- [ ] Modo desafio — duelos entre dois usuários em tempo real
- [ ] Certificados em PDF ao completar nível/DELE

## IA & personalização

- [ ] Exercícios gerados por IA personalizados com base nas fraquezas do aluno
- [ ] Chat de dúvidas com IA — tutor conversacional em PT/EN
- [ ] Speech-to-Text para exercícios orais (avaliação de pronúncia)
- [ ] Adaptação de dificuldade automática — já existe a flag `getDifficulty() === "auto"` em `lib/preferences.ts`, mas nenhuma lógica a usa ainda

## Mobile

- [ ] PWA (service worker + manifest, instalação offline)
- [ ] App React Native (Expo + lógica de negócio compartilhada)
- [ ] Modo offline — baixar capítulos para estudo sem internet

---

## Concluído recentemente

- [x] B1: `flashcards` (10 por capítulo, sem repetir o léxico) nos 13 capítulos e `briefReview`/`briefReviewEn` nos capítulos 1–11.
- [x] `LandingPricing.tsx`/`pt.ts`/`en.ts` reescritos para Free, Mensal (R$ 89,90) e Anual (R$ 699,90).
- [x] Hero da landing trocado por hero 3D interativo (`components/ui/orbit-delivery-hero.tsx`).
- [x] Erro de tipo em `DashboardProgresso.tsx` (`course.titleEn` inexistente) — título do nível agora vem de `t.cursos.listing.levels`.
- [x] `todayIso()` corrigido para horário local (era UTC) — centralizado em `lib/utils.ts` (`todayIso`/`localIso`), removida a duplicata em `dashboard-stats.ts`/`course-progress.ts`; `getStreak()` também corrigido.
- [x] `saveStage` (`lib/progress.ts`) agora atualiza `completedAt` mesmo em empate de recorde — repetir uma fase hoje passa a contar pra missão diária.
- [x] Quiz de texto livre agora tolera acentuação (`normalizeAnswer()` em `lib/utils.ts`).
- [x] `autoComplete` adicionado nos campos de `Cadastro.tsx` (Login e PerfilEditar já tinham).
- [x] Removido `src/pages/Index.tsx` (sobra do template inicial, não usado).
- [x] Botão "Não sei" nos flashcards (fila de revisão).
- [x] `ProtectedRoute` implementado para rotas do dashboard.
- [x] Tempo de estudo real (heartbeat) em vez de estimativa fixa.
- [x] XP/posição do próprio aluno reais no ranking (concorrentes seguem mock).
- [x] `MemoryGame` — condição de vitória por `pairId`.
