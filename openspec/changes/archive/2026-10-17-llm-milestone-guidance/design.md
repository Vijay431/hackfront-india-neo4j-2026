# Design

## Context

`generateRoadmap()` in `lib/career.ts` computes the role's prerequisite closure in Cypher, orders it with `orderGaps()`, builds milestone objects with template descriptions, and writes them in one transaction. It runs from `pickPathAction` (server action) and the `generateRoadmap` GraphQL mutation. The dashboard renders `m.description` as React text, so model output is escaped. There is no test runner in the repo; verification is `npm run lint`, `npx tsc --noEmit`, and a manual run of the app.

## Goals / Non-Goals

**Goals:**
- One bounded model call per roadmap generation, made before the write transaction.
- Deterministic fallback per milestone, so roadmap structure never depends on the model.

**Non-Goals:**
- Retries, response caching, streaming, or background regeneration.
- A provider abstraction. OpenRouter is the only provider.
- Adding a test framework for this change.

## Decisions

**Call OpenRouter with `fetch`, no SDK.** `POST https://openrouter.ai/api/v1/chat/completions` with `Authorization: Bearer $OPENROUTER_API_KEY` and an OpenAI-style `{ model, messages }` body. One endpoint does not justify a dependency. Alternative: the `openai` SDK pointed at OpenRouter's base URL. Rejected: extra package for one call.

**Free model, overridable by env.** Default to a free open-source instruct model (`:free` suffix, for example `nvidia/nemotron-3-super-120b-a12b:free`). Read `OPENROUTER_MODEL` to override. Free models on OpenRouter are added and retired often, so swapping one should not need a code change. Confirm the default id is still listed as free at apply time.

**New module `lib/llm.ts` exporting one function.** `milestoneDescriptions({ role, profile, skills })` returns `Map<skillId, string>`. It never throws: on a missing key, non-2xx status, timeout, or unparsable output it returns an empty map. `generateRoadmap()` builds each description as `map.get(skillId) ?? templateText`. The fallback stays in `lib/career.ts`, next to the existing template text.

**Prompt asks for JSON keyed by skill id.** The system message asks for a JSON object `{ "<skillId>": "<description>" }` only. The user message lists role title and description, profile answers (labels via `labelOf`), and the ordered skills as `id: name (role skill | prerequisite)`. Parsing extracts the first `{...}` block from the reply, because free models often wrap JSON in prose or code fences. `response_format: json_object` is not used, since many free models ignore or reject it.

**Validate every entry.** Keep only keys that are skill ids sent in the request, values that are strings, trimmed, non-empty, and at most 300 characters. Anything else falls back for that milestone.

**Timeout 20 s via `AbortSignal.timeout`.** Free models can be slow. The bound keeps path picking usable. Lower values cause frequent fallbacks.

**Call before the transaction.** Network I/O stays outside the Neo4j write transaction, so a slow model never holds a write lock.

**Log failures with `console.warn`, no user-facing error.** Fallback is silent to the user, visible in server logs.

## Risks / Trade-offs

- [Free model rate limits or retirement] → per-milestone fallback; `OPENROUTER_MODEL` swaps the model without a deploy of new code.
- [Path picking slower by up to 20 s] → timeout bound; the existing pending state on the path picker covers the wait.
- [Model text is wrong or off-topic] → text only, length-capped, rendered escaped; structure comes from the graph.
- [Profile data sent to a third party] → only questionnaire answers and role/skill names; no identifiers. Stated in the README.
- [Prompt injection] → inputs are seed data and validated questionnaire keys, not free text. Output cannot change structure.
