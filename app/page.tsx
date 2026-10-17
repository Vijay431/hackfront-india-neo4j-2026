import { Suspense } from "react";
import { redirect } from "next/navigation";
import { nextStep } from "@/lib/career";
import { getUid } from "@/lib/session";

async function Route() {
  const to = await nextStep(await getUid());
  redirect(to);
  return null;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <Route />
    </Suspense>
  );
}
