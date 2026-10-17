# Design

## Context

The repo is a fresh Next.js 16.4 App Router app with React 19.3, Tailwind v4, shadcn (`components/ui/button.tsx`), and lucide-react. It has no backend code, no Neo4j dependency, and no existing specs. Next 16 differs from earlier versions: `middleware.ts` is now `proxy.ts`, and `cookies()`/`params` are async. Read `node_modules/next/dist/docs/` before writing route, proxy, or page code (see `AGENTS.md`). The time budget is 1.5 hours total, which drives every decision below. Motivation and scope: see `proposal.md`. Requirements: see `specs/`.

## Goals / Non-Goals

**Goals:**
- A demoable core loop in about 75 minutes, leaving about 15 minutes of buffer.
- Graph logic in Cypher, so Neo4j is visibly central to the demo.
- One GraphQL endpoint that the later phases (resume and Groq) extend without rework.

**Non-Goals:**
- Auth, multi-roadmap history, Recharts, quizzes, and resume parsing (Phase 2+).
- Apollo Client or codegen. The UI calls GraphQL with plain `fetch` from Server Components and Server Actions.
- No automated tests. The demo path is verified manually.

## Decisions

**1. GraphQL Yoga in a route handler (`app/api/graphql/route.ts`).**
The route exports `GET`/`POST` from `createYoga({ schema, graphqlEndpoint: '/api/graphql', context })`. The schema is SDL plus resolvers in `lib/graphql/schema.ts`, trimmed from the blueprint: `roles`, `role(id)`, `gapAnalysis(roleId)`, `myRoadmap`, `submitAssessment(roleId, assessments)`, `generateRoadmap(roleId)`, `toggleMilestone(milestoneId, completed)`. `userId` comes from context, not arguments, so the blueprint's `gapAnalysis(userId, …)` drops `userId` and clients cannot read another user's data.
*Alternative:* Apollo Server, which is heavier and needs the `@as-integrations/next` adapter. Server Actions only would be faster, but they would break the pitched architecture.

**2. Pages call resolvers in-process, not over HTTP.**
Server Components and Server Actions import the same service functions in `lib/career.ts` that the GraphQL resolvers wrap. This avoids building absolute URLs and forwarding cookies to self-fetch. GraphQL stays the public and external API and is demoed through the Yoga GraphiQL UI.
*Alternative:* self-fetch `/api/graphql` from RSC, which adds cookie-forwarding friction for no demo benefit.

**3. Anonymous identity via `proxy.ts`.**
If the `cp_uid` cookie is missing, the proxy sets it to `crypto.randomUUID()` (httpOnly, sameSite=lax, 1-year max-age). Services `MERGE (:User {id})` lazily. The GraphQL context reads the same cookie from the request.
*Alternative:* creating the user inside a Server Action covers only one entry path, while the proxy covers both pages and GraphQL.

**4. Neo4j access: one driver singleton in `lib/neo4j.ts`.**
`neo4j.driver(NEO4J_URI, auth.basic(...))` is cached on `globalThis` to survive HMR, with a `run(cypher, params)` helper that uses `executeQuery`. Integers come back as JS numbers via `{ disableLosslessIntegers: true }`.

**5. Seed as idempotent Cypher (`scripts/seed.cypher`, run by `scripts/seed.ts` via `npx tsx`).**
The seed uses only `MERGE` on `id` and adds uniqueness constraints on `Role.id`, `Skill.id`, `Resource.id`, `Project.id`, `User.id`, and `Milestone.id`. It covers the 5 predefined roles and about 30 distinct skills (shared ones such as Python, SQL, REST APIs, and Docker), with prerequisite edges, 1 resource per skill, and about 1 project per role. Software Architect requires System Design, Design Patterns, Distributed Systems, Microservices, Cloud Architecture, API Design, Security Architecture, and Scalability. The seed never touches `User` or `Roadmap` data.

**6. Gap analysis in Cypher, ordering in TypeScript.**
The Cypher query returns gap skills: required skills with `coalesce(hs.proficiencyScore,0) < 3`, unioned with `(gap)-[:REQUIRES_PREREQUISITE*1..]->(p)` where p's score is below 3. It returns each gap skill with its weight (0 for prereq-only skills) and its direct prereq ids within the gap set. TypeScript then runs Kahn's algorithm, using a priority queue on weight descending and then name, which satisfies the tie-break rule in the spec. Readiness comes from a second small aggregate query.
*Alternative:* pure-Cypher topological sort with APOC, but APOC availability on Aura Free is limited and harder to debug in a hurry.

**7. Roadmap persistence.**
`generateRoadmap` runs in one write transaction: `DETACH DELETE` the user's old Roadmap and Milestones, create `(:Roadmap {id, createdAt})`, then create a `(:Milestone {id, title, description, orderIndex, isCompleted:false})-[:TARGETS_SKILL]->(:Skill)` per gap. Resources and projects are read through the skill at query time, not copied. `completionPercentage` is computed on read, not stored, so it never drifts. `toggleMilestone` matches `(:User {id:$uid})-[:HAS_ROADMAP]->()-[:CONTAINS_MILESTONE]->(m {id:$mid})`. Zero rows means a foreign or unknown milestone, which throws an error.

**8. Validation at the trust boundary.**
`submitAssessment` checks that every score is an integer from 0 to 5 and that every skillId exists. It checks before writing, and rejects the whole batch on failure. The role id is checked against the existing roles.

**9. UI: three routes, shadcn + Tailwind, without a design system pass.**
- `/`: role cards (5) leading to `/assess/[roleId]`.
- `/assess/[roleId]`: a form with a native `<input type="range" min=0 max=5>` per required skill. The Server Action does submit, then generate, then `redirect('/roadmap')`.
- `/roadmap`: readiness and completion as large numbers with a Tailwind progress bar, and an ordered milestone list. Each checkbox is a small client component calling a `toggleMilestone` Server Action plus `revalidatePath`.

## Risks / Trade-offs

- [Aura Free provisioning or network latency eats time] → Provision Aura and paste the env vars first, as task 1, in parallel with `npm install`. If Aura is down, fall back to Docker `neo4j:5` and change only `NEO4J_URI`.
- [Seed data authoring is slow] → Keep each role to 6–8 required skills with short descriptions, and use official docs URLs as resources.
- [Next 16 API drift (proxy, async cookies/params)] → Read `proxy.md`, `route.md`, and `page.md` in `node_modules/next/dist/docs` before coding those files.
- [Yoga + Next 16 route handler incompatibility] → Yoga is fetch-API native. If it breaks, keep the service layer and drop the GraphQL route. The pages do not depend on it (Decision 2).
- [Anonymous cookie means progress is lost on cookie clear] → Accepted for MVP. Auth is Phase 4.
- [Prereq-only gap skills have weight 0 and are not rated in the assessment] → They show in the roadmap labelled "prerequisite". This is acceptable and teaches the graph story in the demo.

## Migration Plan

Greenfield. Deploy flow: set env vars, run `npm run seed`, then run `npm run dev` or deploy. Rollback means reverting the commit. Seeding is additive and idempotent.

## Open Questions

- Should Phase 2 resume parsing use Groq's JSON mode or tool calling for skill extraction? Decide during Phase 2. It does not affect this change.
