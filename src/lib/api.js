import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Sends authenticated requests with a BetterAuth JWT.
 *
 * Usage:
 * apiFetch("/api/profile")
 * apiFetch("/api/profile", { method: "PATCH", body: ... })
 */
export async function apiFetch(path, options = {}) {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error(
      error?.message || "Unable to obtain authentication token. Please sign in again."
    );
  }

  const headers = new Headers(options.headers || {});

  headers.set("Authorization", `Bearer ${data.token}`);

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return response;
}
