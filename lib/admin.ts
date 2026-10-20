import { env } from "cloudflare:workers";
import { notFound } from "next/navigation";
import { getChatGPTUser, requireChatGPTUser } from "@/app/chatgpt-auth";

function adminEmails() {
  const value = (env as unknown as Record<string, string | undefined>).ADMIN_EMAILS ?? "";
  return new Set(value.split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

export function isAdminEmail(email: string) {
  return adminEmails().has(email.toLowerCase());
}

export async function requireAdmin(returnTo = "/admin") {
  const user = await requireChatGPTUser(returnTo);
  if (!isAdminEmail(user.email)) notFound();
  return user;
}

export async function authorizeAdminRequest() {
  const user = await getChatGPTUser();
  return user && isAdminEmail(user.email) ? user : null;
}
