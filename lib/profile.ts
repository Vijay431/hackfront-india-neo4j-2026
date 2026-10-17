/** Onboarding questionnaire, answer -> skill mapping, and pace maths. Pure: safe to import from client code. */

export type Option = {
  key: string;
  label: string;
  skills?: string[];
  hours?: number;
};
export type QuestionId =
  | "education"
  | "level"
  | "knownSkills"
  | "tools"
  | "experience"
  | "goal"
  | "timelineMonths"
  | "dailyTime"
  | "learningStyle";
export type Question = {
  id: QuestionId;
  title: string;
  multi: boolean;
  options: Option[];
};

export const NONE_KEY = "none";
const NONE: Option = { key: NONE_KEY, label: "None yet" };

export const QUESTIONS: Question[] = [
  {
    id: "education",
    title: "What is your education level?",
    multi: false,
    options: [
      { key: "year1", label: "1st Year" },
      { key: "year2", label: "2nd Year" },
      { key: "year3", label: "3rd Year" },
      { key: "year4", label: "4th Year" },
      { key: "graduate", label: "Graduate / Working Professional" },
    ],
  },
  {
    id: "level",
    title: "How would you rate your technical skill level?",
    multi: false,
    options: [
      { key: "beginner", label: "Beginner" },
      { key: "intermediate", label: "Intermediate" },
      { key: "advanced", label: "Advanced" },
    ],
  },
  {
    id: "knownSkills",
    title: "Which of these do you already know?",
    multi: true,
    options: [
      { key: "python", label: "Python", skills: ["python"] },
      { key: "java", label: "Java", skills: ["java"] },
      { key: "c-cpp", label: "C / C++", skills: ["c-cpp"] },
      {
        key: "web",
        label: "HTML / CSS / JavaScript",
        skills: ["html-css", "javascript"],
      },
      { key: "sql", label: "SQL / DBMS", skills: ["sql"] },
      {
        key: "dsa",
        label: "Data Structures and Algorithms (DSA)",
        skills: ["dsa"],
      },
      { key: "ml", label: "Machine Learning", skills: ["ml-fundamentals"] },
      { key: "git", label: "Git / GitHub", skills: ["git"] },
      NONE,
    ],
  },
  {
    id: "tools",
    title: "Which tools have you used?",
    multi: true,
    options: [
      { key: "linux", label: "Linux", skills: ["linux"] },
      { key: "docker", label: "Docker", skills: ["docker"] },
      {
        key: "cloud",
        label: "Cloud (AWS / GCP / Azure)",
        skills: ["cloud-basics"],
      },
      { key: "react", label: "React", skills: ["react"] },
      { key: "rest", label: "REST APIs", skills: ["rest-apis"] },
      { key: "cicd", label: "CI/CD", skills: ["cicd"] },
      NONE,
    ],
  },
  {
    id: "experience",
    title: "How much hands-on project experience do you have?",
    multi: false,
    options: [
      { key: "none", label: "None" },
      { key: "some", label: "1–2 projects" },
      { key: "many", label: "3+ projects" },
    ],
  },
  {
    id: "goal",
    title: "What is your primary goal?",
    multi: false,
    options: [
      { key: "internship", label: "Internship" },
      { key: "first-job", label: "First job" },
      { key: "switch", label: "Career switch" },
      { key: "upskill", label: "Upskill in current role" },
    ],
  },
  {
    id: "timelineMonths",
    title: "What is your target timeline?",
    multi: false,
    options: [
      { key: "3", label: "3 months" },
      { key: "6", label: "6 months" },
      { key: "12", label: "12 months" },
    ],
  },
  {
    id: "dailyTime",
    title: "How much time can you learn each day?",
    multi: false,
    options: [
      { key: "lt1", label: "Less than 1 hour", hours: 0.75 },
      { key: "1-2", label: "1–2 hours", hours: 1.5 },
      { key: "3-4", label: "3–4 hours", hours: 3.5 },
      { key: "4+", label: "More than 4 hours", hours: 5 },
    ],
  },
  {
    id: "learningStyle",
    title: "How do you like to learn?",
    multi: false,
    // Option keys are resource types, so ordering resources needs no lookup.
    options: [
      { key: "video", label: "Videos" },
      { key: "docs", label: "Docs / reading" },
      { key: "hands-on", label: "Hands-on projects" },
      { key: "course", label: "Courses" },
    ],
  },
];

