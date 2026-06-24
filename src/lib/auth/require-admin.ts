import { cookies } from "next/headers";
import { readSession, sessionCookie } from "./session";
export async function requireAdmin() {
  const session = await readSession(
    (await cookies()).get(sessionCookie)?.value,
  );
  if (!session || session.role !== "admin") throw new Error("UNAUTHORIZED");
  return session;
}
