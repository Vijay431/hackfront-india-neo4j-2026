# Proposal

## Why

Today a visitor is anonymous, picks a role from a list, and rates every skill of that role on a 0–5 slider before seeing a roadmap. That is slow for a student and gives the roadmap no sense of who the user is: their year, pace, goal, or how they like to learn. A short profile questionnaire after sign-in, followed by a one-tap path choice, produces a roadmap that already knows what the user has done and how long the rest will take.

## What Changes

- **BREAKING** Add a demo sign-in screen (email + password). Any well-formed email and any non-empty password signs in; the password is never checked or stored. The email is the user id. Anonymous identity is removed, so data saved under an anonymous cookie is no longer reachable.
- Signed-out visitors are sent to sign-in. After sign-in, a new user goes to onboarding, a user with a profile but no roadmap goes to the path picker, and a user with a roadmap goes to the roadmap. Header gets the signed-in email and "Log out".
- Add a one-time onboarding questionnaire of nine questions: education level, technical skill level, known skills, tools, hands-on experience, primary goal, target timeline, daily learning time, and learning styles (multi-select). The known-skills question covers the programming, data, ML, and architecture skills the six roles need. The answers are saved as the user's profile and turned into skill proficiency scores.
- **BREAKING** Remove the per-role 0–5 slider assessment page (`/assess/[roleId]`) and the `submitAssessment` API. The profile replaces it.
- Add a path picker styled like a chat assistant: a grayed-out, disabled chat composer (search icon, text input, voice and send buttons) marked "coming soon", with one chip per career role underneath. Picking a chip builds the roadmap. "Change path" in the header reopens the picker and rebuilds the roadmap from the same profile.
- Add a sixth role, **Forward Deployed Engineer**, with its skills, prerequisites, resources, and project. Add the skills the questionnaire can name that the graph lacks (HTML/CSS, Java, C/C++, DSA, Linux, cloud basics, CI/CD, data pipelines, solutions engineering).
- The roadmap shows the role's full prerequisite route instead of only the gaps. Milestones for skills the profile already covers start checked off.
- Add a pace estimate: hours per milestone, days remaining from the daily time answer, and a projected finish date. If the finish date is later than the target timeline, show a warning with the daily hours needed to make it.
- Every skill gets video, course, and hands-on resources alongside its docs link. Types that match any of the user's chosen learning styles are listed first.
- The roadmap page shows a compact, read-only summary of the profile.
- The home page role list moves out: home routes by user state. The intro and prerequisite-chain diagram move to the sign-in page.

## Capabilities

### New Capabilities
- `demo-auth`: demo email sign-in, the session cookie, sign-out, and routing signed-in users to onboarding, the path picker, or their roadmap.

### Modified Capabilities
- `skill-assessment`: anonymous identity and slider self-rating are removed; the onboarding questionnaire, profile storage, and profile-derived proficiency scores are added; target role selection moves to the path picker.
- `skill-graph`: the catalog grows from five to six roles; each skill carries an effort estimate and resources of four types.
- `learning-roadmap`: the roadmap covers the full prerequisite route with known skills pre-checked; it adds pace, finish-date, and timeline-fit output, learning-style resource order, and a profile summary.
- `guidebook-interface`: navigation changes to Change path / My roadmap / Log out; the role list, named slider levels, and sticky assessment submit are removed; the path picker screen is added. This capability is introduced by `crag-guidebook-ui`, which must be archived before this change is archived.

## Impact

- Code: `proxy.ts`, `lib/session.ts`, `lib/career.ts`, new `lib/profile.ts`, `lib/graphql/schema.ts`, `app/api/graphql/route.ts`, `app/actions.ts`, `app/layout.tsx`, `app/page.tsx`, `app/roadmap/page.tsx`, `app/not-found.tsx`, new `app/login`, `app/onboarding`, `app/path` routes; remove `app/assess/[roleId]/page.tsx` and `components/skill-slider.tsx`.
- Data: `scripts/seed.cypher` adds one role, nine skills, prerequisite edges, effort estimates, and three resource types per skill. Run `npm run seed` again; it stays idempotent.
- API: GraphQL drops `submitAssessment`, adds `myProfile` and `submitProfile` (with `learningStyles` as a list), and `Roadmap` gains pace fields. The cookie changes from `cp_uid` to `cp_user`.
- Security: demo sign-in has no real authentication. Anyone who types an email can act as that user. Use it for demos only and never with real personal data.
- Dependencies: none new.
