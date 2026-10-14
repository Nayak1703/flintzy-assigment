import Link from "next/link"

import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-[10px] bg-foreground text-background shadow-[0_0_0_1px_color-mix(in_oklch,var(--foreground)_10%,transparent)]",
        className
      )}
    >
      <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
        <defs>
          <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--brand)" />
            <stop offset="1" stopColor="var(--brand-2)" />
          </linearGradient>
        </defs>
        {/* three rising bars = cadence / rhythm */}
        <rect x="5" y="15" width="5" height="12" rx="2.5" fill="currentColor" opacity="0.55" />
        <rect x="13.5" y="9" width="5" height="18" rx="2.5" fill="currentColor" opacity="0.8" />
        <rect x="22" y="4" width="5" height="23" rx="2.5" fill="url(#logo-g)" />
      </svg>
    </span>
  )
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-2.5", className)}>
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105" />
      <span className="text-[17px] font-semibold tracking-tight">Cadence</span>
    </Link>
  )
}
