# Proposal

## Why

When a user picks a role, every milestone gets the same template text ("Build proficiency in X" or "Prerequisite skill: X"). That text ignores the role, the user's profile, and why the skill matters. A free open-source model on OpenRouter can explain each step for this user and this role. The Neo4j graph stays the source of truth for which skills appear and in what order.

## What Changes

- When a roadmap is generated, one server-side call to a free open-source model on OpenRouter writes a short personalized description for each milestone. Input: the target role, the user's profile, and the ordered milestone skills.
- The model only writes description text. It does not add, remove, or reorder skills, change completion state, or touch readiness or pace.
- If the API key is missing, the call fails or times out, or the response is invalid, generation falls back to the current template text. Picking a path never fails because of the model.
- New server-only environment variables: `OPENROUTER_API_KEY` (required to enable the feature) and `OPENROUTER_MODEL` (optional; defaults to a free model). The unused `GROQ_API_KEY` entry in `.env.example` is replaced.
- No new npm dependency. The OpenRouter chat completions endpoint is OpenAI-compatible and is called with `fetch`.

Out of scope: LLM-chosen skills or roles, chat, streaming, resume parsing, caching or regenerating descriptions without regenerating the roadmap, and model choice in the UI.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `learning-roadmap`: adds requirements for AI-written milestone descriptions and the fallback to template text when the model is unavailable.

## Impact

- `lib/career.ts`: `generateRoadmap()` asks for descriptions before its write transaction.
- New `lib/llm.ts`: OpenRouter client, prompt, and response validation.
- `.env.example`, `README.md`: document the new variables.
- Latency: picking a path waits for one model call, bounded by a timeout.
- Privacy: profile answers (education, level, skills, tools, experience, goal, timeline, daily time, learning styles) are sent to OpenRouter and the chosen model provider. No email, user id, or password is sent.
