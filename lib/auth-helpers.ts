import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Retrieves the current session object.
 * This can be used in Server Components, Route Handlers, and Server Actions.
 */
export async function getSession() {
  return await auth();
}

/**
 * Retrieves the currently authenticated user from the session.
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

/**
 * Enforces authentication. If the user is not authenticated,
 * they will be redirected to the login page.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
