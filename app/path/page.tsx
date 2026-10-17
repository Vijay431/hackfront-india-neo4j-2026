import { Suspense } from "react";
import { connection } from "next/server";
import { listRoles } from "@/lib/career";
import { PathPicker } from "./path-picker";

async function Picker() {
  await connection();
  return <PathPicker roles={await listRoles()} />;
}

export default function PathPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14 sm:px-6">
      <h1 className="font-heading text-5xl leading-none font-bold sm:text-6xl">
        Where do you want to go?
      </h1>
      <p className="mt-3 max-w-[50ch] text-lg text-muted-foreground">
        Pick a path and we build a roadmap from what you told us. You can change
        it any time.
      </p>
      <Suspense
        fallback={<p className="mt-8 text-muted-foreground">Loading paths…</p>}
      >
        <Picker />
      </Suspense>
    </main>
  );
}
