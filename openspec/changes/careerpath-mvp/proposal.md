# Proposal

## Why

Students and early-career engineers aiming for roles like AI Engineer or Full-Stack Developer don't know which skills they're missing or what order to learn them in. CareerPath AI (see `docs/blueprint.md`) models roles, skills, and prerequisite chains as a Neo4j graph so the gap and the learning order come straight from graph traversal. We have a 1.5-hour hackathon window, so this change delivers only the **core loop** as a working, demoable MVP. Later phases build on the same graph.

## What Changes

- Onboard predefined seed data into a Neo4j (AuraDB Free) graph: the 5 MVP roles (Full-Stack Developer, ML Engineer, Data Scientist, Software Architect, AI Engineer), ~6–8 skills per role, prerequisite edges, one resource per skill, and a few portfolio projects.
- Expose a trimmed GraphQL API (GraphQL Yoga at `/api/graphql`) for roles, a role's skill graph, assessment submission, gap analysis, roadmap generation, and milestone toggling.
- Add a role picker page, a quick self-assessment page (0–5 slider per required skill), and a roadmap dashboard page with a readiness score, ordered milestones, resource links, and completion checkboxes.
- Compute the gap with Cypher: required skills where the user's score is below a threshold, plus missing prerequisites. Order them topologically along `REQUIRES_PREREQUISITE`.
- Identify users anonymously with a cookie-stored id (no auth) and persist their progress in Neo4j.

**Deferred to later phases (not in this change):**
- Phase 2: resume upload/paste, skill extraction with Groq, and role matching with reasoning.
- Phase 3: resume-aligned career guidance notes from Groq.
- Phase 4: adaptive micro-quizzes, Recharts progress charts, auth, and more roles and resources.

## Capabilities

### New Capabilities
- `skill-graph`: Role/skill/prerequisite/resource/project graph in Neo4j, its seed data, and read access (list roles, get a role's required skills).
- `skill-assessment`: User self-rating of a role's required skills (0–5), stored as `HAS_SKILL` proficiency, with anonymous user identity.
- `skill-gap-analysis`: Graph-based detection of deficient and missing-prerequisite skills for a target role, plus the readiness score.
- `learning-roadmap`: Generation of a prerequisite-ordered roadmap of milestones with resources and projects, milestone completion tracking, and the dashboard.

### Modified Capabilities
<!-- None: no existing specs. -->

## Impact

- **New dependencies:** `neo4j-driver`, `graphql`, `graphql-yoga`. Groq SDK is deferred to Phase 2.
- **New env vars:** `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` (in `.env.local`, which is never committed).
- **New code:** `lib/neo4j.ts`, `lib/graphql/*`, `app/api/graphql/route.ts`, `scripts/seed.ts` (or a `.cypher` file), plus pages under `app/` (`/`, `/assess/[roleId]`, `/roadmap`).
- **Replaced:** the default `app/page.tsx` starter content.
- **External systems:** a Neo4j AuraDB Free instance must be provisioned before seeding.
