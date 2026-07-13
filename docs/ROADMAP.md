# Roadmap

> Combina o roadmap de produto (frontend) e o roadmap de implementação do backend, já ajustado ao estado real do código (não ao planejamento original — ver notas "✅ já implementado" abaixo, que avançaram além do que os documentos originais previam).

---

## Backend — Fases de implementação

### Fase 0 — Fundação e infraestrutura ✅ concluída

- [x] Trocar H2 pela conexão real com Supabase Postgres nas configs (perfil `supabase`, mantendo H2 para `local`)
- [x] Flyway introduzido, migration baseline (`V1__baseline.sql`)
- [x] `JwtDecoder` via JWKS (ES256/P-256) + `CurrentUserProvider`
- [x] `GlobalExceptionHandler`, convenções de DTO (`ApiError`), OpenAPI/Swagger

### Fase 1 — Usuário e perfil 🟡 parcialmente concluída

- [x] `profiles` (migration `V2__create_profiles_table.sql` + entidade `Profile`)
- [x] Provisionamento lazy de perfil (`ProfileService`)
- [x] `GET/PUT /api/users/me`
- [ ] `user_preferences` (tabela + entidade + repository)
- [ ] Frontend trocar login/cadastro mockado pelo `supabase-js` real + chamada ao backend

### Fase 2 — Catálogo de cursos (somente leitura) 🔲

- [ ] `courses`, `chapters`, `topics`, `topic_blocks`, `exercises`, `lexicon_entries`
- [ ] Migration/seed que importa o conteúdo hoje estático de `frontend/src/data/courses.ts`
- [ ] Endpoints de leitura; frontend passa a buscar da API (com fallback para o import estático durante a transição)

### Fase 3 — Progresso do curso 🔲

- [ ] `topic_reads`, `exercise_attempts`, `chapter_quiz_results`, `exam_results`
- [ ] `ProgressService`: fórmula de % de conclusão, threshold de desbloqueio, normalização de acentuação na resposta livre (corrige o bug de acentuação do quiz no servidor)

### Fase 4 — Jogos e XP 🔲

- [ ] `game_categories`, `game_progress`, `xp_transactions`
- [ ] Lógica de UPSERT que sempre atualiza `completed_at` (corrige o bug de "empate não conta na missão")

### Fase 5 — Gamificação (missões, conquistas, tempo de estudo/streak) 🔲

- [ ] `study_sessions` (heartbeat real, bucketing por timezone — corrige o bug de fuso horário)
- [ ] `daily_mission_progress`, `achievements`, `profile_achievements`
- [ ] `AchievementEvaluationService` reagindo a eventos de progresso/jogos/XP

### Fase 6 — Ranking 🔲

- [ ] `GET /api/ranking` como query agregada sobre `xp_transactions`
- [ ] Decisão de produto pendente: manter concorrentes fictícios semeados ou aceitar ranking pequeno no início

### Fase 7 — Correção de escrita com IA 🔲

- [ ] `writing_submissions`
- [ ] Integração backend → Claude API (chave nunca no cliente)
- [ ] `Aula.tsx` troca `mockAnalyze` pela chamada real

Detalhe de cada fase (entidades, endpoints, testes, justificativa de ordem): ver [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md), [database/SCHEMA.md](database/SCHEMA.md) e [api/API_SPEC.md](api/API_SPEC.md).

---

## Produto (frontend) — Próximos passos

### Fase 1 — Correções imediatas ✅ maior parte concluída

