# Tasks

Time budget: about 75 min of build plus 15 min of buffer. Each group heading shows its target time.

## 1. Setup (~10 min)

- [x] 1.1 Provision a Neo4j AuraDB Free instance and put `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` in `.env.local`. Add `.env.example` with blank values. Verify `.env.local` is matched by `.gitignore`.
- [x] 1.2 Install `neo4j-driver graphql graphql-yoga` and dev `tsx`. Add `"seed": "tsx --env-file=.env.local scripts/seed.ts"` to package.json scripts. Verify `npm ls neo4j-driver graphql-yoga` succeeds.
- [x] 1.3 Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/{proxy,route,page}.md` for Next 16 conventions (async `cookies()`/`params`, `proxy.ts`). Verify by noting the exact export signatures used in groups 3–5.

## 2. Skill graph and seed (~20 min)

- [x] 2.1 Create `lib/neo4j.ts`: a driver singleton on `globalThis` and a `run(cypher, params)` helper using `executeQuery`, with `disableLosslessIntegers: true`. Verify with a one-off `RETURN 1` through the seed script connection.
- [x] 2.2 Write `scripts/seed.cypher`. It needs uniqueness constraints and `MERGE`-only data for the 5 predefined roles (ids `fullstack-dev`, `ml-engineer`, `data-scientist`, `software-architect`, `ai-engineer`), each with 6–8 `REQUIRES_SKILL {importanceWeight}`. Software Architect requires System Design, Design Patterns, Distributed Systems, Microservices, Cloud Architecture, API Design, Security Architecture, and Scalability. It also needs about 30 shared skills with an acyclic `REQUIRES_PREREQUISITE` graph, 1 https `Resource` per skill, and at least 1 `Project` per role via `PRACTICED_BY`. Include "RAG Architectures" requiring "Vector Databases" and "Deep Learning" requiring "Python" so the spec scenarios hold.
- [x] 2.3 Write `scripts/seed.ts` to run the statements in `seed.cypher` in sequence. Verify by running `npm run seed` twice and confirming in the Aura console that `MATCH (r:Role) RETURN count(r)` = 5. Also confirm that `MATCH (s:Skill)-[:REQUIRES_PREREQUISITE*]->(s) RETURN count(s)` = 0, and that skill and relationship counts are unchanged after the second run.

## 3. Service layer and GraphQL API (~20 min)

- [x] 3.1 Create `proxy.ts` to set the `cp_uid` httpOnly cookie (`crypto.randomUUID()`, sameSite=lax, 1-year) when it is missing. Verify that `curl -i localhost:3000/` shows `Set-Cookie: cp_uid=` on the first request only.
- [x] 3.2 Create `lib/career.ts` with `listRoles`, `getRole(id)` (with required skills, weights, and prereqs), and `submitAssessment(uid, roleId, scores)`. The latter merges the User, sets `TARGETS_ROLE` (replacing any old one), and upserts `HAS_SKILL {proficiencyScore, verifiedAt}`. It validates integers 0–5 and checks that all skill ids and the role id exist, all before any write.
- [x] 3.3 Add `orderGaps(skills)` in `lib/career.ts`: Kahn's algorithm with a weight-desc-then-name tie-break. Verify via the 3.4 GraphiQL check that prerequisites come before dependents.
- [x] 3.4 Add `gapAnalysis(uid, roleId)` (the Cypher from design Decision 6, piped through `orderGaps`) and `readiness(uid, roleId)` (weighted average of score/5 × 100, rounded). Verify via GraphiQL in 3.6: all-0 ratings give readiness 0, all-5 ratings give readiness 100 and an empty gap list, and a rating of 3 is not a gap.
- [x] 3.5 Add `generateRoadmap(uid, roleId)` (one write tx: delete the old roadmap and milestones, create the new ones in gap order) and `getMyRoadmap(uid)`. The latter returns the role, readiness, milestones with skill, resources, and project, and completion computed on read (100 when there are 0 milestones). Also add `toggleMilestone(uid, milestoneId, completed)`, which throws when no row matches.
- [x] 3.6 Create `lib/graphql/schema.ts` (trimmed SDL plus resolvers wrapping `lib/career.ts`, with `uid` from context) and `app/api/graphql/route.ts` (Yoga, exporting GET/POST, with context reading `cp_uid` from request cookies). Verify in GraphiQL at `/api/graphql`: `{ roles { id title } }` returns 5, `submitAssessment` with score 6 returns a validation error, and toggling a random milestone id returns an error.

## 4. UI pages (~20 min)

- [x] 4.1 Replace `app/page.tsx` with a role picker: 5 cards (title and description) linking to `/assess/[roleId]`. Update metadata in `app/layout.tsx` to "CareerPath AI". Verify that 5 cards render at `/`.
- [x] 4.2 Create `app/assess/[roleId]/page.tsx`: a list of required skills with a 0–5 range input each (default 0, current value shown), and a Server Action that calls `submitAssessment`, then `generateRoadmap`, then `redirect('/roadmap')`. Unknown roleId calls `notFound()`. Verify that submitting lands on `/roadmap`.
- [x] 4.3 Create `app/roadmap/page.tsx`. Show the role title, a readiness number with a progress bar, a completion %, and an ordered milestone list. Each milestone shows its skill, a "prerequisite" badge for weight-0 skills, resource links with `target="_blank" rel="noopener noreferrer"`, and its project. Show a "Role-ready" state for 0 milestones, and a "Pick a role" link to `/` when no roadmap exists.
- [x] 4.4 Create the client `MilestoneCheckbox` component calling a `toggleMilestone` Server Action plus `revalidatePath('/roadmap')`. Verify that checking 2 of 5 shows completion 40, and that the state persists after a reload.

## 5. Demo dry run (~5 min)

- [x] 5.1 Run the end-to-end demo path in a fresh browser profile: pick AI Engineer, rate RAG 1 and the rest 4, and confirm that Vector Databases appears before RAG in the roadmap. Toggle a milestone, reload, and confirm it persists. Re-assess and confirm the old roadmap is replaced. Run `npm run build` and confirm it passes.
- [x] 5.2 Update `README.md` with setup (env vars, `npm run seed`, `npm run dev`), the GraphQL endpoint, and the Phase 2–4 roadmap. Verify that the README commands run as written.

## Workflow follow-up

- Phase 2 (separate change): resume paste/upload, Groq skill extraction, and a role-match `uploadResume` mutation.
- Phase 3 (separate change): Groq resume-aligned guidance notes on the roadmap.
- Phase 4 (separate change): micro-quizzes, Recharts dashboard, auth, and more roles and resources.
- Archive this change after the demo once tasks are verified.
