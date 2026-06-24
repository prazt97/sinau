export type SessionUser = { id: string; role: string; email: string };
const cookieName = "sinau_session";
const encoder = new TextEncoder();
async function signature(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.AUTH_SECRET ?? ""),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return Buffer.from(
    await crypto.subtle.sign("HMAC", key, encoder.encode(value)),
  ).toString("base64url");
}
export async function createSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${await signature(payload)}`;
}
export async function readSession(value?: string): Promise<SessionUser | null> {
  if (!value) return null;
  const [payload, received] = value.split(".");
  if (!payload || !received || received !== (await signature(payload)))
    return null;
  try {
    return JSON.parse(
      Buffer.from(payload, "base64url").toString(),
    ) as SessionUser;
  } catch {
    return null;
  }
}
export const sessionCookie = cookieName;
