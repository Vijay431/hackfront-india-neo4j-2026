import { Suspense } from "react";
import Link from "next/link";
import { MilestoneCheckbox } from "@/components/milestone-checkbox";
import { getMyRoadmap } from "@/lib/career";
import { getUid } from "@/lib/session";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex-1 rounded-xl border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-4xl font-bold">{value}%</div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-foreground" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

async function RoadmapView() {
  const roadmap = await getMyRoadmap(await getUid());

  if (!roadmap) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
        <h1 className="text-2xl font-bold">No roadmap yet</h1>
        <Link href="/" className="mt-4 inline-block underline">
          Pick a role
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-bold">{roadmap.role.title} roadmap</h1>
      <div className="mt-6 flex gap-4">
        <Stat label="Readiness" value={roadmap.readiness} />
        <Stat label="Completion" value={roadmap.completionPercentage} />
      </div>

      {roadmap.milestones.length === 0 ? (
        <p className="mt-8 rounded-xl border p-6 font-medium">Role-ready: no skill gaps found.</p>
      ) : (
        <ol className="mt-8 space-y-4">
          {roadmap.milestones.map((m) => (
            <li key={m.id} className="flex gap-4 rounded-xl border p-4">
              <MilestoneCheckbox id={m.id} completed={m.isCompleted} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {m.orderIndex}. {m.skill.name}
                  </span>
                  {m.isPrerequisite && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">prerequisite</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{m.description}</p>
                <ul className="mt-2 space-y-1 text-sm">
                  {m.resources.map((r) => (
                    <li key={r.id}>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline">
                        {r.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {m.project && (
                  <p className="mt-2 text-sm">
                    <span className="font-medium">Project:</span> {m.project.title} — {m.project.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      <Link href="/" className="mt-8 inline-block text-sm underline">
        Choose another role
      </Link>
    </main>
  );
}

export default function RoadmapPage() {
  return (
    <Suspense fallback={<main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12 text-muted-foreground">Loading roadmap…</main>}>
      <RoadmapView />
    </Suspense>
  );
}
