import { cookies } from "next/headers";

/** Anonymous user id set by proxy.ts. */
export async function getUid(): Promise<string> {
  const uid = (await cookies()).get("cp_uid")?.value;
  if (!uid) throw new Error("No user session");
  return uid;
}
