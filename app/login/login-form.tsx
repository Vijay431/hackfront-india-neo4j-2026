"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions";
import { Button } from "@/components/ui/button";

const FIELD =
  "mt-1 h-11 w-full rounded-md border bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    { email: "", errors: {} },
  );
  const { errors } = state;
  return (
    <form
      action={action}
      noValidate
      className="space-y-4 rounded-md border bg-card p-5"
    >
      <div>
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className={FIELD}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          className={FIELD}
        />
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="mt-1 text-sm text-destructive"
          >
            {errors.password}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full text-base"
      >
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-sm text-muted-foreground">
        Demo sign-in: any email and any password work. The password is never
        checked or stored, so do not enter real credentials.
      </p>
    </form>
  );
}
