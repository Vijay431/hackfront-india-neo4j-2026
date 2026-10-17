# Design

## Context

UI is Next.js 16 App Router with Tailwind 4 and shadcn tokens in `app/globals.css`. Pages are async server components inside Suspense; sliders and checkboxes are client components. Product facts live in `PRODUCT.md`. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- One committed visual world carried by tokens, so pages inherit it.
- The route line is the signature: order, prerequisites, and progress readable from one vertical axis.

**Non-Goals:**
- No data, GraphQL, or Cypher changes; no new routes.
- No dark theme, resume upload, or graph visualization of the full skill graph.
- No image-generated comps; code-first build.

## Decisions

- **Tokens over per-page colors.** Replace shadcn `:root` values and add `route`, `route-ink`, `prereq`, `sent`, `chalk` tokens mapped in `@theme inline`. Alternative: hard-coded Tailwind palette classes; rejected, harder to retheme.
- **Route line in CSS, not SVG.** A `::before` border on each `li` with `data-done`, so segment state follows server data with no JS. Alternative: single SVG path measured at runtime; rejected as fragile across wrapping text.
- **Home diagram is static SVG** with `pathLength=1` draw animation gated by `prefers-reduced-motion`.
- **Native range input styled by CSS** (`.grade-range`) rather than a custom slider, keeping form posting, keyboard, and screen reader behavior.
- **Fonts via `next/font/google`** (Barlow, Barlow Condensed), self-hosted at build, replacing Geist Sans; Geist Mono kept for numerals.
- **Chalk-cool palette, light only.** Daytime desk use; avoids the cream/serif default.

## Risks / Trade-offs

- [Orange on chalk contrast for small text] → use darker `route-ink` for text, `route` only for fills and large elements.
- [Dashed route offsets drift if milestone content height changes] → segment spans from the node to the item bottom, so it follows layout.
- [Google Fonts fetch at build needs network] → fonts fall back to system sans if unavailable.
- [Detector flags the 3px solid left border as a side-tab] → it is a connector, not a card accent; accepted.
