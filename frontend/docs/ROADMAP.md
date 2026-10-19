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
  | A1 ✅ | 3.2 | 5.8 | 13/13 | 13/13 |
  | A2 ✅ | 3.2 | 9.4 | 13/13 | 13/13 |
  | B1 ✅ | 3.2 | 6.3 | 13/13 | 13/13 |
  | B2 ✅ | 3.3 | 5.8 | 13/13 | 13/13 |
  | C1 ✅ | 3.2 | 5.8 | 13/13 | 13/13 |
  | C2 | 3.1 | 2.5 | **0/13** | 13/13 |

  **Pendências concretas que saem desta auditoria:**
  - [ ] B1–C2 estão abaixo da meta de 3–5 tópicos/capítulo e 5–10 exercícios/tópico — precisam de mais tópicos e exercícios por capítulo, na mesma proporção do A2.
    - B1: exercícios ✅ — +79 exercícios com explicação, média subiu de 3.9 para 5.4 por tópico (todos os tópicos dos caps. 1–11 com 6–9). Tópicos ✅ — +15 tópicos (caps. 1–11 agora com 3 cada; média 3.2 tópicos/capítulo e 5.6 exercícios/tópico). Quiz ✅ — +104 perguntas com explicação, todos os 13 capítulos com 10 (antes 1–4). Léxico ✅ — +48 entradas com exemplo, todos os 13 capítulos com 8 (antes 3–6), sem repetir os flashcards. Caps. 12–13 ✅ — +28 exercícios nos tópicos de projeto/referência (todos com ≥ 5). **B1 concluído:** 3.2 tópicos/capítulo, 6.3 exercícios/tópico (mín. 5), 10 perguntas de quiz, 8 entradas de léxico, 10 flashcards e `briefReview` em todos os 13 capítulos.
    - **B2 concluído:** +12 tópicos (caps. 1–11 agora com 3 cada) e +186 exercícios com explicação — 3.3 tópicos/capítulo, 5.8 exercícios/tópico (mín. 5; caps. 1–11 com 6 por tópico). Todos os 13 capítulos com 10 perguntas de quiz (antes 2–4), 8 entradas de léxico (antes 4–7) e 10 flashcards (antes 0), sem repetir o léxico. `briefReview` dos caps. 1–8 e 10 reescrito para cobrir os tópicos novos. Exercícios novos de preenchimento indicam a forma pedida (ex.: "forma em -ra") porque a correção aceita uma única resposta.
    - **C1 concluído:** +10 tópicos (caps. 1–11 agora com 3 cada: jornalismo e verbos de citação, POR × PARA, falácias, precisão léxica, leitura de poesia com Machado e Lorca, marcadores conversacionais, expressões com corpo e animais, citação e paráfrase, acentuação gráfica, coesão textual) e +187 exercícios com explicação — 3.2 tópicos/capítulo, 5.8 exercícios/tópico (mín. 5). Todos os 13 capítulos com 10 perguntas de quiz (antes 1–3), 8 entradas de léxico (antes 5–6) e 10 flashcards (antes 0); os 76 exercícios antigos ganharam explicação. A dica de fonética do cap. 10 foi reescrita para tratar o seseo como variante culta, conforme a política de variantes do OVERVIEW §8.
    - **A1 concluído:** caps. 1–11 com 3 tópicos cada (antes 1–2) e 6 exercícios por tópico; 238 exercícios + quizzes, todos com explicação (antes nenhum). Cap. 1 reescrito: as 27 letras com nome e som (cartões de pronúncia), dígrafos CH/LL/RR tratados como dígrafos (RAE), sons que confundem brasileiros e acentuação. Tópicos novos: tú × usted, centenas e datas, gênero dos substantivos (el color, la leche…), HAY × ESTAR, verbos -ER/-IR, negação e frequência, comida e refeições, pronomes sujeito e de objeto, descrição de pessoas, preposições de lugar, A × EN e POR × PARA, também/tampoco. Cap. 13: quiz sem perguntas duplicadas e regra do DELE A1 corrigida (30/50 em cada grupo). Inglês que tinha sobrado dentro do texto da tabela de saudações foi removido.
    - **A2 concluído:** os 13 capítulos seguem o padrão de referência — 3.2 tópicos/capítulo (41 tópicos) e 9.4 exercícios/tópico (384 exercícios, mín. 5, todos com explicação), 10 perguntas de quiz, 8 entradas de léxico, 10 flashcards sem repetir o léxico e `briefReview` em todos os capítulos, validado pelo teste estrutural em `src/test/courses.test.ts` (caps. 12 e 13 admitem 3–6 tópicos; o cap. 13, de referência, exige parágrafo ou dica de uso em cada tópico em vez de parágrafo + exemplo). Cap. 13: as tabelas dos 5 materiais foram mantidas, e os exercícios soltos de tradução viraram itens verificáveis (múltipla escolha e preenchimento com uma só resposta). A linha do A2 na tabela de auditoria foi remedida com script sobre `COURSE` (exercícios dos tópicos, sem o quiz), substituindo os valores antigos 6.3 e 8.2.
  - [ ] **Áudio em todo o curso:** o A1 já usa a infraestrutura nova (bloco `sounds` com cartões de pronúncia, `audioCols` em tabelas, `speak` em listas e `audio` em exercícios/quiz para ouvir a frase ou fazer exercícios de escuta). Falta aplicar o mesmo em A2–C2 conforme cada nível for revisado. O áudio usa a voz do navegador (Web Speech API), agora escolhendo explicitamente uma voz es-ES quando instalada.
  - [ ] Nenhum capítulo de C2 tem `flashcards` — o componente `Flashcards.tsx` fica vazio nesse nível inteiro. (B1 ✅, B2 ✅ e C1 ✅ — 10 flashcards por capítulo.)
  - [x] ~~O campo `exam` de cada nível em `data/courses.ts` não é usado em lugar nenhum~~ — removido; a prova final usa só `exam-banks.ts`.
  - [x] ~~B1 tem `briefReview` só nos capítulos 12 e 13~~ — capítulos 1 a 11 preenchidos.

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
- [ ] Chat de dúvidas com IA — tutor conversacional em português
- [ ] Speech-to-Text para exercícios orais (avaliação de pronúncia)
- [ ] Adaptação de dificuldade automática — já existe a flag `getDifficulty() === "auto"` em `lib/preferences.ts`, mas nenhuma lógica a usa ainda

