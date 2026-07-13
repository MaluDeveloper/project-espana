# IA — Especificação

---

## 1. Estado atual: 100% mockado

**Arquivo:** `frontend/src/pages/Aula.tsx`, função `mockAnalyze` (~linhas 80-104)

A "correção por IA em tempo real" — funcionalidade central anunciada no hero da landing page — não existe de verdade. `mockAnalyze` usa `setTimeout` para simular latência e devolve `errors`, `connectors`, `vocabulary` e `feedback` **fixos**, iguais para qualquer texto que o aluno escreva. Só o campo `corrected` reaproveita o texto real digitado (e mesmo assim sem correção de fato).

**Impacto:** Alto — é a promessa central do produto sem implementação real por trás. Prioridade assim que o backend/IA real entrar (Fase 7 do roadmap — ver [ROADMAP.md](../ROADMAP.md)).

---

## 2. Design alvo: módulo `writing`

### 2.1 Por que a chamada de IA precisa passar pelo backend

Ver também [specs/SECURITY.md](../specs/SECURITY.md#3-correção-de-escrita-com-ia--por-que-a-chamada-nunca-pode-ser-do-cliente).

- a API key do provedor de IA (Claude) não pode existir no bundle do frontend;
- permite logar/auditar submissões (`writing_submissions`), essencial para personalização futura;
- permite normalizar/pós-processar a resposta do modelo antes de devolver ao cliente.

### 2.2 Modelagem de dados

```
writing_submissions (id, profile_id FK, lesson_ref, original_text, corrected_text,
                     feedback JSONB [errors, connectors, vocabulary], score, created_at)
```

`feedback` fica em JSONB porque a forma da resposta do modelo de IA pode evoluir sem exigir migration — union type já flexível, igual ao padrão adotado para o conteúdo pedagógico (ver [database/SCHEMA.md](../database/SCHEMA.md)).

### 2.3 Endpoints planejados

| Endpoint | Descrição |
|---|---|
| `POST /api/writing/correct` | Envia texto do aluno, retorna correção + feedback estruturado |
| `GET /api/writing/history` | Histórico de submissões do aluno |

### 2.4 Fluxo (planejado)

```
React (Aula.tsx): aluno escreve texto, clica "Corrigir"
  → POST /api/writing/correct { lessonRef, text }
    Header: Authorization: Bearer <jwt>

Spring Boot (módulo writing):
  1. Valida payload, resolve profile_id via CurrentUserProvider
  2. Chama a Claude API (chave só existe no servidor)
  3. Normaliza/pós-processa a resposta do modelo
  4. Grava WritingSubmission (auditoria)
  5. Retorna { correctedText, errors[], connectors[], vocabulary[], score }

React: exibe o feedback estruturado — troca mockAnalyze pela chamada real
```

### 2.5 Por que fica por último no roadmap de backend

É a integração de maior risco/custo externo (API paga, desenho de prompt) e a menos acoplada ao resto do schema (só precisa de `profile_id`). Fica por último para poder se apoiar em convenções já maduras de auth, erro e logging do resto do backend — e pode ser desenvolvida de forma independente a qualquer momento, sem bloquear as outras fases.

---

## 3. Roadmap de produto — IA e personalização (visão de médio prazo)

Estes itens dependem do módulo `writing` básico já estar no ar, e de `exercise_attempts` já estar acumulando histórico suficiente (ver [database/SCHEMA.md](../database/SCHEMA.md#4-progresso-do-aluno-planejado)):

- **Correção de texto livre real** usando Claude API — item central desta seção
- **Exercícios gerados por IA** personalizados com base nas fraquezas do aluno (consulta sobre `exercise_attempts` por tag/tópico mais errado)
- **Chat de dúvidas com IA** — tutor conversacional que responde perguntas sobre espanhol em PT/EN
- **Speech-to-Text para exercícios orais** — aluno fala, sistema avalia pronúncia
- **Adaptação de dificuldade automática** via `getDifficulty() === "auto"` — já existe a flag em `lib/preferences.ts` no frontend, mas não é usada por nenhuma lógica ainda
