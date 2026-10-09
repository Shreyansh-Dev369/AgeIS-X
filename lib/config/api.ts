/**
 * API Base URL Resolver for AgeIS-X.
 * 
 * In production on Vercel, reads from NEXT_PUBLIC_API_URL pointing to the Render backend service.
 * Defaults to http://127.0.0.1:8000 for local development.
 */
export function getApiBaseUrl(): string {
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "")
  }
  return "http://127.0.0.1:8000"
}