## Mobile

- [ ] PWA (service worker + manifest, instalação offline)
- [ ] App React Native (Expo + lógica de negócio compartilhada)
- [ ] Modo offline — baixar capítulos para estudo sem internet

---

## Concluído recentemente

- [x] A1 completo e com áudio: alfabeto inteiro com pronúncia, 3 tópicos por capítulo, explicações em todos os exercícios e quizzes, exercícios de escuta.
- [x] Site passou a ser só português → espanhol: removidos seletor de idioma, detecção do navegador, `en.ts` e os campos `*En` dos dados; conteúdo em espanhol marcado com `translate="no"`. Prova final (`Prueba.tsx`) agora lê os textos de `t.cursos.prueba` (antes fixos no componente) e teve o `useMemo` movido para antes dos `return` condicionais (violava a regra de hooks).
- [x] C1 completo: tópicos, exercícios com explicação, quiz (10), léxico (8) e flashcards (10) em todos os 13 capítulos.
- [x] B2 completo: tópicos, exercícios com explicação, quiz (10), léxico (8) e flashcards (10) em todos os 13 capítulos — mesmo padrão do B1.
- [x] B1: `flashcards` (10 por capítulo, sem repetir o léxico) nos 13 capítulos e `briefReview` nos capítulos 1–11.
- [x] `LandingPricing.tsx`/`pt.ts` reescritos para Free, Mensal (R$ 89,90) e Anual (R$ 699,90).
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
