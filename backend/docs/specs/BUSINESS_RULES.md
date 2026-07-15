# Regras de Negócio

> Hoje estas regras são implementadas e calculadas **no cliente** (`frontend/src/lib/`). O roadmap de backend (ver [ROADMAP.md](../ROADMAP.md)) move todo este cálculo para o servidor — as seções abaixo indicam, para cada regra, onde ela vive hoje e para onde vai.

---

## 1. Conclusão de capítulo

**Hoje:** `src/lib/course-progress.ts` → `getChapterCompletionPercent(level, chapterId)`

```
% = (topicsRead / totalTopics) × 50
  + (exercisesCorrect / totalExercises) × 30
  + (quiz.score / quiz.total ≥ 0.7 ? 20 : 0)
```

`getLevelCompletionPercent(level)` = média dos capítulos × 0.9 + 10% de bônus se a prova final foi feita.

**Alvo:** `ProgressService` no módulo `course.progress` do backend, recalculado a cada `POST /api/progress/...` (ver [api/API_SPEC.md](../api/API_SPEC.md)).

---

## 2. Desbloqueio de capítulos e níveis

**Hoje:** `isChapterUnlocked` / `isLevelUnlocked` em `course-progress.ts`.

- Capítulos: o capítulo anterior precisa ter **≥ 80%** de conclusão (`UNLOCK_THRESHOLD = 80`)
- Níveis: o nível anterior precisa ter **≥ 80%**
- A1 e Capítulo 1 são sempre desbloqueados

**Alvo:** mesma regra, avaliada no `ProgressService` a cada gravação — resposta da API já inclui `unlockedNext: boolean`.

---

## 3. XP e nível do usuário

**Hoje:** `dashboard-stats.ts` — XP = soma do XP dos jogos + bônus de missões (`localStorage["spanish-ai-mission-bonus-v1"]`).

```
Nível do usuário = Math.floor(XP / 100) + 1
Barra de progresso = XP atual / (nível × 100)
```

**Alvo:** `xp_transactions` como **ledger append-only** — total é sempre `SUM(amount)`, nunca uma coluna mutável. Esta é a correção estrutural para a classe de bug de "estado assíncrono desatualizado" (o quiz já teve esse bug — ver [ROADMAP.md](../ROADMAP.md), problema já corrigido no frontend com `useRef` síncrono, mas que só se elimina de vez com um ledger no servidor).

---

## 4. Streak (dias consecutivos de estudo)

**Hoje:** `getStreak()` em `course-progress.ts` — calculado retroativamente a partir de hoje sobre `studyDays[]`; para quando encontra um dia sem estudo.

⚠️ **Bug conhecido:** `todayIso()` (duplicada em `dashboard-stats.ts` e `course-progress.ts`) usa `new Date().toISOString().slice(0,10)` — sempre UTC. Para um usuário no Brasil (UTC-3), o "dia" muda às 21h locais, não à meia-noite. Afeta streak, missões diárias, "flashcards hoje", "partidas hoje" e o heartbeat de tempo de estudo — todos podem resetar/computar errado ~3h antes da meia-noite real.

**Alvo:** `study_sessions (profile_id, study_date, seconds_studied)` — `study_date` calculado no backend via `now() AT TIME ZONE profiles.timezone`, nunca em UTC puro. Streak vira **query derivada** sobre `study_sessions`, não uma coluna armazenada — elimina a classe de bug de fuso horário de raiz (não só corrige a instância atual).

---

## 5. Tempo de estudo (heartbeat)

**Hoje:** `registerStudyHeartbeat()` em `dashboard-stats.ts` soma segundos reais em `localStorage["spanish-ai-study-time-v1"]`, por dia. `Capitulo.tsx` chama a cada 30s (`STUDY_HEARTBEAT_MS`) só enquanto `document.visibilityState === "visible"`. Substituiu uma estimativa fixa anterior de 30min/dia estudado.

