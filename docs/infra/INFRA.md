# Infraestrutura

---

## 1. Topologia hoje

```
frontend/   React SPA — build estático, roda em qualquer host (Vercel/Netlify/GitHub Pages)
            Dev server: http://localhost:8080 (porta fixa, vite.config.ts)

backend/    Spring Boot — JAR único
            Dev server: http://localhost:8081
            Perfil local: H2 in-memory (efêmero, resetado a cada restart)
            Perfil supabase: PostgreSQL real via Supabase
```

Os dois projetos **não estão ligados** hoje: não há proxy reverso, nem env var apontando o frontend para `localhost:8081`. Ver [architecture/ARCHITECTURE.md](../architecture/ARCHITECTURE.md) para o estado de integração.

---

## 2. Backend — perfis de execução

| Perfil | Ativação | Banco | Uso |
|---|---|---|---|
| `local` (default) | `SPRING_PROFILES_ACTIVE=local` ou ausente | H2 in-memory, console em `/h2-console` | Desenvolvimento local, testes rápidos |
| `supabase` | `SPRING_PROFILES_ACTIVE=supabase` | PostgreSQL (Supabase), via `SUPABASE_DB_URL`/`SUPABASE_DB_USERNAME`/`SUPABASE_DB_PASSWORD` | Ambiente conectado a dado real |

Em ambos os perfis: `spring.jpa.hibernate.ddl-auto=validate` — Flyway é a única fonte de verdade do schema, Hibernate nunca altera, só confere. `open-in-view: false`.

### Variáveis de ambiente (backend)

```env
SPRING_PROFILES_ACTIVE=supabase        # ou local (default)
SUPABASE_DB_URL=jdbc:postgresql://<host>:5432/postgres
SUPABASE_DB_USERNAME=
SUPABASE_DB_PASSWORD=
```

Nenhuma credencial fica hardcoded em `application-supabase.yml` — todas vêm de env var.

### Autenticação (Supabase Auth — serviço gerenciado à parte)

O backend **sempre** aponta para o Supabase Auth hospedado (`supabase.auth.project-url` em `application.yml`), mesmo quando o banco de dados de negócio ainda é o H2 local — Auth é um serviço gerenciado separado do banco de dados de negócio.

```yaml
supabase:
  auth:
    project-url: https://kxjoytldjxloakueqdbx.supabase.co
    jwks-uri: ${supabase.auth.project-url}/auth/v1/.well-known/jwks.json
    issuer-uri: ${supabase.auth.project-url}/auth/v1
```

---

## 3. Migrations (Flyway)

- `spring.flyway.locations=classpath:db/migration`
- `spring.flyway.schemas=public` — Flyway só gerencia o schema `public`; os schemas `auth`/`storage`/`realtime` são geridos pelo próprio Supabase, fora do nosso controle
- `baseline-on-migrate: true`, `baseline-version: "0"`
- Rodar migrations: automático no boot da aplicação (`spring-boot:run` ou start do JAR)

---

## 4. CORS

`CorsConfig` restringe `/api/**` a uma única origem (`app.cors.allowed-origin`), hoje fixada em `http://localhost:8080` (o dev server do frontend). **Precisa ser parametrizado por ambiente** assim que houver um domínio de produção do frontend — hoje é uma constante única, não uma lista por perfil.

---

## 5. Documentação de API

- Swagger UI: `/swagger-ui.html`
- OpenAPI JSON: `/v3/api-docs`
- Ambos liberados como rotas públicas em `SecurityConfig` (sem autenticação)

---

## 6. Observabilidade (hoje)

`application.yml` do perfil local liga log `TRACE` para `org.springframework.security` e `org.springframework.security.oauth2(.jwt)` — útil para depurar validação de JWT durante o desenvolvimento da Fase 0/1, mas **verboso demais para manter em produção**; revisar nível antes de qualquer deploy real.

Nenhuma stack de métricas/tracing (Actuator, Micrometer, Sentry) foi introduzida ainda — considerar ao aproximar-se de um deploy com usuários reais.

---

## 7. Deploy

### Frontend

```bash
bun build   # gera dist/
```

`dist/` é publicável em qualquer host estático: Vercel, Netlify, GitHub Pages (via action `vite-gh-pages`).

### Backend

Ainda não há pipeline/host de produção definido — hoje roda via `./mvnw spring-boot:run` localmente. Ao decidir hospedagem, atualizar:
- `app.cors.allowed-origin` para o domínio real do frontend em produção
- Variáveis `SUPABASE_DB_*` como secrets do ambiente de deploy (nunca commitadas)
- Nível de log de `org.springframework.security*` (ver seção 6)

### Variáveis de ambiente do frontend (quando a integração começar)

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_CLIENT_ID=
```
