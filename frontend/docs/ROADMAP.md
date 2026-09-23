# Frontend — Roadmap

> Tudo que falta implementar/corrigir no frontend, em ordem de prioridade. Para o que o frontend já é hoje, ver [OVERVIEW.md](OVERVIEW.md). Para o roadmap do backend, ver [backend/docs/ROADMAP.md](../../backend/docs/ROADMAP.md).

---

## Pendências abertas

- [ ] **Correção de IA real em "Aula"** (`Aula.tsx`, `mockAnalyze`) — hoje 100% mockada, devolve feedback fixo pra qualquer texto. É a promessa central do produto sem implementação real por trás; alto impacto. Depende da Fase 7 do [backend/docs/ROADMAP.md](../../backend/docs/ROADMAP.md).
- [ ] **`GoogleAuthButton.tsx` é só visual** — não implementa OAuth real, grava um usuário fake no `localStorage`. Resolvido "de graça" assim que a Fase 1/2 de integração com o backend (Supabase Auth com Google como provider) entrar.
- [ ] **Reescrever `LandingPricing.tsx`/`pt.ts`/`en.ts`** para os 3 planos atuais — Free, Mensal (R$ 89,90) e Anual (R$ 699,90) — hoje ainda mostram o modelo antigo (Free/Pro R$29/Equipes com "Painel de administrador") que não reflete a decisão de negócio atual (ver [OVERVIEW.md](OVERVIEW.md)).
- [ ] **Cadastro precisa coletar dados de pagamento** — hoje `Cadastro.tsx` só pede nome/e-mail/senha. Falta integrar com o gateway de pagamento externo escolhido (ver [backend/docs/OVERVIEW.md §7](../../backend/docs/OVERVIEW.md#7-modelo-de-negócio-assinatura--sem-código-ainda)) antes de liberar acesso à área logada.
- [ ] Notificações/lembretes sem implementação real (`DashboardConfig.tsx`, `preferences.ts`) — toggles existem na UI mas não disparam nada.
- [ ] Senha em texto puro no `localStorage` (`DashboardPerfilEditar.tsx`) — aceitável só até existir backend; nunca reintroduzir comparação client-side depois que a auth migrar.
- [ ] Testar `AudioButton` em Firefox (Web Speech API tem suporte inconsistente).
- [ ] Auditar profundidade/qualidade do conteúdo em `data/courses.ts` — os 6 níveis (A1–C2) já têm 13 capítulos cada estruturalmente; falta confirmar se todos atingem a meta de 3–5 tópicos/capítulo e 5–10 exercícios/tópico com a mesma qualidade do A1.

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
