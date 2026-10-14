import { NextResponse } from "next/server"

import { DEMO_PASSWORD, SESSION_COOKIE, SESSION_MAX_AGE, SESSION_VALUE } from "@/lib/auth"

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null
  const password = typeof body?.password === "string" ? body.password.trim() : ""

  // Small delay so the UI can show its loading state and to blunt brute forcing.
  await new Promise((resolve) => setTimeout(resolve, 600))

  if (password !== DEMO_PASSWORD) {
    return NextResponse.json({ ok: false, error: "That password isn't right. It's shown just above the field." }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
  return response
}
