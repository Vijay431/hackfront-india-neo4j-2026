"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ensureUser,
  generateRoadmap,
  getProfile,
  nextStep,
  submitProfile,
  toggleMilestone,
} from "@/lib/career";
import { QUESTIONS } from "@/lib/profile";
import { getUid, SESSION_COOKIE } from "@/lib/session";

export type LoginState = {
  email: string;
  errors: { email?: string; password?: string };
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const errors: LoginState["errors"] = {};
  if (!EMAIL.test(email)) errors.email = "Enter a valid email address.";
  if (!password) errors.password = "Enter a password.";
  if (errors.email || errors.password) return { email, errors };

  await ensureUser(email);
  (await cookies()).set(SESSION_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect(await nextStep(email));
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}

export async function submitProfileAction(formData: FormData) {
  const uid = await getUid();
  if (await getProfile(uid)) redirect(await nextStep(uid));
  const raw = Object.fromEntries(
    QUESTIONS.map((q) => [
      q.id,
      q.multi ? formData.getAll(q.id) : formData.get(q.id),
    ]),
  );
  await submitProfile(uid, raw);
  redirect("/path");
}

export async function pickPathAction(roleId: string) {
  await generateRoadmap(await getUid(), roleId);
  redirect("/roadmap");
}

export async function toggleMilestoneAction(
  milestoneId: string,
  completed: boolean,
) {
  await toggleMilestone(await getUid(), milestoneId, completed);
  revalidatePath("/roadmap");
}
