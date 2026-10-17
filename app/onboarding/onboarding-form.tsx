"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitProfileAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { NONE_KEY, QUESTIONS } from "@/lib/profile";

type Picks = Record<string, string[]>;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="h-11 px-6 text-base">
      {pending ? "Saving…" : "Finish"}
    </Button>
  );
}

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Picks>({});
  const [error, setError] = useState<string | null>(null);

  const q = QUESTIONS[step];
  const last = step === QUESTIONS.length - 1;
  const current = picks[q.id] ?? [];

  function toggle(key: string) {
    setError(null);
    setPicks((p) => {
      const cur = p[q.id] ?? [];
      if (!q.multi) return { ...p, [q.id]: [key] };
      if (key === NONE_KEY)
        return { ...p, [q.id]: cur.includes(key) ? [] : [key] };
      const next = cur.filter((k) => k !== NONE_KEY);
      return {
        ...p,
        [q.id]: next.includes(key)
          ? next.filter((k) => k !== key)
          : [...next, key],
      };
    });
  }

  function next() {
    if (!q.multi && current.length === 0) {
      setError("Choose an answer to continue.");
      return;
    }
    setStep(step + 1);
  }

  return (
    <form action={submitProfileAction} className="mt-6">
      {QUESTIONS.filter((o) => o.id !== q.id).flatMap((o) =>
        (picks[o.id] ?? []).map((k) => (
          <input key={`${o.id}-${k}`} type="hidden" name={o.id} value={k} />
        )),
      )}
      <p
        className="tnum text-sm font-medium text-muted-foreground"
        aria-live="polite"
      >
        Question {step + 1} of {QUESTIONS.length}
      </p>
      <div
        className="mt-2 h-2 overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label="Onboarding progress"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={QUESTIONS.length}
      >
        <div
          className="h-full rounded-full bg-route"
          style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
        />
      </div>

      <fieldset key={q.id} className="mt-6 min-w-0">
        <legend className="font-heading text-4xl leading-tight font-semibold sm:text-5xl">
          {q.title}
        </legend>
        {q.multi && (
          <p className="mt-1 text-sm text-muted-foreground">
            Select all that apply.
          </p>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {q.options.map((o) => (
            <label key={o.key} className="relative block cursor-pointer">
              <input
                type={q.multi ? "checkbox" : "radio"}
                name={q.id}
                value={o.key}
                checked={current.includes(o.key)}
                onChange={() => toggle(o.key)}
                className="peer sr-only"
              />
              <span className="flex min-h-14 items-center rounded-md border-2 bg-card px-4 py-3 text-lg font-medium transition-colors peer-checked:border-route peer-checked:bg-secondary peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50 hover:border-foreground">
                {o.label}
              </span>
            </label>
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </fieldset>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0}
          onClick={() => {
            setError(null);
            setStep(step - 1);
          }}
          className="h-11 px-5 text-base"
        >
          Back
        </Button>
        {last ? (
          <Submit />
        ) : (
          <Button type="button" onClick={next} className="h-11 px-6 text-base">
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
