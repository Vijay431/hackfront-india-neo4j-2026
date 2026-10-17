# CareerPath AI

Pick a target role, rate your skills (0–5), and get a prerequisite-ordered learning roadmap computed from a Neo4j skill graph.

## Setup

1. Provision a Neo4j AuraDB Free instance and copy `.env.example` to `.env`, filling in `NEO4J_URI`, `NEO4J_USERNAME`, `NEO4J_PASSWORD` (and `NEO4J_DATABASE` if not the default).
2. `npm install`
3. `npm run seed` — idempotent; safe to re-run, never touches user data.
4. `npm run dev` — open http://localhost:3000

## GraphQL

GraphiQL and the API live at `/api/graphql`. User-scoped operations use the anonymous `cp_uid` cookie set by `proxy.ts`.

Queries: `roles`, `role(id)`, `gapAnalysis(roleId)`, `myRoadmap`.
Mutations: `submitAssessment(roleId, assessments)`, `generateRoadmap(roleId)`, `toggleMilestone(milestoneId, completed)`.

## Roadmap

- Phase 2: resume upload/paste, skill extraction and role matching with Groq.
- Phase 3: resume-aligned career guidance notes.
- Phase 4: adaptive micro-quizzes, progress charts, auth, more roles and resources.
