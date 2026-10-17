# Tasks

## 1. Configuration

- [x] 1.1 Replace `GROQ_API_KEY=` in `.env.example` with `OPENROUTER_API_KEY=` and `OPENROUTER_MODEL=`; confirm the default free model id is still listed as free on openrouter.ai/models. Verify: `grep -n OPENROUTER .env.example` shows both lines and `grep -rn GROQ_API_KEY .env.example` is empty.
- [x] 1.2 Update `README.md` setup step for the two optional variables (feature off when the key is empty) and note which profile data is sent to OpenRouter; change the Phase 2 Groq line to OpenRouter. Verify: README states the variables, the fallback, and the data sent.

## 2. OpenRouter client

- [x] 2.1 Create `lib/llm.ts` exporting `milestoneDescriptions({ role, profile, skills })` that POSTs to OpenRouter chat completions with `fetch`, `AbortSignal.timeout(20_000)`, and the model from `OPENROUTER_MODEL` or the free default; it returns an empty map when the key is missing. Verify: `npx tsc --noEmit` and `npm run lint` pass.
- [x] 2.2 Build the prompt from role title and description, profile answer labels (via `labelOf`), and ordered skills tagged role skill or prerequisite; send no email, password, or user id. Verify: log the request body once in dev and confirm it holds only those fields.
- [x] 2.3 Parse the first `{...}` block of the reply and keep only entries whose key is a requested skill id and whose value is a trimmed non-empty string of at most 300 characters; on any error or non-2xx status, `console.warn` and return an empty map. Verify: in dev, a bad `OPENROUTER_MODEL` id logs a warning and returns an empty map without throwing.

## 3. Roadmap generation

- [x] 3.1 In `generateRoadmap()` (`lib/career.ts`), load the role and profile, call `milestoneDescriptions()` before `runWriteTx`, and set each description to the model text or the existing template text. Verify: `npx tsc --noEmit` and `npm run lint` pass.
- [x] 3.2 With a valid `OPENROUTER_API_KEY`, sign in, pick a role, and confirm the dashboard shows model-written descriptions while milestone order and completion match a run without the key. Verify: compare both dashboards for one role.
- [x] 3.3 With `OPENROUTER_API_KEY` empty, pick a role and confirm template descriptions appear and the dashboard loads. Verify: dashboard shows "Build proficiency in …" / "Prerequisite skill: …".
- [x] 3.4 With `OPENROUTER_MODEL` set to a nonexistent id, pick a role and confirm the template fallback, a server warning, and no error page. Verify: server log warning plus dashboard loads.

## Workflow follow-up

- Run `/opsx:verify`, then archive the change after review.
