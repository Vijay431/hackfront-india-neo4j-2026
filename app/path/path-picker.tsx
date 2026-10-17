"use client";

import { useState, useTransition } from "react";
import { ArrowUp, Mic, Search } from "lucide-react";
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
      <div
        className="mt-8 flex items-center gap-2 rounded-full border bg-muted p-2 pl-4 opacity-60"
        aria-describedby="chat-soon"
      >
        <Search
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          disabled
          aria-label="Ask about careers"
          aria-describedby="chat-soon"
          placeholder="Ask about careers"
          className="h-10 min-w-0 flex-1 bg-transparent text-base placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
        <span className="shrink-0 rounded-full border bg-card px-2 py-0.5 text-xs font-medium">
          Coming soon
        </span>
        <button
          type="button"
          disabled
          aria-label="Voice input — coming soon"
          className="grid size-10 shrink-0 place-items-center rounded-full disabled:cursor-not-allowed"
        >
          <Mic className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          disabled
          aria-label="Send — coming soon"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary disabled:cursor-not-allowed"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </div>
      <p id="chat-soon" className="sr-only">
        Chat is coming soon. Pick a path below instead.
      </p>
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