export type Answers = {
  education: string;
  level: string;
  knownSkills: string[];
  tools: string[];
  experience: string;
  goal: string;
  timelineMonths: number;
  dailyTime: string;
  learningStyle: string;
};
export type Profile = Answers & { onboardedAt: string };

const question = (id: QuestionId) => QUESTIONS.find((q) => q.id === id)!;

export function labelOf(id: QuestionId, key: string | number): string {
  return (
    question(id).options.find((o) => o.key === String(key))?.label ??
    String(key)
  );
}

/** Validate untrusted input against the question set. */
export function parseAnswers(
  raw: Record<string, unknown>,
): { answers: Answers } | { error: string } {
  const out: Record<string, unknown> = {};
  for (const q of QUESTIONS) {
    const keys = new Set(q.options.map((o) => o.key));
    const value = raw[q.id];
    if (q.multi) {
      if (
        !Array.isArray(value) ||
        value.some((v) => typeof v !== "string" || !keys.has(v))
      ) {
        return { error: `Invalid answer for ${q.id}` };
      }
      const picked = [...new Set(value as string[])];
      if (picked.includes(NONE_KEY) && picked.length > 1)
        return { error: `"None yet" cannot be combined for ${q.id}` };
      out[q.id] = picked;
    } else {
      if (
        (typeof value !== "string" && typeof value !== "number") ||
        !keys.has(String(value))
      ) {
        return { error: `Invalid answer for ${q.id}` };
      }
      out[q.id] = q.id === "timelineMonths" ? Number(value) : String(value);
    }
  }
  return { answers: out as Answers };
}

export type PrereqInfo = { id: string; hasPrereq: boolean; prereqs: string[] };

export function mappedSkillIds(answers: Answers): string[] {
  const picks = [
    ...answers.knownSkills.map((key) =>
      question("knownSkills").options.find((o) => o.key === key),
    ),
    ...answers.tools.map((key) =>
      question("tools").options.find((o) => o.key === key),
    ),
  ];
  return [...new Set(picks.flatMap((o) => o?.skills ?? []))];
}

/** Proficiency scores implied by the known-skills and tools answers. */
export function deriveScores(
  answers: Answers,
  info: PrereqInfo[],
): { skillId: string; score: number }[] {
  const byId = new Map(info.map((i) => [i.id, i]));
  const mapped = mappedSkillIds(answers);
  const scores = new Map<string, number>();
  for (const id of mapped) {
    const hasPrereq = byId.get(id)?.hasPrereq ?? false;
    scores.set(
      id,
      answers.level === "advanced"
        ? 4
        : answers.level === "intermediate"
          ? 3
          : hasPrereq
            ? 2
            : 3,
    );
  }
  if (answers.experience === "many") {
    for (const [id, score] of [...scores]) {
      if (score < 3) continue;
      for (const p of byId.get(id)?.prereqs ?? [])
        scores.set(p, Math.max(scores.get(p) ?? 0, 3));
    }
  }
  return [...scores].map(([skillId, score]) => ({ skillId, score }));
}

export type Pace = {
  remainingHours: number;
  days: number;
  finishDate: string | null;
  targetDate: string;
  fits: boolean;
  neededHoursPerDay: number | null;
  targetPassed: boolean;
};

const DAY_MS = 86_400_000;
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export function pace(
  milestones: { isCompleted: boolean; estHours: number }[],
  profile: Profile,
  today: Date,
): Pace {
  const remainingHours = milestones
    .filter((m) => !m.isCompleted)
    .reduce((sum, m) => sum + m.estHours, 0);
  const perDay =
    question("dailyTime").options.find((o) => o.key === profile.dailyTime)
      ?.hours ?? 1.5;
  const days = Math.ceil(remainingHours / perDay);
  const finish = new Date(today.getTime() + days * DAY_MS);
  const target = new Date(profile.onboardedAt);
  target.setUTCMonth(target.getUTCMonth() + profile.timelineMonths);
  const daysToTarget = Math.ceil((target.getTime() - today.getTime()) / DAY_MS);
  return {
    remainingHours,
    days,
    finishDate: remainingHours === 0 ? null : isoDate(finish),
    targetDate: isoDate(target),
    fits: remainingHours === 0 || finish.getTime() <= target.getTime(),
    neededHoursPerDay: daysToTarget > 0 ? remainingHours / daysToTarget : null,
    targetPassed: daysToTarget <= 0,
  };
}
