import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { assessAction } from "@/app/actions";
import { SkillSlider } from "@/components/skill-slider";
import { Button } from "@/components/ui/button";
import { getRole } from "@/lib/career";

async function AssessForm({ params }: { params: PageProps<"/assess/[roleId]">["params"] }) {
  await connection();
  const { roleId } = await params;
  const role = await getRole(roleId);
  if (!role) notFound();

  return (
    <>
      <h1 className="text-2xl font-bold">{role.title}</h1>
      <p className="mt-1 text-muted-foreground">Rate your current level in each skill, 0 (none) to 5 (expert).</p>
      <form action={assessAction.bind(null, role.id)} className="mt-6 space-y-3">
        {role.skills.map((s) => (
          <SkillSlider key={s.id} id={s.id} name={s.name} category={s.category} />
        ))}
        <Button type="submit" size="lg" className="mt-4">
          Build my roadmap
        </Button>
      </form>
    </>
  );
}

export default function AssessPage({ params }: PageProps<"/assess/[roleId]">) {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <AssessForm params={params} />
      </Suspense>
    </main>
  );
}
