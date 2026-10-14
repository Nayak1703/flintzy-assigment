import type { Platform } from "./types"

export interface PlatformMeta {
  id: Platform
  label: string
  /** Account handle shown in previews (mock) */
  handle: string
  limit: number
  /** Tailwind classes for the icon chip */
  chip: string
}

export const PLATFORM_META: Record<Platform, PlatformMeta> = {
  facebook: {
    id: "facebook",
    label: "Facebook",
    handle: "Halcyon Outdoor",
    limit: 5000,
    chip: "bg-[#1877F2] text-white",
  },
  instagram: {
    id: "instagram",
    label: "Instagram",
    handle: "@halcyon.outdoor",
    limit: 2200,
    chip: "bg-[radial-gradient(circle_at_30%_110%,#FFD776_0%,#F77737_25%,#E1306C_50%,#C13584_70%,#833AB4_100%)] text-white",
  },
  x: {
    id: "x",
    label: "X",
    handle: "@halcyonoutdoor",
    limit: 280,
    chip: "bg-black text-white ring-1 ring-white/15",
  },
  tiktok: {
    id: "tiktok",
    label: "TikTok",
    handle: "@halcyon",
    limit: 2200,
    chip: "bg-black text-white ring-1 ring-white/15",
  },
}

export const PLATFORM_LIST = Object.values(PLATFORM_META)
