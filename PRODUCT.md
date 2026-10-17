# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Career switchers and students unsure what to learn next, plus working developers upskilling toward a step up (e.g. Software Architect, AI Engineer). Anonymous, no login; they pick a role, self-rate skills, and want a clear ordered path.

## Product Purpose
CareerPath AI turns a self-assessment into a dependency-ordered learning roadmap for one of five roles (Full-Stack Developer, ML Engineer, Data Scientist, Software Architect, AI Engineer). Success: user sees their readiness, knows what to learn first, and ticks off milestones. Currently shown in a hackathon demo (Hackfront India Neo4j 2026) to judges.

## Positioning
Gaps come from a Neo4j prerequisite graph: missing transitive prerequisites are included and the roadmap is ordered by dependency, not a flat checklist.

## Capabilities and Constraints
- Flow: home (role cards) -> /assess/[roleId] (0-5 sliders) -> /roadmap/[roleId] (readiness score, ordered milestones with resources/projects, completion checkboxes).
- Next.js 16, Tailwind 4, shadcn/base-ui, GraphQL Yoga + Neo4j; anonymous cookie identity.
- Proficient = score >= 3; unrated = 0.
- Resume upload / role matching from docs/blueprint.md is NOT built.

## Evidence on Hand
Real data: seeded skill graph in Neo4j. No testimonials, user counts or benchmarks exist; do not fabricate.

## Product Principles
- Show the graph logic: ordering and prerequisites are the differentiator.
- Anonymous and instant: no signup friction.
- Progress must feel tangible (readiness score, milestone completion).
