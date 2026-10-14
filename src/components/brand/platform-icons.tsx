import type { SVGProps } from "react"

import { PLATFORM_META } from "@/lib/platforms"
import type { Platform } from "@/lib/types"
import { cn } from "@/lib/utils"

type IconProps = SVGProps<SVGSVGElement>

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21.95V14.5h2.5l.4-3h-2.9V9.6c0-.86.25-1.45 1.5-1.45h1.55V5.47a21 21 0 0 0-2.26-.12c-2.24 0-3.77 1.37-3.77 3.87v2.28H8v3h2.52v7.45a10 10 0 1 1 2.98 0Z" />
    </svg>
  )
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.17h1.7L7.4 4.73H5.58l11.09 14.44Z" />
    </svg>
  )
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.4-2.47V9.67a5.69 5.69 0 0 0-6.49 5.63 5.69 5.69 0 0 0 5.69 5.7 5.69 5.69 0 0 0 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.25-1.48Z" />
    </svg>
  )
}

export const PLATFORM_ICONS: Record<Platform, (props: IconProps) => React.ReactElement> = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  x: XIcon,
  tiktok: TikTokIcon,
}

/** A brand-colored rounded chip containing the platform glyph. */
export function PlatformChip({
  platform,
  size = "md",
  className,
}: {
  platform: Platform
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const Icon = PLATFORM_ICONS[platform]
  const meta = PLATFORM_META[platform]
  return (
    <span
      title={meta.label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        meta.chip,
        size === "sm" && "size-5 [&_svg]:size-2.5",
        size === "md" && "size-6 [&_svg]:size-3",
        size === "lg" && "size-9 [&_svg]:size-4.5",
        className
      )}
    >
      <Icon />
      <span className="sr-only">{meta.label}</span>
    </span>
  )
}

/** Overlapping stack of platform chips. */
export function PlatformStack({
  platforms,
  size = "md",
}: {
  platforms: Platform[]
  size?: "sm" | "md" | "lg"
}) {
  return (
    <span className="flex items-center -space-x-1.5">
      {platforms.map((p) => (
        <PlatformChip key={p} platform={p} size={size} className="ring-2 ring-card" />
      ))}
    </span>
  )
}
