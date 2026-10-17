# Design

## Context

Next.js 16 App Router with `cacheComponents`. Pages are async server components inside Suspense and call `connection()` or cookies for request-time data. `proxy.ts` sets an anonymous `cp_uid` cookie on every request. `lib/session.ts#getUid` reads it, and the GraphQL route parses it from the header. `lib/career.ts` owns all Cypher: `submitAssessment` writes `(:User)-[:HAS_SKILL {proficiencyScore}]->(:Skill)`; `gapAnalysis` returns below-threshold required skills plus transitive prerequisites; `orderGaps` (Kahn) orders them; `generateRoadmap` replaces the user's single `Roadmap`. Every skill currently has one `docs` resource. Requirements are in `specs/`; motivation is in proposal.md.

## Goals / Non-Goals

**Goals:**
- Keep `HAS_SKILL.proficiencyScore` as the single input to readiness, gap analysis, and pre-checking, so the profile only has to produce scores.
- Keep all Cypher in `lib/career.ts`. Questionnaire constants and score mapping live in one module.

**Non-Goals:**
- Real authentication, password storage, email verification, or rate limiting.
- Migrating anonymous `cp_uid` data.
- Editing or retaking the profile. The chat composer stays inert: no NLP, no search, no voice capture.
- Recomputing scores when milestones are toggled. Readiness stays profile-based.

## Decisions

- **Session = email in a `cp_user` httpOnly cookie, set by a server action.** `loginAction` validates the email with a simple pattern and checks the password is non-empty, then lower-cases and trims the email. It `MERGE`s `(:User {id: email})`, sets the cookie (SameSite=Lax, one year), and redirects to `/`. `logoutAction` deletes the cookie. A new cookie name orphans old anonymous cookies cleanly. Alternative: a signed JWT; rejected because it adds a secret and a dependency and gives no extra security, since the password is not checked anyway.
- **`proxy.ts` only gates; pages route by state.** The proxy stops minting ids. Without `cp_user`, every page request except `/login` and static assets redirects to `/login`. `/api/graphql` passes through and fails in the resolver, as now. Routing that needs the database (profile? roadmap?) lives in one server helper, `nextStep(uid)`, which returns `/onboarding`, `/path`, or `/roadmap`. `/`, `/login` (when signed in), `/onboarding` (when a profile exists), and `/roadmap` (when there is no roadmap) use it. The proxy stays free of database calls.
- **Profile on the `User` node.** The profile is stored as properties: `education`, `level`, `knownSkills[]`, `tools[]`, `experience`, `goal`, `timelineMonths`, `dailyTime`, `learningStyles[]`, `onboardedAt`. Reads use `coalesce(u.learningStyles, [u.learningStyle])` (dropping nulls) so users onboarded when learning style was single-choice still load. A separate `Profile` node is rejected because there is exactly one profile per user and nothing links to it.
- **`lib/profile.ts` holds the question set and mapping.** It defines one typed constant per question: option keys, labels, and the skill ids each option maps to. The onboarding UI, server-side validation, the profile summary labels, and score derivation all use it. Options map only to skills that already exist in the graph, so widening the list needs no seed change. The mapping is:

  | Answer | Skill ids |
  |---|---|
  | python | python |
  | java | java |
  | c-cpp | c-cpp |
  | web | html-css, javascript |
  | sql | sql |
  | dsa | dsa |
  | ml | ml-fundamentals |
  | git | git |
  | linux | linux |
  | docker | docker |
  | cloud | cloud-basics |
  | react | react |
  | rest | rest-apis |
  | cicd | cicd |
  | typescript | typescript |
  | nodejs | nodejs |
  | http | http |
  | databases | databases |
  | oop | design-patterns |
  | statistics | statistics |
  | linear-algebra | linear-algebra |
  | pandas | pandas |
  | data-viz | data-viz |
  | deep-learning | deep-learning |
  | nlp-llms | nlp, llms |
  | system-design | system-design |

- **Score derivation in TypeScript, written in one transaction.** `submitProfile(uid, answers)` validates every value against `lib/profile.ts`, and rejects any question with no answer (an empty multi-select included). It loads the prerequisite edges for the mapped skills (one query: mapped ids, whether each has prerequisites, and the transitive prerequisite ids). It computes scores as the spec says, then in one `runWriteTx` sets the profile properties, deletes old `HAS_SKILL` edges, and writes the new ones. "Fundamental" means a skill with no outgoing `REQUIRES_PREREQUISITE`. This is derived from the graph, so there is no list to maintain.
- **Roadmap = prerequisite closure, pre-checked.** `generateRoadmap` swaps `gapAnalysis` for a closure query: required skills ∪ `REQUIRES_PREREQUISITE*1..` targets, each with weight, prerequisites, and the user's score. Ordering reuses `orderGaps`. Each milestone is created with `isCompleted = score >= PROFICIENCY_THRESHOLD`. `gapAnalysis` and `readiness` stay unchanged and keep serving the GraphQL `gapAnalysis` query. The "Prerequisite" tag stays `req IS NULL`.
- **Pace computed on read.** `getMyRoadmap` also returns `estHours` per milestone and the profile. A pure function `pace(milestones, profile, today)` returns:
  - `remainingHours`
  - `days` = ceil(remainingHours / hoursPerDay)
  - `finishDate`
  - `targetDate` = onboardedAt + timelineMonths
  - `fits`
  - `neededHoursPerDay` = remainingHours / days to target, or null if the target has passed

  The pace values are never stored, so toggling a milestone updates them on the next render. Hours per day come from `lib/profile.ts`: 0.75 / 1.5 / 3.5 / 5.
