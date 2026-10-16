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
  | B2 ✅ | 3.3 | 5.8 | 13/13 | 13/13 |
  | C1 ✅ | 3.2 | 5.8 | 13/13 | 13/13 |
  | C2 | 3.1 | 2.5 | **0/13** | 13/13 |

  **Pendências concretas que saem desta auditoria:**
  - [ ] B1–C2 estão abaixo da meta de 3–5 tópicos/capítulo e 5–10 exercícios/tópico — precisam de mais tópicos e exercícios por capítulo, na mesma proporção do A2.
    - B1: exercícios ✅ — +79 exercícios com explicação PT/EN, média subiu de 3.9 para 5.4 por tópico (todos os tópicos dos caps. 1–11 com 6–9). Tópicos ✅ — +15 tópicos (caps. 1–11 agora com 3 cada; média 3.2 tópicos/capítulo e 5.6 exercícios/tópico). Quiz ✅ — +104 perguntas com explicação PT/EN, todos os 13 capítulos com 10 (antes 1–4). Léxico ✅ — +48 entradas com exemplo, todos os 13 capítulos com 8 (antes 3–6), sem repetir os flashcards. Caps. 12–13 ✅ — +28 exercícios nos tópicos de projeto/referência (todos com ≥ 5). **B1 concluído:** 3.2 tópicos/capítulo, 6.3 exercícios/tópico (mín. 5), 10 perguntas de quiz, 8 entradas de léxico, 10 flashcards e `briefReview` PT/EN em todos os 13 capítulos.
    - **B2 concluído:** +12 tópicos (caps. 1–11 agora com 3 cada) e +186 exercícios com explicação PT/EN — 3.3 tópicos/capítulo, 5.8 exercícios/tópico (mín. 5; caps. 1–11 com 6 por tópico). Todos os 13 capítulos com 10 perguntas de quiz (antes 2–4), 8 entradas de léxico (antes 4–7) e 10 flashcards (antes 0), sem repetir o léxico. `briefReview` PT/EN dos caps. 1–8 e 10 reescrito para cobrir os tópicos novos. Exercícios novos de preenchimento indicam a forma pedida (ex.: "forma em -ra") porque a correção aceita uma única resposta.
    - **C1 concluído:** +10 tópicos (caps. 1–11 agora com 3 cada: jornalismo e verbos de citação, POR × PARA, falácias, precisão léxica, leitura de poesia com Machado e Lorca, marcadores conversacionais, expressões com corpo e animais, citação e paráfrase, acentuação gráfica, coesão textual) e +187 exercícios com explicação PT/EN — 3.2 tópicos/capítulo, 5.8 exercícios/tópico (mín. 5). Todos os 13 capítulos com 10 perguntas de quiz (antes 1–3), 8 entradas de léxico (antes 5–6), 10 flashcards (antes 0), `summaryEn` e `briefReviewEn` (antes ausentes). A dica de fonética do cap. 10 foi reescrita para tratar o seseo como variante culta, conforme a política de variantes do OVERVIEW §8.
  - [ ] Nenhum capítulo de C2 tem `flashcards` — o componente `Flashcards.tsx` fica vazio nesse nível inteiro. (B1 ✅, B2 ✅ e C1 ✅ — 10 flashcards por capítulo.)
  - [x] ~~Tradução para inglês incompleta no C1~~ — feito: todos os blocos de teoria com texto em português têm `textEn`/`itemsEn`/`headersEn` (listas só em espanhol, como verbos, refrões e latinismos, não precisam), 11 tabelas ganharam `rowsEn` (campo novo no tipo `table`, renderizado em `Capitulo.tsx`), todos os enunciados e opções em português têm `questionEn`/`optionsEn`, e os 76 exercícios antigos sem explicação ganharam `explanation`/`explanationEn`. O banco da prova final do C1 (`exam-banks.ts`) também está traduzido.
  - [ ] Mesma lacuna de inglês nos outros níveis: A2–C2 quase não têm `questionEn`/`optionsEn` (enunciados em português aparecem em português na interface em inglês), boa parte dos blocos de teoria não tem `textEn`/`itemsEn`, nenhuma tabela tem `rowsEn`, e os bancos de prova (`exam-banks.ts`) de A1–B2 e C2 não têm EN. O C1 serve de referência de como deve ficar.
  - [ ] O campo `exam` de cada nível em `data/courses.ts` não é usado em lugar nenhum — a prova final sorteia só de `exam-banks.ts`. Remover ou reaproveitar.
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

- [x] Prova final (`Prueba.tsx`) agora segue o idioma da interface: textos via `t.cursos.prueba` (pt/en), enunciados/opções/dicas com fallback para português e resposta correta mostrada no idioma da interface; `useMemo` movido para antes dos `return` condicionais (violava a regra de hooks). `ChapterQuiz` também mostra a resposta correta no idioma da interface.
- [x] C1 completo: tópicos, exercícios com explicação PT/EN, quiz (10), léxico (8) e flashcards (10) em todos os 13 capítulos, mais `summaryEn`/`briefReviewEn` que faltavam em todos os capítulos.
- [x] B2 completo: tópicos, exercícios com explicação PT/EN, quiz (10), léxico (8) e flashcards (10) em todos os 13 capítulos — mesmo padrão do B1.
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
