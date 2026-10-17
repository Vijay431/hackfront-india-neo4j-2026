# Proposal

## Why

The README explains setup, flow, and the GraphQL API, but it never says what CareerPath AI is built on or how it was built. Hackathon judges and new contributors need both at a glance: the runtime stack (Next.js, GraphQL Yoga, Neo4j) and the AI harness (Claude Code, GitHub Copilot, OpenSpec, Impeccable, playwright-cli) that produced the code.

## What Changes

- Add a **Tech Stack** section to `README.md`, between the intro paragraph and **Setup**, grouped as Frontend / API / Data / Tooling, with the versions from `package.json`.
- Add a **Built With AI** section right after it, listing each AI tool, what it was used for, and where the repo shows it, plus a one-line description of the spec-driven workflow (OpenSpec propose, then apply, then archive).
- Leave all other README sections unchanged.

Out of scope:
- Groq is not listed in the stack. It appears only in `.env.example` and is not called by any code. The existing **Roadmap** section already covers it as Phase 2.
- `PRODUCT.md` is stale (it still says "anonymous, no login" and references the deleted `docs/blueprint.md`). Fixing it is a separate change.

## Capabilities

### New Capabilities

None. This is a documentation-only change, so the change sets `skip_specs: true`.

### Modified Capabilities

None.

## Impact

- `README.md` only. No code, API, dependency, or data changes.