- **Effort estimate as `Skill.estHours`, set in the seed.** The default is 20. ML, AI, and Architecture category skills are 30. Fundamentals with no prerequisites (HTML/CSS, Git, Linux) are 15. The rule is applied in Cypher after the skill `MERGE`, so new skills get it too.
- **Extra resource types are generated search links.** The seed adds three resources per skill:
  - `video`: `https://www.youtube.com/results?search_query=<name>+tutorial`
  - `course`: `https://www.freecodecamp.org/news/search/?query=<name>`
  - `hands-on`: `https://github.com/search?q=<name>+exercises&type=repositories`

  `<name>` is a precomputed URL-safe `q` field on each seed skill row (for example `html+css`). This avoids depending on APOC. The `docs` resource stays curated. Alternative: about 150 hand-picked URLs; rejected because they would go stale and could not be verified in the hackathon window. Resource ids are `res-<skill>-<type>`, and the existing `res-<skill>` docs id is kept, so re-seeding stays idempotent.
- **Resource order applied in `getMyRoadmap`.** Resources are sorted by two keys: types in the user's `learningStyles` first, then the fixed order docs, video, course, hands-on. With all four styles chosen, this is the plain fixed order. The page only renders the order it receives.
- **New graph content.**
  - Skills: `html-css`, `java`, `c-cpp`, `dsa`, `linux`, `cloud-basics`, `cicd`, `data-pipelines`, `solutions-eng`.
  - New prerequisite edges: javascript→html-css, docker→linux, cicd→git, cloud-arch→cloud-basics, data-pipelines→python, data-pipelines→sql, solutions-eng→rest-apis, system-design→dsa.
  - Role `forward-deployed-engineer` with weights: solutions-eng 1.0, rest-apis 0.9, python 0.9, data-pipelines 0.8, sql 0.8, docker 0.7, cloud-basics 0.7, linux 0.6, git 0.5, cicd 0.5.
  - Project `proj-fde` "Customer Integration Pilot" on `data-pipelines`.
  - Curated `docs` URLs for the new skills are chosen during implementation and must return HTTP 200.
- **GraphQL follows the server actions.** Remove `submitAssessment`. Add `Profile` type (with `learningStyles: [String!]!`), `myProfile: Profile`, and `submitProfile(input: ProfileInput!): Profile!`. Add `estHours` to `Milestone` and a `pace` field to `Roadmap`. The route reads `cp_user`. `requireUid` is unchanged.
- **UI.**
  - `/login`: two columns, using the intro and `ChainDiagram` moved from the current home page. On mobile the form comes first.
  - `/onboarding`: one client component that keeps answers in state and shows one `fieldset` per step with native radio/checkbox inputs styled as large tiles. It posts one `FormData` to `submitProfileAction`, which redirects to `/path`.
  - `/path`: a server page that lists roles. A client chip group uses `useTransition` to call `pickPathAction(roleId)`, which generates the roadmap and redirects to `/roadmap`.
  - Locked chat composer: a rounded box on a muted background at reduced opacity, with a "Coming soon" badge. It holds a `Search` icon (decorative), `<input disabled aria-describedby>` with "Ask about careers — coming soon", a disabled `Mic` button labelled "Voice input — coming soon", and a disabled send (`ArrowUp`) button. All icons come from `lucide-react`.
  - The header becomes an async component in Suspense that reads the cookie.

## Risks / Trade-offs

- [Anyone can sign in as any email] → Demo-only banner on the sign-in page; README states it. The cookie holds no secret and real data must not be entered.
- [Search-link resources are not curated] → They are labelled by type ("Video search", "Course search", "Practice repos"), so users know they are searches. The curated docs link stays.
- [Full-closure roadmaps are longer than gap-only ones] → Pre-checked milestones render compactly, and the solid route plus the completion % show how far along the user already is.
- [Readiness ignores milestone toggles] → Accepted. It reflects the profile. Changing that is a separate decision.
- [Reading the cookie in the layout header makes every page dynamic] → Pages are already request-time. The header sits in its own Suspense boundary so the shell can stream.

## Migration Plan

1. Archive `crag-guidebook-ui` first, because this change's `guidebook-interface` delta modifies requirements that change introduces.
2. Run `npm run seed`. It is additive and idempotent: existing roles, skills, and resources keep their ids.
3. Deploy. Old `cp_uid` cookies are ignored, so users sign in and onboard. Stale anonymous `User` nodes can remain or be removed with `MATCH (u:User) WHERE NOT u.id CONTAINS '@' DETACH DELETE u`.

Rollback: revert the code. The seed additions do no harm to the old code, which ignores the extra role, skills, and resource types.
