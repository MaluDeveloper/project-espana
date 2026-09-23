# Backend — Roadmap

> Tudo que falta implementar/corrigir no backend, em ordem de dependência. Para o que o backend já é hoje, ver [OVERVIEW.md](OVERVIEW.md). Para o roadmap do frontend, ver [frontend/docs/ROADMAP.md](../../frontend/docs/ROADMAP.md).

---

## Fase 0 — Fundação e infraestrutura ✅ concluída

- [x] Conexão real com Supabase Postgres (perfil `supabase`, mantendo H2 para `local`)
- [x] Flyway introduzido, migration baseline (`V1__baseline.sql`)
- [x] `JwtDecoder` via JWKS (ES256/P-256) + `CurrentUserProvider`
- [x] `GlobalExceptionHandler`, convenções de DTO (`ApiError`), OpenAPI/Swagger

## Fase 1 — Usuário e perfil 🟡 parcialmente concluída

- [x] `profiles` (migration `V2`) + `user_preferences` (migration `V3`)
- [x] Provisionamento lazy de perfil (`ProfileService`)
- [x] `GET/PUT /api/users/me` e `GET/PUT /api/users/me/preferences`
- [ ] Frontend trocar login/cadastro mockado pelo `supabase-js` real + chamada a este backend (ver [frontend/docs/ROADMAP.md](../../frontend/docs/ROADMAP.md))

## Fase 1.5 — Assinatura e billing 🔲 bloqueada — decisão de gateway pendente

- Modelo de negócio já definido: 3 planos — Free, Mensal (R$ 89,90) e Anual (R$ 699,90) — gate de acesso completo à área do aluno para os pagos (ver [OVERVIEW.md §7](OVERVIEW.md#7-modelo-de-negócio-assinatura--sem-código-ainda)). Dados bancários/pagamento via gateway externo — este backend nunca lida com eles diretamente.
- **Bloqueio real:** escolha do gateway (Stripe vs. Mercado Pago/Asaas) ainda não feita — o desenho de schema (`subscriptions`, `subscription_events`), webhook e SDK dependem dessa escolha.
- [ ] Decidir gateway (dona do produto)
- [ ] Novo contexto `subscription`, espelhando o layout hexagonal do `user`
- [ ] `POST /api/subscriptions/checkout`, webhook do gateway, `GET /api/subscriptions/me`
- [ ] Frontend: gate de rota — `ProtectedRoute` passa a checar assinatura ativa, não só sessão

## Fase 2 — Catálogo de cursos (somente leitura) 🔲

- [ ] `courses`, `chapters`, `topics`, `topic_blocks`, `exercises`, `lexicon_entries`
- [ ] Migration/seed que importa o conteúdo hoje estático de `frontend/src/data/courses.ts`
- [ ] Endpoints de leitura; frontend passa a buscar da API (com fallback para o import estático durante a transição)

## Fase 3 — Progresso do curso 🔲

- [ ] `topic_reads`, `exercise_attempts`, `chapter_quiz_results`, `exam_results`
- [ ] `ProgressService`: fórmula de % de conclusão, threshold de desbloqueio (≥ 80%), normalização de acentuação na resposta livre (já corrigida no cliente — ver frontend — mas o servidor deve ser o ponto único de verdade)

## Fase 4 — Jogos e XP 🔲

- [ ] `game_categories`, `game_progress`, `xp_transactions`
- [ ] Lógica de UPSERT que sempre atualiza `completed_at`, mesmo empatando o recorde (mesma correção já aplicada no cliente — ver frontend — replicada aqui no design da tabela)

## Fase 5 — Gamificação (missões, conquistas, tempo de estudo/streak) 🔲

- [ ] `study_sessions` (heartbeat real, bucketing por timezone do perfil — nunca UTC puro)
- [ ] `daily_mission_progress`, `achievements`, `profile_achievements`
- [ ] `AchievementEvaluationService` reagindo a eventos de progresso/jogos/XP

## Fase 6 — Ranking 🔲

- [ ] `GET /api/ranking` como query agregada sobre `xp_transactions`
- [ ] Decisão de produto pendente: manter concorrentes fictícios seedados ou aceitar ranking pequeno no início

## Fase 7 — Correção de escrita com IA 🔲

- [ ] `writing_submissions`
- [ ] Integração backend → Claude API (chave nunca no cliente)
- [ ] `Aula.tsx` troca `mockAnalyze` pela chamada real
- É a integração de maior risco/custo externo (API paga, desenho de prompt) e a menos acoplada ao resto do schema (só precisa de `profile_id`) — fica por último para se apoiar em convenções já maduras de auth/erro/logging, mas pode ser desenvolvida a qualquer momento sem bloquear as outras fases.

---

## Problemas conhecidos relevantes ao backend

| Problema | Impacto | Status |
|---|---|---|
| Nenhum código de billing/checkout/webhook existe ainda | Bloqueia toda a Fase 1.5 | 🔴 aberto — aguardando decisão de gateway |
| Correção de IA em "Aula" é 100% mockada no cliente | Promessa central do produto sem implementação real | 🔴 aberto — depende da Fase 7 |
| `SecurityConfig.PUBLIC_PATHS` já não lista `/api/users` (rota corrigida) | — | ✅ nenhuma ação pendente — docs antigas que mencionavam essa inconsistência foram removidas nesta reorganização |

Vários bugs que hoje são "patches" no cliente (cálculo de streak em UTC, empate de missão diária, XP como estado local) têm correção estrutural embutida no desenho deste roadmap — não são retrabalho, são consequência de mover a regra de negócio para o servidor (ver [OVERVIEW.md §5](OVERVIEW.md#5-banco-de-dados)). O detalhe de cada bug do lado do cliente está em [frontend/docs/ROADMAP.md](../../frontend/docs/ROADMAP.md).