**Alvo:** `POST /api/study/heartbeat` grava em `study_sessions`, mesmo bucketing por timezone da seção 4.

---

## 6. Missões diárias

**Hoje:** `dashboard-stats.ts` — 3 missões: `capitulo` (1 capítulo/dia), `partidas` (3 jogos/dia), `palavras` (10 flashcards/dia). Definição fica em código, não em dado.

⚠️ **Bug conhecido:** quando o jogador repete uma fase já concluída e empata (mesmas estrelas) com o recorde anterior, `saveStage` (`lib/progress.ts`) mantém o registro antigo inteiro, incluindo `completedAt` antigo. Como `getGamesPlayedToday()` filtra por `completedAt` de hoje, repetir uma fase hoje sem melhorar a pontuação não conta para a missão "Jogue 3 partidas hoje".

**Alvo:** `daily_mission_progress` (progresso do dia, tabela) + definições de missão em **código/config** (igual hoje, só migram de local). `game_progress` no backend faz UPSERT que sempre atualiza `completed_at` a toda conclusão (mesmo empatando), corrigindo o bug diretamente no design da tabela.

---

## 7. Conquistas (achievements)

**Hoje:** 8 badges em `dashboard-stats.ts`: `primerPaso`, `racha`, `memoria`, `poliglota`, `conversador`, `maestro`, `imparable`, `fluente`.

**Alvo:** `achievements` (catálogo, seed) + `profile_achievements` (desbloqueio por usuário), avaliados por `AchievementEvaluationService` reagindo a eventos de progresso/jogos/XP.

---

## 8. Pontuação de jogos

**Hoje:** `lib/stage-builders.ts` / lógica de jogo.

```typescript
computeStars(ratio): 1 | 2 | 3
// ratio < 0.6 → 1 estrela; < 0.85 → 2; ≥ 0.85 → 3

computeXp(stars, level): number
// A1: 20/35/50 · A2: 25/40/60 · B1: 30/50/75 · B2: 40/65/90
```

Vitória do `MemoryGame`: `matched` guarda `pairId` (um por par casado), comparado contra `data.pairs.length` — a fonte da verdade do jogo — em vez de contar cartas individuais.

**Alvo:** mesma lógica, avaliada no módulo `game` do backend ao chamar `POST /api/games/{category}/{level}/{stage}/complete`.

---

## 9. Ranking

**Hoje:** `DashboardHome.tsx` — a posição/XP do próprio aluno é real (`getTotalXp()`, calculada e inserida em `MOCK_COMPETITORS`, lista reordenada dinamicamente); os **outros** 24 perfis do ranking são fixos/fictícios, pois não há backend com múltiplos usuários reais.

**Alvo:** `GET /api/ranking` — query agregada (`SUM` + `RANK() OVER (ORDER BY total_xp DESC)`) sobre `xp_transactions`. Decisão de produto pendente: manter concorrentes fictícios semeados no banco ou aceitar ranking pequeno no início (ver [database/SCHEMA.md](../database/SCHEMA.md#8-ranking-planejado)).

---

## 10. Quiz — regras de correção

- **Score síncrono:** `ChapterQuiz.tsx` usa `scoreRef = useRef(0)` para acumular acertos de forma síncrona (fix de um bug antigo em que o estado assíncrono `score` podia estar desatualizado no closure de `next()`, salvando 1 ponto a menos na última questão).
- **Badge "Capítulo dominado":** exibido se score ≥ 70%.
- **Só salva se melhorar:** `saveChapterQuiz` só sobrescreve o recorde se o novo score for maior.
- ⚠️ **Bug conhecido:** resposta de texto livre é comparada com `===` exato (só normaliza maiúsculas/minúsculas e espaços nas pontas), sem normalizar acentos — uma resposta correta sem o acento certo é marcada como errada. Correção sugerida: `.normalize("NFD").replace(/[̀-ͯ]/g, "")` antes de comparar. No backend, este é o lugar certo para normalizar (ponto único de verdade, servidor).
