"use client";

import { useOptimistic, useTransition } from "react";
import { toggleMilestoneAction } from "@/app/actions";

export function MilestoneCheckbox({ id, completed }: { id: string; completed: boolean }) {
  const [, startTransition] = useTransition();
  const [checked, setChecked] = useOptimistic(completed);
  return (
    <input
      type="checkbox"
      checked={checked}
      aria-label="Mark milestone complete"
      className="mt-1 size-5"
      onChange={(e) => {
        const next = e.target.checked;
        startTransition(async () => {
          setChecked(next);
          await toggleMilestoneAction(id, next);
        });
      }}
    />
  );
}
