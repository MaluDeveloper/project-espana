# Segurança

---

## 1. Estado atual (frontend sem backend real)

### 1.1 Guarda de rota é client-side apenas

`ProtectedRoute` (`src/components/ProtectedRoute.tsx`) checa apenas `localStorage["spanish-ai-user"]`. Qualquer pessoa pode escrever essa chave manualmente e "logar" sem credenciais reais. **Aceitável hoje** porque não há dado sensível real por trás — nenhum dado de outros usuários é exposto, já que não existe backend com múltiplos usuários. Deixa de ser aceitável assim que a Fase de integração com backend começar (ver seção 2).

### 1.2 ⚠️ Senha em texto puro no cliente

**Arquivo:** `src/pages/dashboard/DashboardPerfilEditar.tsx`

A troca de senha em "Editar Perfil" salva e compara a senha em **texto puro** dentro de `localStorage["spanish-ai-user"]`. Não é um bug de comportamento — é esperado, já que não há backend — mas é um padrão que **não pode** ser levado adiante. Quando a autenticação migrar para o backend (ver seção 2), a senha nunca deve trafegar nem ser comparada em claro no cliente novamente.

### 1.3 Google Auth é apenas visual

**Arquivo:** `src/components/GoogleAuthButton.tsx`

O botão "Entrar com Google" existe na UI mas não implementa OAuth 2.0 real. Resolvido pela adoção de Supabase Auth (seção 2) — que já traz Google como provider configurável, sem custo de implementação adicional no frontend.

### 1.4 Auditoria de segredos (concluída)

Nenhuma chave/segredo real encontrada no código-fonte do frontend. Hoje não há nenhuma chamada de rede real no app (nem para IA, nem para nenhum serviço externo), então não há superfície de vazamento ainda.

**Ação preventiva pendente:** adicionar `.env*` ao `.gitignore` do frontend (hoje só lista `*.local`) antes que alguém adicione um `.env` com chaves reais.

---

## 2. Modelo de autenticação alvo (backend — já implementado)

### 2.1 Decisão: Supabase Auth emite tokens, Spring Boot só valida

Alternativa descartada: autenticação 100% própria (Spring Security + tabela de senhas). Supabase resolve OAuth Google sem reimplementar OAuth2, e reduz a superfície de segurança que o time precisa manter (reset de senha, verificação de e-mail, hashing — tudo fica no Supabase).

### 2.2 Validação de JWT (✅ implementado — `SupabaseJwtDecoderConfig`)

- Algoritmo: **ES256/P-256** (chave assimétrica ECC) — não HS256, porque o Supabase não expõe secret simétrico compartilhado
- Chaves públicas buscadas via **JWKS** (`https://<project>.supabase.co/auth/v1/.well-known/jwks.json`), cacheadas e rotacionadas automaticamente pelo Nimbus (`NimbusJwtDecoder`)
- `withJwkSetUri(...)` aceita RS256 por padrão — o algoritmo `ES256` precisa ser declarado explicitamente (`.jwsAlgorithm(SignatureAlgorithm.ES256)`), senão a verificação falha com "Another algorithm expected, or no matching key(s) found"
- Validação adicional: `issuer` (`.../auth/v1`) e `aud` contendo `"authenticated"` (`JwtClaimValidator`)

### 2.3 Autorização por rota (✅ implementado — `SecurityConfig`)

- API stateless (`SessionCreationPolicy.STATELESS`) — sem cookie de sessão, CSRF desabilitado (não se aplica a API só-Bearer-token)
- Rotas públicas: `/api/health`, `/h2-console/**` (só local), `/v3/api-docs/**`, `/swagger-ui/**`
- **Todo o resto exige token válido** (`anyRequest().authenticated()`) — retorna `401` antes do dispatcher, mesmo para rotas inexistentes

Ver nota de inconsistência sobre `/api/users` na lista de rotas públicas em [api/API_SPEC.md](../api/API_SPEC.md#2-rotas-públicas-sem-autenticação).

### 2.4 Resolução do usuário autenticado (✅ implementado — `CurrentUserProvider`)

- `getCurrentProfileId()`: extrai o claim `sub` do JWT (mesmo UUID de `auth.users.id` = PK de `profiles`)
- Nenhum service confia em um `profileId` vindo do corpo da requisição — sempre resolvido a partir do token
- `getCurrentUserMetadata()`: lê `user_metadata` (nome/avatar do provider, populado tanto no cadastro por e-mail quanto no login Google) — usado como origem dos defaults no provisionamento lazy de perfil

### 2.5 CORS

`CorsConfig` restringe `/api/**` a uma única origem configurável (`app.cors.allowed-origin`, hoje `http://localhost:8080` — a porta fixa do dev server do frontend), com `allowCredentials(true)` e métodos `GET/POST/PUT/PATCH/DELETE/OPTIONS`. Precisa ser atualizado por ambiente (ver [infra/INFRA.md](../infra/INFRA.md)) quando houver domínio de produção.

---

## 3. Correção de escrita com IA — por que a chamada nunca pode ser do cliente

Quando `Aula.tsx` (`mockAnalyze`) virar integração real com a Claude API (ver [ai/AI_SPEC.md](../ai/AI_SPEC.md)), a chamada **precisa** partir do Spring Boot, nunca direto do React:

- a API key do provedor de IA não pode existir no bundle do frontend;
- permite logar/auditar submissões (`writing_submissions`);
- permite normalizar/pós-processar a resposta do modelo antes de devolver ao cliente.

---

## 4. Checklist de migração (segurança)

| Item | Hoje | Owner da correção |
|---|---|---|
| Senha em texto puro | `localStorage`, comparação client-side | Supabase Auth (Fase 1 do roadmap) — senha deixa de trafegar/comparar no cliente |
| Guarda de rota | Client-side (`ProtectedRoute`) | Mantém-se para UX, mas passa a ser redundante com a exigência de token em toda API |
| Google OAuth | Mock visual | Supabase Auth, provider Google, "de graça" assim que a Fase 1 entrar |
| `.env*` no `.gitignore` (frontend) | Pendente | Higiene preventiva, fazer antes de qualquer `.env` real existir |
| Segredos de API (Claude, etc.) | N/A (nenhuma chamada externa ainda) | Sempre no backend (`application-supabase.yml`/env vars), nunca no bundle do frontend |
