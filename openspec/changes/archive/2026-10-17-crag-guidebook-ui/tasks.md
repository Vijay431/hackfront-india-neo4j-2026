# Tasks

## 1. Visual system and shell

- [x] 1.1 Replace theme tokens and add route/prereq/sent tokens, focus and selection styles in `app/globals.css`; verify `npx tsc --noEmit` and build succeed
- [x] 1.2 Load Barlow and Barlow Condensed in `app/layout.tsx`; add header with brand and Roles / My roadmap links; verify header appears on all pages in a screenshot

## 2. Screens

- [x] 2.1 Rebuild home with intro, chain diagram, numbered role list and skeleton; verify five roles render at 1440 and 390 widths
- [x] 2.2 Rebuild assessment with named-level sliders, threshold highlight, `aria-valuetext`, and sticky submit; verify sliders move and submit reaches `/roadmap`
- [x] 2.3 Rebuild roadmap with route line, prerequisite tags, resource chips, project note, progress bars and styled empty/role-ready states; verify at 1440 width
- [x] 2.4 Restyle `app/not-found.tsx`; verify unknown role id shows it with header

## 3. Verification and polish

- [ ] (deferred) 3.1 Capture and review the roadmap and not-found pages at 390 width; verify no horizontal scroll and no clipped text
- [ ] (deferred) 3.2 Toggle a milestone and verify the route segment turns solid and completion percentage updates after reload
- [ ] (deferred) 3.3 Keyboard pass: tab through each page and verify visible focus and operable sliders/checkboxes
- [ ] (deferred) 3.4 Check contrast of `route-ink`, muted text, and tags against their backgrounds (>= 4.5:1 for text)
- [ ] (deferred) 3.5 Run reduced-motion emulation and verify the home route line is static
- [ ] (deferred) 3.6 Document the built system: run `/impeccable document` and verify `DESIGN.md` exists

## Workflow follow-up

- Archive the change after review.
