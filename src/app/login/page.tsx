import type { Metadata } from "next"

import { BackgroundBeams } from "@/components/aceternity/background-beams"
import { LoginForm } from "@/components/auth/login-form"
import { Logo } from "@/components/brand/logo"
import { PlatformChip } from "@/components/brand/platform-icons"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { PLATFORMS } from "@/lib/types"

export const metadata: Metadata = { title: "Sign in" }

function safeNext(value: string | string[] | undefined) {
  const next = Array.isArray(value) ? value[0] : value
  // Only allow internal dashboard paths to avoid open redirects.
  return next && next.startsWith("/dashboard") ? next : "/dashboard"
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const next = safeNext(params.next)

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      <div className="relative flex flex-col px-6 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <LoginForm next={next} />
        </div>
        <p className="text-center text-xs text-muted-foreground lg:text-left">
          Frontend demo · no real accounts are connected and nothing is published.
        </p>
      </div>

      <aside className="relative hidden overflow-hidden border-l bg-[oklch(0.13_0.01_286)] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        <BackgroundBeams className="text-white" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-[28rem] rounded-full bg-brand/30 blur-[120px]" />
        <div className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-brand-2/20 blur-[100px]" />

        <div className="relative flex items-center gap-2">
          {PLATFORMS.map((p) => (
            <PlatformChip key={p} platform={p} size="lg" className="ring-1 ring-white/15" />
          ))}
        </div>

        <div className="relative max-w-lg">
          <p className="font-serif text-4xl leading-[1.15] tracking-tight italic xl:text-5xl">
            &ldquo;The calmest piece of software in our stack. We plan a whole month on Monday morning.&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-brand to-brand-2 text-sm font-semibold">
              PR
            </span>
            <div>
              <p className="text-sm font-medium">Priya Raman</p>
              <p className="text-sm text-white/60">Marketing Director, Tidewater</p>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
          {[
            ["4", "channels"],
            ["35", "demo posts"],
            ["0", "real posts sent"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
              <p className="mt-1 text-sm text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  )
}
