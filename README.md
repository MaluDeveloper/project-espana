# SpanishAI Platform

Plataforma gamificada para aprendizado de espanhol, com cursos estruturados por níveis (A1–C2), preparação para o DELE, jogos interativos, dashboard com streak e missões diárias, e suporte a PT-BR e Inglês.

Monorepo com dois projetos ainda não conectados entre si — ver [CLAUDE.md](CLAUDE.md) para o mapa geral:

- `frontend/` — o produto (este README cobre só ele); documentação completa em [frontend/docs/OVERVIEW.md](frontend/docs/OVERVIEW.md) e [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md)
- `backend/` — Spring Boot, arquitetura hexagonal, auth real via Supabase; documentação completa em [backend/docs/OVERVIEW.md](backend/docs/OVERVIEW.md) e [backend/docs/ROADMAP.md](backend/docs/ROADMAP.md)

## Tech Stack

- React 18 + TypeScript 5
- Vite 5 + SWC
- Tailwind CSS 3 + shadcn/ui (Radix UI)
- React Router DOM v6
- Framer Motion 12
- TanStack Query 5

## Rodando o projeto

```bash
bun install
bun dev
```

Acesse `http://localhost:8080`.

## Scripts

```bash
bun dev          # Desenvolvimento
bun build        # Build de produção
bun preview      # Servir o build localmente
bun test         # Testes com Vitest
bun lint         # ESLint
```

Consulte [frontend/docs/OVERVIEW.md](frontend/docs/OVERVIEW.md) para detalhes completos de arquitetura e módulos, e [frontend/docs/ROADMAP.md](frontend/docs/ROADMAP.md) para os próximos passos.
