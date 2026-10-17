import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getProfile, nextStep } from "@/lib/career";
import { getUid } from "@/lib/session";
import { OnboardingForm } from "./onboarding-form";

async function Guard() {
  const uid = await getUid();
  if (await getProfile(uid)) redirect(await nextStep(uid));
  return <OnboardingForm />;
}

export default function OnboardingPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-sm font-medium text-muted-foreground">Welcome</p>
      <h1 className="mt-1 font-heading text-5xl leading-none font-bold sm:text-6xl">
        Tell us about you
      </h1>
      <Suspense
        fallback={<p className="mt-6 text-muted-foreground">Loading…</p>}
      >
        <Guard />
      </Suspense>
    </main>
  );
}