- [x] Adicionar botão "Não sei" nos flashcards (fila de revisão)
- [x] Implementar `ProtectedRoute` para rotas do dashboard
- [x] Corrigir labels hardcoded em PT e o `pickL` com título duplicado
- [x] Tempo de estudo real (heartbeat) em vez de estimativa fixa
- [x] XP/posição do próprio aluno reais no ranking (concorrentes seguem mock)
- [x] `MemoryGame` — condição de vitória por `pairId`
- [x] Remover `src/assets/rascunho.png`
- [ ] **Correção de IA real em "Aula"** (hoje 100% mock — ver [ai/AI_SPEC.md](ai/AI_SPEC.md))
- [ ] Corrigir `todayIso()` para horário local (hoje usa UTC) — afeta streak/missões
- [ ] `saveStage` deve atualizar `completedAt` mesmo em empate de recorde
- [ ] Normalizar acentuação na comparação de respostas do quiz de texto livre
- [ ] Adicionar autocomplete nos campos de password do login/cadastro
- [ ] Testar `AudioButton` em Firefox (Speech API tem suporte inconsistente)
- [ ] Adicionar `.env*` ao `.gitignore` do frontend
- [ ] Remover `src/pages/Index.tsx` (não usado — sobra do template inicial)

### Fase 2 — Backend Real (mapeia diretamente para as fases do backend acima)

- [ ] Integrar Supabase (autenticação + banco de dados) no frontend
- [ ] Migrar os `localStorage` writes para chamadas de API via TanStack Query
- [ ] Google OAuth real via Supabase Auth
- [ ] Sincronização de progresso entre dispositivos
- [ ] Ranking real com múltiplos usuários

### Fase 3 — Conteúdo & Jogos

- [ ] Completar conteúdo A2, B1, B2 em `data/courses.ts` (6–10 capítulos, 3–5 tópicos/capítulo, 5–10 exercícios/tópico, 10–15 palavras no léxico por nível)
- [ ] Novos jogos: conjugação de verbos, ditado (Speech-to-Text), ordenar palavras para formar frases
- [ ] Diálogos — implementar o bloco `dialogue` (tipo já planejado em `data/courses.ts`: `{ kind: "dialogue", lines: { speaker, es, pt }[] }`), renderizado com `AudioButton` por linha

### Fase 4 — Gamificação Avançada

- [ ] Ligas semanais (grupos de 20–30 usuários, reset semanal)
- [ ] Ranking real com posição dinâmica (remover mock de vez)
- [ ] Sistema de notificações (Web Push API ou OneSignal)
- [ ] Modo desafio — duelos entre dois usuários em tempo real
- [ ] Certificados em PDF ao completar nível/DELE

### Fase 5 — IA & Personalização

Ver [ai/AI_SPEC.md](ai/AI_SPEC.md) seção 3 — correção de texto real, exercícios gerados por IA, chat tutor, avaliação de pronúncia, dificuldade adaptativa.

### Fase 6 — Mobile

- [ ] PWA (service worker + manifest, instalação offline)
- [ ] App React Native (Expo + lógica de negócio compartilhada)
- [ ] Modo offline — baixar capítulos para estudo sem internet

---

## Problemas conhecidos (não bloqueantes, priorização acima)

| Bug | Arquivo | Status |
|---|---|---|
| Correção de IA em "Aula" é 100% mockada | `Aula.tsx` (`mockAnalyze`) | 🔴 aberto — alto impacto |
| `todayIso()` usa UTC em vez de horário local | `dashboard-stats.ts`, `course-progress.ts` (duplicada) | 🔴 aberto |
| Repetir fase empatando não conta na missão diária | `progress.ts` (`saveStage`), `Fase.tsx` | 🔴 aberto |
| Quiz de texto livre não tolera acentuação | `ChapterQuiz.tsx` | 🔴 aberto — baixo impacto |
| Google Auth é apenas visual | `GoogleAuthButton.tsx` | 🔴 aberto — resolvido "de graça" pela Fase 1 do backend |
| Notificações/lembretes sem implementação real | `DashboardConfig.tsx`, `preferences.ts` | 🔴 aberto |
| Senha em texto puro no `localStorage` | `DashboardPerfilEditar.tsx` | 🟡 aceitável hoje (sem backend) — ver [specs/SECURITY.md](specs/SECURITY.md) |

Todos os bugs de estado duplicado no cliente (`todayIso`, empate de missão, quiz assíncrono já corrigido) têm correção estrutural embutida no desenho do backend — não são "mais um patch", são consequência de mover a regra de negócio para o servidor (ver [architecture/ARCHITECTURE.md](architecture/ARCHITECTURE.md#6-estado-atual-vs-arquitetura-alvo)).
