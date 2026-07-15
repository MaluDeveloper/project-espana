# API — Especificação

**Base URL (local):** `http://localhost:8081`
**Autenticação:** Bearer JWT emitido pelo Supabase Auth, validado via JWKS (ES256/P-256)
**Documentação interativa:** Swagger UI em `/swagger-ui.html` · OpenAPI JSON em `/v3/api-docs`
**Formato de erro:** ver [seção 4](#4-formato-de-erro)

> O frontend hoje **não consome nenhum destes endpoints** — todo estado ainda vive em `localStorage` (ver [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md)). Este documento cobre os endpoints já implementados no backend e os planejados pelo roadmap de módulos.

---

## 1. Endpoints implementados

### `GET /api/health`
Rota pública, sem autenticação. Health check básico do Spring Boot.

### `GET /api/users/me`
Retorna o perfil do usuário autenticado. **Provisionamento lazy**: se for a primeira requisição autenticada desse usuário e o perfil ainda não existir em `profiles`, ele é criado na hora a partir do claim `sub` e do `user_metadata` do JWT (nome/avatar vindos do cadastro por e-mail ou do provider Google).

- **Auth:** obrigatória
- **Response 200:** `ProfileResponse { id, name, avatarUrl, locale, timezone, createdAt, updatedAt }`

### `PUT /api/users/me`
Atualiza o perfil do usuário autenticado (mesma lógica de provisionamento lazy se ainda não existir).

- **Auth:** obrigatória
- **Body:** `ProfileUpdateRequest { name, avatarUrl?, locale, timezone }`
- **Validação:** `timezone` precisa ser um IANA zone id válido (`ZoneId.of(...)`) — senão `400` via `InvalidRequestException`
- **Response 200:** `ProfileResponse`

---

## 2. Rotas públicas (sem autenticação)

Definidas em `SecurityConfig.PUBLIC_PATHS`:

```
/api/health
/api/users        ⚠️ ver nota abaixo
/h2-console/**     (só perfil local)
/v3/api-docs/**
/swagger-ui/**
/swagger-ui.html
```

> ⚠️ **Nota de consistência:** o matcher `/api/users` (sem `/**`) não cobre `/api/users/me` na prática (Spring Security faz match exato aqui, não prefixo) — ou seja, `/api/users/me` continua exigindo token mesmo com essa entrada na lista. Se a intenção era só documentar/expor o path base, considerar remover essa entrada para não sugerir uma rota pública que não existe.

Todo o resto exige `Authorization: Bearer <jwt>` válido (`anyRequest().authenticated()`), retornando `401` caso ausente/inválido — antes mesmo de chegar ao dispatcher (é por isso que é `401`, não `404`, mesmo para paths inexistentes).

---

## 3. Endpoints planejados por módulo

Ordem de implementação e dependências entre módulos: ver [ROADMAP.md](../ROADMAP.md).

| # | Módulo | Endpoints representativos | Depende de |
|---|---|---|---|
| 2 | **user** | `GET/PUT /api/users/me` ✅, `GET/PUT /api/users/me/preferences` ✅ | auth |
| 3 | **course.catalog** | `GET /api/courses`, `GET /api/courses/{level}/chapters/{id}` | auth |
| 4 | **course.progress** | `POST /api/progress/topics/{id}/read`, `POST /api/progress/exercises/{id}/attempts`, `POST /api/progress/chapters/{id}/quiz`, `POST /api/progress/exams` | user, course.catalog |
| 5 | **study** | `POST /api/study/heartbeat`, `GET /api/study/streak` | user |
| 6 | **gamification.xp** | `GET /api/xp/total`, `GET /api/xp/history` | user |
| 7 | **gamification.achievement** | `GET /api/achievements` | gamification.xp, course.progress, game |
| 8 | **gamification.mission** | `GET /api/missions/today` | course.progress, game, study |
| 9 | **game** | `GET /api/games/categories`, `POST /api/games/{category}/{level}/{stage}/complete` | user, gamification.xp |
| 10 | **ranking** | `GET /api/ranking` | gamification.xp |
| 11 | **writing** | `POST /api/writing/correct`, `GET /api/writing/history` | user, Claude API externo |

### Exemplo de fluxo — completar um exercício (planejado)

```
POST /api/progress/exercises/{exerciseId}/attempts
Header: Authorization: Bearer <jwt>
Body:   { "answer": "...", "correct": true }

Response 200: ProgressResponseDTO {
  chapterCompletion: number,       // % recalculado no servidor
  unlockedNext: boolean,
  xpAwarded: number,
  achievementsUnlocked: string[]
}
```

O frontend não recalcula nada localmente — apenas exibe a resposta. Ver regras de negócio em [specs/BUSINESS_RULES.md](../specs/BUSINESS_RULES.md).

---

## 4. Formato de erro

Todo erro de controller/service (fora de 401/403, que são tratados pelo filtro OAuth2 antes de chegar aqui) segue o shape `ApiError` (`GlobalExceptionHandler`):

```json
{
  "timestamp": "2026-07-13T12:00:00Z",
  "status": 404,
  "message": "Descrição do erro",
  "details": ["campo: motivo", "..."]
}
```

| Exceção | Status |
|---|---|
| `ResourceNotFoundException` | 404 |
| `InvalidRequestException` | 400 |
| `MethodArgumentNotValidException` (`@Valid` falhou) | 400, com `details` por campo |
| Qualquer outra `Exception` | 500, mensagem genérica ("Erro interno inesperado") — nunca vaza stack trace |
