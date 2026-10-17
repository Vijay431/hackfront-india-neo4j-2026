import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowUpRight, Hammer, TriangleAlert } from "lucide-react";
import { MilestoneCheckbox } from "@/components/milestone-checkbox";
import { getMyRoadmap, nextStep } from "@/lib/career";
import { labelOf } from "@/lib/profile";
import { getUid } from "@/lib/session";

const TYPE_LABEL: Record<string, string> = {
  docs: "Docs",
  video: "Video search",
  course: "Course search",
  "hands-on": "Practice repos",
};

const fmtDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const hours = (n: number) => `${Math.round(n * 10) / 10} h`;

const MAIN = "mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6";

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex-1 rounded-md border bg-card p-4">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="tnum font-heading text-5xl leading-none font-bold">
        {value}%
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{ width: `${value}%`, background: tone }}
        />
      </div>
    </div>
  );
}

async function RoadmapView() {
  const uid = await getUid();
  const roadmap = await getMyRoadmap(uid);
  if (!roadmap) redirect(await nextStep(uid));

  return (
    <main className={MAIN}>
      <p className="text-sm font-medium text-muted-foreground">Your roadmap</p>
      <h1 className="mt-1 font-heading text-5xl leading-none font-bold sm:text-6xl">
        {roadmap.role.title}
      </h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Stat label="Readiness" value={roadmap.readiness} tone="var(--route)" />
        <Stat
          label="Completion"
          value={roadmap.completionPercentage}
          tone="var(--sent)"
        />
      </div>

      {roadmap.profile && (
        <dl
          className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 rounded-md border bg-card p-4 sm:grid-cols-5"
          aria-label="Your profile"
        >
          {(
            [
              ["Education", labelOf("education", roadmap.profile.education)],
              ["Skill level", labelOf("level", roadmap.profile.level)],
              ["Daily time", labelOf("dailyTime", roadmap.profile.dailyTime)],
              ["Goal", labelOf("goal", roadmap.profile.goal)],
              [
                "Timeline",
                labelOf("timelineMonths", roadmap.profile.timelineMonths),
              ],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {k}
              </dt>
              <dd className="mt-0.5 text-sm font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {roadmap.pace && (
        <section
          aria-label="Pace"
          className="mt-3 rounded-md border bg-card p-4"
        >
          {roadmap.pace.finishDate === null ? (
            <p className="font-medium">
              Route finished: no learning hours remaining.
            </p>
          ) : (
            <p>
              <span className="tnum font-heading text-3xl font-bold">
                {hours(roadmap.pace.remainingHours)}
              </span>{" "}
              left ·{" "}
              <span className="tnum font-semibold">
                {roadmap.pace.days} days
              </span>{" "}
              at your pace · finish by{" "}
              <span className="font-semibold">
                {fmtDate(roadmap.pace.finishDate)}
              </span>
            </p>
          )}
          {!roadmap.pace.fits && (
            <p
              role="status"
              className="mt-3 flex gap-2 rounded-md bg-secondary px-3 py-2 text-sm"
            >
              <TriangleAlert
                className="mt-0.5 size-4 shrink-0 text-route-ink"
                aria-hidden="true"
              />
              {roadmap.pace.targetPassed ? (
                <span>
                  Your target date ({fmtDate(roadmap.pace.targetDate)}) has
                  passed.
                </span>
              ) : (
                <span>
                  This plan finishes after your target date (
                  {fmtDate(roadmap.pace.targetDate)}). To finish on time you
                  need about {hours(roadmap.pace.neededHoursPerDay ?? 0)} per
                  day.
                </span>
              )}
            </p>
          )}
        </section>
      )}

      {roadmap.milestones.every((m) => m.isCompleted) && (
        <p className="mt-8 rounded-md border border-sent bg-card p-6 text-lg font-medium">
          Role-ready: you already cover every skill on this route.
        </p>
      )}
      <ol className="mt-10">
        {roadmap.milestones.map((m) => (
          <li
            key={m.id}
            data-done={m.isCompleted}
            className="route-step relative flex gap-4 pb-8"
          >
            <div className="relative z-10 shrink-0">
              <MilestoneCheckbox
                id={m.id}
                completed={m.isCompleted}
                label={m.skill.name}
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-heading text-3xl leading-tight font-semibold">
                  <span className="tnum mr-2 text-muted-foreground">
                    {m.orderIndex}
                  </span>
                  {m.skill.name}
                </h2>
                <span className="tnum text-sm text-muted-foreground">
                  {hours(m.estHours)}
                </span>
                {m.isPrerequisite && (
                  <span className="rounded-sm bg-prereq px-2 py-0.5 text-xs font-semibold tracking-wide text-card uppercase">
                    Prerequisite
                  </span>
                )}
              </div>
              <p className="mt-1 max-w-[62ch] text-[15px] text-muted-foreground">
                {m.description}
              </p>
              {m.resources.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {m.resources.map((r) => (
                    <li key={r.id}>
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md border bg-card px-2.5 py-1.5 text-sm font-medium hover:border-foreground"
                      >
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          {TYPE_LABEL[r.type] ?? r.type}
                        </span>
                        {r.title}
                        <ArrowUpRight
                          className="size-3.5 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {m.project && (
                <p className="mt-3 flex max-w-[62ch] gap-2 rounded-md bg-secondary px-3 py-2 text-sm">
                  <Hammer
                    className="mt-0.5 size-4 shrink-0 text-route-ink"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="font-semibold">{m.project.title}.</span>{" "}
                    {m.project.description}
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <Link
        href="/path"
        className="mt-4 inline-block text-sm font-medium text-route-ink underline underline-offset-4"
      >
        Change path
      </Link>
    </main>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense
      fallback={
        <main className={`${MAIN} text-muted-foreground`}>
          Loading roadmap…
        </main>
      }
    >
      <RoadmapView />
    </Suspense>
  );
}
