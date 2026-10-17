import { labelOf, QUESTIONS, type Profile } from "./profile";

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";
const TIMEOUT_MS = 60_000;
const MAX_LENGTH = 300;

export type MilestoneSkill = {
  id: string;
  name: string;
  isPrerequisite: boolean;
};

function profileLines(profile: Profile): string {
  return QUESTIONS.map((q) => {
    const value = profile[q.id];
    const labels = (Array.isArray(value) ? value : [value]).map((v) =>
      labelOf(q.id, v),
    );
    return `- ${q.title} ${labels.join(", ")}`;
  }).join("\n");
}

/**
 * Personalized one-line guidance per milestone, keyed by skill id.
 * Never throws: any failure returns an empty map so callers use their own text.
 */
export async function milestoneDescriptions({
  role,
  profile,
  skills,
}: {
  role: { title: string; description: string };
  profile: Profile | null;
  skills: MilestoneSkill[];
}): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  const key = process.env.OPENROUTER_API_KEY;
  if (!key || !profile || skills.length === 0) return out;

  const ids = new Set(skills.map((s) => s.id));
  const body = {
    model: process.env.OPENROUTER_MODEL || DEFAULT_MODEL,
    messages: [
      {
        role: "system",
        content: `You write learning-roadmap guidance. Reply with only a JSON object mapping each skill id to one plain-text sentence (max ${MAX_LENGTH} characters) saying why that skill matters for the target role and how this learner should approach it. Use exactly the given skill ids as keys.`,
      },
      {
        role: "user",
        content: `Target role: ${role.title}. ${role.description}\n\nLearner profile:\n${profileLines(profile)}\n\nMilestone skills in order:\n${skills
          .map(
            (s) =>
              `${s.id}: ${s.name} (${s.isPrerequisite ? "prerequisite" : "role skill"})`,
          )
          .join("\n")}`,
      },
    ],
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`OpenRouter responded ${res.status}`);
    const reply: string =
      (await res.json()).choices?.[0]?.message?.content ?? "";
    const json = reply.match(/\{[\s\S]*\}/)?.[0];
    if (!json) throw new Error("No JSON object in model reply");
    for (const [id, text] of Object.entries(JSON.parse(json))) {
      if (!ids.has(id) || typeof text !== "string") continue;
      const trimmed = text.trim();
      if (trimmed && trimmed.length <= MAX_LENGTH) out.set(id, trimmed);
    }
  } catch (err) {
    console.warn("Milestone descriptions unavailable:", err);
    return new Map();
  }
  return out;
}
