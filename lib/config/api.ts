/**
 * API Base URL Resolver for AgeIS-X.
 * 
 * Priority:
 * 1. Explicit NEXT_PUBLIC_API_URL environment variable (trimmed, trailing slashes removed)
 * 2. Browser origin detection: If loaded on a production hostname (e.g. *.vercel.app, custom domain),
 *    defaults to the deployed Render backend: https://ageis-x-api.onrender.com
 * 3. Node environment: If process.env.NODE_ENV === "production", defaults to https://ageis-x-api.onrender.com
 * 4. Local development: Defaults to http://127.0.0.1:8000
 */

export const PRODUCTION_API_URL = "https://ageis-x-api.onrender.com"
export const LOCAL_DEV_API_URL = "http://127.0.0.1:8000"

export function getApiBaseUrl(): string {
  // 1. Explicitly configured environment variable
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    const configured = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, "")
    if (configured) {
      return configured
    }
  }

  // 2. Runtime browser-side detection
  if (typeof window !== "undefined" && window.location) {
    const host = window.location.hostname.toLowerCase()
    const isLocalhost =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      host.endsWith(".local")
    if (!isLocalhost) {
      return PRODUCTION_API_URL
    }
    return LOCAL_DEV_API_URL
  }

  // 3. Server-side build / prerender detection
  if (typeof process !== "undefined" && process.env?.NODE_ENV === "production") {
    return PRODUCTION_API_URL
  }

  // 4. Default fallback for local development
  return LOCAL_DEV_API_URL
}

/**
 * Cleanly constructs an absolute API URL for a given endpoint path.
 * Prevents double slashes and handles leading slashes automatically.
 */
export function buildApiUrl(endpointPath: string): string {
  const base = getApiBaseUrl()
  const cleanPath = endpointPath.startsWith("/") ? endpointPath : `/${endpointPath}`
  return `${base}${cleanPath}`
}

