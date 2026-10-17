# Tasks

## 1. Tech Stack section

- [x] 1.1 Add a `## Tech Stack` section to `README.md` between the intro paragraph and `## Setup`, as a table grouped Frontend / API / Data / Tooling: Next.js 16.4 (App Router, `proxy.ts` cookie gate), React 19.3, TypeScript 5, Tailwind CSS 4, shadcn (`base-nova`) + `@base-ui/react`, lucide-react, Barlow / Barlow Condensed / Geist Mono via `next/font`; GraphQL Yoga 5 + `graphql` 17 at `/api/graphql`; Neo4j AuraDB Free via `neo4j-driver` 6, seeded from `scripts/seed.cypher` with `tsx`; ESLint 9 (`eslint-config-next`). Verify that every listed version matches `package.json` and that Groq is not listed.

## 2. Built With AI section

- [x] 2.1 Add a `## Built With AI` section right after Tech Stack, as a table of tool / role / evidence in the repo: Claude Code (`.claude/skills/openspec-*`, `.claude/commands/opsx/*`), GitHub Copilot (commit co-author), OpenSpec spec-driven workflow (`openspec/specs/`, `openspec/changes/archive/`), Impeccable design skill (`.impeccable/`, `PRODUCT.md`), playwright-cli for browser verification (`.playwright-cli/`), and `AGENTS.md` (Next.js agent guide). Verify that each evidence path exists (`ls`) and that the co-authors match `git log --format=%b | grep -i co-auth`.
- [x] 2.2 Below the table, add a one-line workflow summary: OpenSpec propose, then apply, then archive, with Claude Code and Copilot writing the code, Impeccable for the design pass, and playwright-cli for UI checks. Verify that it reads as a single line and names only tools from 2.1.

## 3. Check

- [x] 3.1 Diff `README.md` against `HEAD` (`git diff README.md`) and confirm that only the two new sections were added and every other section is byte-identical.
