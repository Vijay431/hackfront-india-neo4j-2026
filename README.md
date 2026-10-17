# CareerPath AI

Sign in, answer a nine-question profile once, pick a career path, and get a prerequisite-ordered learning roadmap with a pace estimate, computed from a Neo4j skill graph.

## Setup

1. Provision a Neo4j AuraDB Free instance and copy `.env.example` to `.env`, filling in `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` (and `NEO4J_DATABASE` if not the default).
2. `npm install`
3. `npm run seed` — idempotent; safe to re-run, never touches user data. Re-run it after pulling: it adds the Forward Deployed Engineer role, new skills, effort estimates, and video/course/hands-on resources.
4. `npm run dev` — open http://localhost:3000 and sign in.

## Demo sign-in

**Demo only, not real authentication.** Any well-formed email with any non-empty password signs in. The password is never checked or stored, and anyone who knows an email can sign in as that user. Do not enter real credentials or personal data. The lower-cased email is the user id, stored in an httpOnly `cp_user` cookie. Data from the old anonymous `cp_uid` cookie is not migrated.

## Flow

`/login` → `/onboarding` (once) → `/path` (pick a role chip) → `/roadmap`. "Change path" in the header rebuilds the roadmap from the same profile.

## GraphQL

GraphiQL and the API live at `/api/graphql`. User-scoped operations read the `cp_user` cookie set at sign-in.

Queries: `roles`, `role(id)`, `gapAnalysis(roleId)`, `myRoadmap`, `myProfile`.
Mutations: `submitProfile(input)`, `generateRoadmap(roleId)`, `toggleMilestone(milestoneId, completed)`.

## Roadmap

- Phase 2: resume upload/paste, skill extraction and role matching with Groq.
- Phase 3: resume-aligned career guidance notes.
- Phase 4: adaptive micro-quizzes, progress charts, real auth, more roles and resources.
