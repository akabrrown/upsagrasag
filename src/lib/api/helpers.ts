// lib/api/helpers.ts
import { supabase } from "../supabase/client";

/**
 * Verify that the current request is made by an admin user.
 * Returns the user object if admin, otherwise throws.
 */
export async function requireAdmin(): Promise<any> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthenticated");
  }
  // Assuming a custom claim "role" in app_metadata
  const role = (user as any).app_metadata?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized");
  }
  return user;
}
