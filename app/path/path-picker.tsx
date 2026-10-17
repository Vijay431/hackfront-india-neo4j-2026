"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { pickPathAction } from "@/app/actions";

export function PathPicker({
  roles,
}: {
  roles: { id: string; title: string }[];
}) {
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  return (
    <>
      <div className="relative mt-8">
        <Lock
          className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          disabled
          aria-label="Ask about careers"
          aria-describedby="chat-soon"
          placeholder="Ask about careers — coming soon"
          className="h-14 w-full rounded-full border bg-card pr-4 pl-11 text-base placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <p id="chat-soon" className="sr-only">
          Chat is coming soon. Pick a path below instead.
        </p>
      </div>
      <ul className="mt-5 flex flex-wrap gap-3" aria-label="Career paths">
        {roles.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              disabled={pending}
              aria-busy={busyId === r.id}
              onClick={() => {
                setBusyId(r.id);
                startTransition(() => pickPathAction(r.id));
              }}
              className="min-h-11 rounded-full border-2 bg-card px-5 py-2 text-base font-medium transition-colors hover:border-foreground focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-wait disabled:opacity-50 aria-busy:border-route aria-busy:opacity-100"
            >
              {busyId === r.id ? `Building ${r.title}…` : r.title}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
