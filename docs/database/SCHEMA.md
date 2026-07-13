# Banco de Dados — Esquema

**Motor:** PostgreSQL (Supabase, produção) · H2 in-memory (perfil `local`, desenvolvimento)
**Migrations:** Flyway, `classpath:db/migration`, schema `public` apenas (schemas `auth`/`storage`/`realtime` são gerenciados pelo Supabase, fora do nosso controle)
**Fonte de verdade:** Flyway — `spring.jpa.hibernate.ddl-auto=validate` em todos os perfis; Hibernate nunca altera schema, só confere.

Convenções gerais: toda tabela usa `id UUID` como chave primária (`gen_random_uuid()`, exceto `profiles` — ver abaixo); `profiles.id` é o mesmo UUID de `auth.users.id`; todas as tabelas de domínio têm `created_at`/`updated_at`.

---

## 1. Migrations aplicadas

| Versão | Arquivo | Conteúdo |
|---|---|---|
| V1 | `V1__baseline.sql` | Baseline vazio — estabelece o schema `public` versionado pelo Flyway, sem tabelas de negócio |
| V2 | `V2__create_profiles_table.sql` | Cria `profiles` (ver seção 2) |

---

## 2. Usuário ✅ implementado

**`profiles`** — estende `auth.users` (1:1, gerenciada pelo Supabase)

| Coluna | Tipo | Nota |
|---|---|---|
| id | uuid (PK) | **Sem** `gen_random_uuid()` — é sempre o mesmo UUID de `auth.users.id` (claim `sub` do JWT), atribuído explicitamente pelo backend no provisionamento lazy (`ProfileService`), nunca gerado pelo Postgres |
| name | text not null | |
| avatar_url | text | nullable |
| locale | text not null | `pt` \| `en` |
| timezone | text not null | IANA (ex. `America/Sao_Paulo`) — usado para bucketing de `study_sessions`, elimina o bug de cálculo de "dia" em UTC que existe hoje no frontend |
| created_at | timestamptz not null default now() | |
| updated_at | timestamptz not null | |

A entidade JPA `Profile` implementa `Persistable<UUID>` (em vez de estender `BaseEntity`) porque o id é sempre atribuído externamente e nunca nulo — a heurística default do Spring Data (id nulo = entidade nova) trataria toda entidade como existente e chamaria `merge()` em vez de `persist()`. `isNew()` usa `createdAt` (só preenchido pelo listener de auditoria no `@PrePersist`) para diferenciar inserção de atualização.

**`user_preferences`** 🔲 planejado (1:1 com `profiles`)

| Coluna | Tipo |
|---|---|
| profile_id (PK, FK) | uuid |
| font_size | text |
| sound_enabled | boolean |
| show_translation | boolean |
| reminder_time | time, nullable |
| notifications_enabled | boolean |

---

## 3. Catálogo de cursos 🔲 planejado

Somente leitura para o aluno; escrita via seed/migration (importado de `frontend/src/data/courses.ts`).

```
courses (id, level [A1|A2|B1|B2] unique, title, title_en)
  └─< chapters (id, course_id FK, number, title, title_en, summary, summary_en,
                brief_review, common_mistakes JSONB)
        ├─< topics (id, chapter_id FK, order, title, title_en)
        │     ├─< topic_blocks (id, topic_id FK, order, kind, content JSONB)
        │     └─< exercises (id, topic_id FK nullable, chapter_id FK nullable,
        │                    type [multiple_choice|fill_in], is_quiz boolean,
        │                    question, question_en, options JSONB, options_en JSONB,
        │                    answer, explanation, explanation_en)
        └─< lexicon_entries (id, chapter_id FK, es, pt, en, tag, example, is_flashcard boolean)
```

`exercises` serve tanto os exercícios por tópico quanto o quiz do capítulo (`is_quiz=true`, `chapter_id` preenchido, `topic_id` nulo) — evita duplicar o modelo de "pergunta" em duas tabelas.

---

## 4. Progresso do aluno 🔲 planejado

```
topic_reads          (profile_id FK, topic_id FK, read_at)                          PK composta (profile_id, topic_id)
exercise_attempts    (id, profile_id FK, exercise_id FK, is_correct, attempted_at)   log completo, não só flag
chapter_quiz_results (id, profile_id FK, chapter_id FK, score, total, taken_at)      histórico; "melhor" = MAX() em query
exam_results         (id, profile_id FK, course_level, score, total, taken_at)       idem
```

