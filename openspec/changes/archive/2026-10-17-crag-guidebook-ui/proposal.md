# Proposal

## Why

The MVP UI is unstyled shadcn defaults: it works but does not show the product's one differentiator, the dependency-ordered prerequisite roadmap, and it is not demo-ready for the Hackfront judges. A coherent visual system and a roadmap that visibly reads as an ordered route fix that.

## What Changes

- Replace the neutral theme with a "crag guidebook" visual world: chalk ground, slate ink, one route-orange accent, prerequisite blue, completed green; Barlow Condensed headings over Barlow body.
- Add a persistent header with brand and navigation (Roles, My roadmap).
- Home: two-column layout with a short explanation, a prerequisite-chain diagram, and a numbered role list with loading skeleton.
- Assessment: each skill slider shows its named level (None, Aware, Learning, Proficient, Strong, Expert), highlights the proficiency threshold, and the submit action stays reachable in a sticky bar.
- Roadmap: milestones hang off a vertical route line (dashed ahead, solid when complete); prerequisites are tagged; resources and project are visually distinct; readiness and completion are progress bars.
- Restyle empty, loading, role-ready, and not-found states to match.
- No change to data, API, routes, or assessment/roadmap logic.

## Capabilities

### New Capabilities
- `guidebook-interface`: the app shell, navigation, visual language, and the visible states of the assessment and roadmap screens.

### Modified Capabilities

## Impact

- Code: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `app/assess/[roleId]/page.tsx`, `app/roadmap/page.tsx`, `app/not-found.tsx`, `components/skill-slider.tsx`, `components/milestone-checkbox.tsx`.
- Dependencies: Google fonts Barlow, Barlow Condensed via `next/font`; existing `lucide-react`.
- New context files: `PRODUCT.md`, `.impeccable/`.
