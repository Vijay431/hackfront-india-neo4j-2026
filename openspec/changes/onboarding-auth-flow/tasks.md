# Tasks

## 0. Prerequisite

- [x] 0.1 Archive `crag-guidebook-ui` (finish or explicitly defer its 3.x tasks first) and verify `openspec/specs/guidebook-interface/spec.md` exists and `openspec validate onboarding-auth-flow --strict` no longer reports the guidebook-interface info

## 1. Skill graph seed

- [x] 1.1 Add skills `html-css`, `java`, `c-cpp`, `dsa`, `linux`, `cloud-basics`, `cicd`, `data-pipelines`, `solutions-eng` with curated docs URLs and a `q` search field on every skill row in `scripts/seed.cypher`; verify each new docs URL returns HTTP 200 with `curl -sIL -o /dev/null -w '%{http_code}'`
- [x] 1.2 Add prerequisite edges javascript→html-css, docker→linux, cicd→git, cloud-arch→cloud-basics, data-pipelines→python, data-pipelines→sql, solutions-eng→rest-apis, system-design→dsa; verify no cycle with `MATCH p=(s:Skill)-[:REQUIRES_PREREQUISITE*1..]->(s) RETURN count(p)` = 0
- [x] 1.3 Add role `forward-deployed-engineer` with its weighted skills and project `proj-fde`; verify the `roles` query returns six roles
- [x] 1.4 Set `Skill.estHours` (15 / 20 / 30 rule) and add `video`, `course`, `hands-on` resources per skill; run `npm run seed` twice and verify node and relationship counts are unchanged by the second run, and every skill in any role closure has all four resource types

## 2. Demo auth and routing

- [x] 2.1 Rewrite `proxy.ts` to redirect page requests without `cp_user` to `/login` (allow `/login`, `/api/graphql`, static assets), and update `lib/session.ts` and `app/api/graphql/route.ts` to read `cp_user`; verify `curl -sI localhost:3000/roadmap` returns a redirect to `/login`
- [x] 2.2 Add `loginAction` / `logoutAction` and the `nextStep(uid)` helper; verify a malformed email or empty password shows a field error and sets no cookie, and that a valid sign-in sets an httpOnly `cp_user` cookie with the lower-cased email
- [x] 2.3 Build `/login` with the intro and `ChainDiagram` moved from `app/page.tsx` plus a demo-only notice, and turn `app/page.tsx` into a `nextStep` redirect; verify with `playwright-cli` at 1440 and 390 widths (form first on mobile)
- [x] 2.4 Make the header an async Suspense component showing Change path / My roadmap / email / Log out when signed in and only the brand when signed out; update `app/not-found.tsx` link to `/`; verify Log out clears the cookie and lands on `/login`

## 3. Onboarding profile

- [x] 3.1 Create `lib/profile.ts` with the nine questions, option keys and labels, answer→skill mapping, and hours-per-day values; verify `npx tsc --noEmit` passes
- [x] 3.2 Add `submitProfile` / `getProfile` in `lib/career.ts`: validate answers, store profile properties and `onboardedAt`, derive and replace `HAS_SKILL` scores in one write transaction; verify in Cypher the spec scenarios (Beginner Python+React → 3/2; Intermediate web → html-css 3, javascript 3; 3+ projects React → javascript and html-css ≥ 3; None yet → no scores) and that an invalid option stores nothing
- [x] 3.3 Build `/onboarding` as a one-question-per-step client form (fieldsets, native inputs, "Question N of 9" progress, Back/Next, exclusive "None yet") posting to `submitProfileAction`, redirecting users with a profile away; verify a new user completes it by keyboard only and lands on `/path`

## 4. Path picker and roadmap

- [x] 4.1 Replace gap-only generation in `generateRoadmap` with the prerequisite-closure query, ordered by `orderGaps`, with `isCompleted` from score ≥ threshold; verify a Python-3/SQL-2 profile picking Data Scientist gets a checked Python milestone, an unchecked SQL milestone, and JavaScript before React in Full-Stack
- [x] 4.2 Build `/path` with greeting, disabled "coming soon" chat input with lock icon, and six role chips calling `pickPathAction` under `useTransition` (busy chip, others disabled); verify typing does nothing and picking a chip opens `/roadmap`
- [x] 4.3 Extend `getMyRoadmap` with `estHours`, profile, learning-style resource order, and a pure `pace()` result; verify the 60 h at "1–2 hours" → 40 days example and that toggling a 20 h milestone lowers remaining hours after reload
- [x] 4.4 Update `app/roadmap/page.tsx` with the profile summary strip, pace/finish date, timeline-fit warning, per-milestone hours, resource type labels, and redirect to `/path` when no roadmap; verify a 3-month Beginner profile shows the warning and a fully pre-checked roadmap shows role-ready, at 1440 and 390 widths
- [x] 4.5 Update GraphQL: drop `submitAssessment`, add `Profile`, `myProfile`, `submitProfile`, `Milestone.estHours`, `Roadmap.pace`; verify with `curl` POSTs that `myProfile` returns the saved profile with a `cp_user` cookie and errors "No user session" without one

## 5. Removal and docs

- [x] 5.1 Delete `app/assess/[roleId]/page.tsx`, `components/skill-slider.tsx`, `assessAction`, `submitAssessment`, and the `.grade-range` CSS; verify `grep -rn "assess\|skill-slider\|grade-range" app components lib` finds no leftovers and `/assess/ai-engineer` returns the not-found page
- [x] 5.2 Update `README.md` for the new flow, re-seed step, and demo-auth warning; verify the documented steps run as written from a clean `npm run seed`

## 6. Integration

- [x] 6.1 Run `npx tsc --noEmit`, `npm run lint`, and `npm run build`; verify all pass
- [x] 6.2 End-to-end with `playwright-cli`: new email → onboarding → pick Forward Deployed Engineer → roadmap with pre-checked milestones → Change path to AI Engineer → Log out → sign in again with the same email lands on the AI Engineer roadmap; verify each step and no horizontal scroll at 390 width

## 7. Revisions: wider skills, multi-select learning style, chat composer

- [ ] 7.1 Extend the known-skills options in `lib/profile.ts` with TypeScript, Node.js, HTTP / Web fundamentals, Database Design, OOP / Design Patterns, Statistics & Probability, Linear Algebra, Pandas / NumPy, Data Visualization, Deep Learning, NLP / LLMs, System Design, mapped as in design.md; verify every mapped id exists in `scripts/seed.cypher`, a Beginner picking Statistics + Pandas gets 3 / 2, and the option tiles fit at 390 width with no horizontal scroll
- [ ] 7.2 Make learning style multi-select: `multi: true` with no "None yet", require at least one answer for every question in the form and in `parseAnswers`, store `learningStyles[]` with the `coalesce` read fallback, rename the GraphQL field to `learningStyles: [String!]!`, and sort resources by chosen types first then the fixed order; verify Videos + Hands-on gives video, hands-on, docs, course, that `learningStyles: []` is rejected, and that a user saved with the old single `learningStyle` still loads their roadmap
- [ ] 7.3 Rebuild the path-picker chat input as a grayed-out composer (Search icon, disabled input, disabled Mic and send buttons with accessible names, "Coming soon" badge) in `app/path/path-picker.tsx`; verify with `playwright-cli` at 1440 and 390 widths that typing, mic, and send do nothing and chips still build the roadmap
- [ ] 7.4 Run `npx tsc --noEmit`, `npm run lint`, `npm run build`, then repeat the 6.2 end-to-end flow with several learning styles; verify all pass

## Workflow follow-up

- Archive the change after review.
