"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { generateRoadmap, getRole, submitAssessment, toggleMilestone } from "@/lib/career";
import { getUid } from "@/lib/session";

export async function assessAction(roleId: string, formData: FormData) {
  const uid = await getUid();
  const role = await getRole(roleId);
  if (!role) throw new Error(`Unknown role: ${roleId}`);
  const scores = role.skills.map((s) => ({
    skillId: s.id,
    score: Number(formData.get(`score_${s.id}`) ?? 0),
  }));
  await submitAssessment(uid, roleId, scores);
  await generateRoadmap(uid, roleId);
  redirect("/roadmap");
}

export async function toggleMilestoneAction(milestoneId: string, completed: boolean) {
  await toggleMilestone(await getUid(), milestoneId, completed);
  revalidatePath("/roadmap");
}