Manter `exercise_attempts` como **log** (não só "última tentativa") é a decisão mais relevante aqui: dá base direta para futura adaptação de dificuldade por fraquezas do aluno (consulta de quais tags/tópicos o aluno mais erra), sem precisar remodelar depois.

---

## 5. Tempo de estudo 🔲 planejado (sem streak armazenado)

```
study_sessions (profile_id FK, study_date DATE, seconds_studied INT)   PK composta (profile_id, study_date)
```

`study_date` é calculado no backend a partir de `now() AT TIME ZONE profiles.timezone`, nunca em UTC puro — corrige o bug de fuso horário existente hoje no cálculo de streak/missões do frontend (ver [specs/BUSINESS_RULES.md](../specs/BUSINESS_RULES.md)). Streak e "estudou hoje" são **queries** sobre esta tabela, não colunas derivadas guardadas.

---

## 6. Gamificação 🔲 planejado

```
xp_transactions (id, profile_id FK, amount INT, reason [game_stage|mission_bonus|quiz|achievement],
                 reference_type, reference_id, created_at)
achievements         (id, code unique, name, name_en, description, description_en, icon)   catálogo, seed
profile_achievements (profile_id FK, achievement_id FK, unlocked_at)                        PK composta
daily_mission_progress (profile_id FK, mission_code, mission_date, current_count,
                        target_count, completed, bonus_claimed)                             PK composta (profile_id, mission_code, mission_date)
```

XP total do usuário = `SUM(amount) WHERE profile_id = ...` — nunca uma coluna mutável (elimina a classe de bug de estado assíncrono desatualizado já vista no frontend). Definições de missão diária (quais existem, meta de cada uma) ficam em **código/config**, não em tabela — só há 3 hoje e mudam raramente; a tabela guarda apenas o *progresso* do dia.

---

## 7. Jogos 🔲 planejado

```
game_categories (id, code unique [memoria|lacunas|palavras|...], name, name_en, status [available|coming_soon])
game_progress   (profile_id FK, category_code FK, level, stage, stars, xp_earned, completed_at)
                PK composta (profile_id, category_code, level, stage)
```

O conteúdo procedural de cada fase (`stage-builders.ts` do frontend) **continua em código**, não vira tabela — é gerado, não é dado. `game_progress` sempre faz UPSERT: `completed_at` é atualizado a **toda** conclusão (mesmo empatando o recorde anterior), mas `stars`/`xp_earned` só são sobrescritos se o novo resultado for maior ou igual ao anterior — corrige diretamente no design da tabela o bug de "repetir fase empatando não conta na missão diária" que existe hoje no frontend.

---

## 8. Ranking 🔲 planejado

Sem tabela própria no MVP — é uma **query agregada** sobre `xp_transactions` (`SUM` + `RANK() OVER (ORDER BY total_xp DESC)`), feita sob demanda. Quando existir liga semanal (fase de produto futura), aí sim entram `leagues` / `league_memberships` — fora de escopo agora.

> **Nota de produto:** com poucos usuários reais, o ranking vai ficar "vazio" comparado à experiência atual com concorrentes mockados no frontend. Decisão pendente: manter perfis fictícios semeados no banco como "bots", ou aceitar um ranking pequeno no início.

---

## 9. Correção de escrita com IA 🔲 planejado

```
writing_submissions (id, profile_id FK, lesson_ref, original_text, corrected_text,
                     feedback JSONB [errors, connectors, vocabulary], score, created_at)
```

`feedback` fica em JSONB porque a forma da resposta do modelo de IA pode evoluir sem migration. Ver [ai/AI_SPEC.md](../ai/AI_SPEC.md).

---

## 10. Perfis de configuração de banco

| Perfil | Arquivo | Uso |
|---|---|---|
| `local` (default) | `application-local.yml` | H2 in-memory, console habilitado |
| `supabase` | `application-supabase.yml` | Postgres real via `SUPABASE_DB_URL`/`SUPABASE_DB_USERNAME`/`SUPABASE_DB_PASSWORD` (env vars, nenhuma credencial hardcoded), H2 console desligado |
