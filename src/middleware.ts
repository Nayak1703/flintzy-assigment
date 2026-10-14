import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE, SESSION_VALUE } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const authed = request.cookies.get(SESSION_COOKIE)?.value === SESSION_VALUE

  if (pathname.startsWith("/dashboard") && !authed) {
    const url = new URL("/login", request.url)
    url.searchParams.set("next", pathname + search)
    return NextResponse.redirect(url)
  }

  if (pathname === "/login" && authed) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
