import { Suspense } from "react";
import { connection } from "next/server";
import Link from "next/link";
import { listRoles } from "@/lib/career";

async function RoleCards() {
  await connection();
  const roles = await listRoles();
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {roles.map((role) => (
          <Link
            key={role.id}
            href={`/assess/${role.id}`}
            className="rounded-xl border p-5 transition hover:border-foreground"
          >
            <h2 className="text-lg font-semibold">{role.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{role.description}</p>
          </Link>
        ))}
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold">CareerPath AI</h1>
      <p className="mt-2 text-muted-foreground">
        Pick a target role. We map your skill gaps through the skill graph and build a learning roadmap.
      </p>
      <Suspense fallback={<p className="mt-8 text-muted-foreground">Loading roles…</p>}>
        <RoleCards />
      </Suspense>
    </main>
  );
}
