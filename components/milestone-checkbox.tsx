"use client";

import { useOptimistic, useTransition } from "react";
import { Check } from "lucide-react";
import { toggleMilestoneAction } from "@/app/actions";

export function MilestoneCheckbox({
  id,
  completed,
  label,
}: {
  id: string;
  completed: boolean;
  label: string;
}) {
  const [, startTransition] = useTransition();
  const [checked, setChecked] = useOptimistic(completed);
  return (
    <label className="relative inline-flex size-10 cursor-pointer items-center justify-center">
      <input
        type="checkbox"
        checked={checked}
        aria-label={`Mark "${label}" complete`}
        className="peer absolute inset-0 size-full cursor-pointer appearance-none rounded-full border-[3px] border-foreground bg-card transition-colors checked:border-sent checked:bg-sent hover:border-route"
        onChange={(e) => {
          const next = e.target.checked;
          startTransition(async () => {
            setChecked(next);
            await toggleMilestoneAction(id, next);
          });
        }}
      />
      <Check
        className="pointer-events-none relative size-5 text-card opacity-0 peer-checked:opacity-100"
        strokeWidth={3}
        aria-hidden="true"
      />
    </label>
  );
}
