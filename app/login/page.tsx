import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ChainDiagram } from "@/components/chain-diagram";
import { nextStep } from "@/lib/career";
import { getOptionalUid } from "@/lib/session";
import { LoginForm } from "./login-form";

async function SignedInRedirect() {
  const uid = await getOptionalUid();
  if (uid) redirect(await nextStep(uid));
  return null;
}

export default function LoginPage() {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_22rem] lg:gap-14 lg:py-14">
      <Suspense fallback={null}>
        <SignedInRedirect />
      </Suspense>
      <section aria-labelledby="intro" className="order-2 lg:order-1">
        <h1
          id="intro"
          className="font-heading text-5xl leading-[0.95] font-bold sm:text-6xl"
        >
          Pick the route you want to climb.
        </h1>
        <p className="mt-4 max-w-[44ch] text-lg text-muted-foreground">
          Tell us about yourself once. We follow the skill graph to find every
          gap, including the prerequisites behind them, and order your roadmap
          so each step unlocks the next.
        </p>
        <div className="mt-8">
          <ChainDiagram />
        </div>
      </section>
      <section aria-labelledby="signin" className="order-1 lg:order-2">
        <h2
          id="signin"
          className="mb-3 font-heading text-lg font-semibold tracking-wide text-muted-foreground uppercase"
        >
          Sign in
        </h2>
        <LoginForm />
      </section>
    </main>
  );
}
