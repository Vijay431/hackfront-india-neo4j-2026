import { cookies } from "next/headers";
import { connection } from "next/server";

export const SESSION_COOKIE = "cp_user";

/** Signed-in user id (the lower-cased email set by loginAction), or null. */
export async function getOptionalUid(): Promise<string | null> {
  // Everything after this reads the database or the clock, so it must run at request time.
  await connection();
  return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function getUid(): Promise<string> {
  const uid = await getOptionalUid();
  if (!uid) throw new Error("No user session");
  return uid;
}
