/**
 * Demo-only access gate. The password is intentionally public — it is shown on
 * the landing and login pages so any reviewer can get in. This is NOT real auth.
 */
export const DEMO_PASSWORD = "cadence2026"

export const SESSION_COOKIE = "cadence_session"
export const SESSION_VALUE = "demo-access-granted"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
