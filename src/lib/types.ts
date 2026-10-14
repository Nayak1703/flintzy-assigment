export const PLATFORMS = ["facebook", "instagram", "x", "tiktok"] as const
export type Platform = (typeof PLATFORMS)[number]

export const STATUSES = ["scheduled", "published", "failed"] as const
export type PostStatus = (typeof STATUSES)[number]

export interface Post {
  id: string
  content: string
  platforms: Platform[]
  mediaUrl?: string
  /** ISO-8601 timestamp in UTC, e.g. 2026-10-14T09:30:00.000Z */
  scheduledAt: string
  status: PostStatus
  /** Present only when status === "failed" */
  errorMessage?: string
}

export interface NewPostInput {
  content: string
  platforms: Platform[]
  mediaUrl?: string
  scheduledAt: string
}

export function isPlatform(value: string): value is Platform {
  return (PLATFORMS as readonly string[]).includes(value)
}

export function isStatus(value: string): value is PostStatus {
  return (STATUSES as readonly string[]).includes(value)
}
