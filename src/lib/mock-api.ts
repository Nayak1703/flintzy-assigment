/**
 * A tiny mock backend that runs in the browser.
 *
 * - Seed data lives in `src/data/posts.json` with UTC timestamps relative to an
 *   `anchor`. On first load each day, the seed is rebased so the anchor maps to
 *   local midnight today. This keeps "Today / Tomorrow" meaningful no matter
 *   when the demo is opened.
 * - All reads and writes go through an artificial network delay.
 * - State is persisted to localStorage so created posts and retries survive a refresh.
 */
import seed from "@/data/posts.json"

import { PLATFORM_META } from "./platforms"
import { countCharacters, isValidHttpUrl } from "./text"
import type { NewPostInput, Post } from "./types"

const STORAGE_KEY = "cadence:db:v1"
const RETRY_FAILURE_RATE = 0.2

interface Db {
  /** Local calendar day (yyyy-mm-dd) the seed was rebased for */
  seededFor: string
  posts: Post[]
}

export class ApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApiError"
  }
}

export type Simulation = "error" | "empty" | null

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const jitter = (base: number, spread = 250) => base + Math.round(Math.random() * spread)

function localDayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function buildSeed(): Post[] {
  const anchor = Date.parse(seed.anchor)
  const midnight = new Date()
  midnight.setHours(0, 0, 0, 0)
  const shift = midnight.getTime() - anchor

  return (seed.posts as Post[]).map((post) => ({
    ...post,
    scheduledAt: new Date(Date.parse(post.scheduledAt) + shift).toISOString(),
  }))
}

/** Simulates the publishing worker: anything scheduled in the past is now published. */
function settle(posts: Post[]): Post[] {
  const now = Date.now()
  return posts.map((post) =>
    post.status === "scheduled" && Date.parse(post.scheduledAt) <= now
      ? { ...post, status: "published" }
      : post
  )
}

function readDb(): Db {
  const today = localDayKey()
  let db: Db | null = null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) db = JSON.parse(raw) as Db
  } catch {
    db = null
  }

  if (!db || db.seededFor !== today) {
    // Re-seed for today, but keep anything the user composed themselves.
    const userPosts = db?.posts.filter((p) => p.id.startsWith("usr_")) ?? []
    db = { seededFor: today, posts: [...buildSeed(), ...userPosts] }
  }

  db.posts = settle(db.posts)
  writeDb(db)
  return db
}

function writeDb(db: Db) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // Storage can be unavailable (private mode, quota); the session still works in memory.
  }
}

export async function fetchPosts(simulate: Simulation = null): Promise<Post[]> {
  await delay(jitter(650, 400))
  if (simulate === "error") {
    throw new ApiError("We couldn't reach the scheduling service. Check your connection and try again.")
  }
  if (simulate === "empty") return []
  return readDb().posts
}

export function validateNewPost(input: NewPostInput): string | null {
  if (!input.content.trim()) return "Write something before scheduling."
  if (input.platforms.length === 0) return "Pick at least one channel."
  for (const platform of input.platforms) {
    const { limit, label } = PLATFORM_META[platform]
    if (countCharacters(input.content) > limit) return `${label} allows up to ${limit.toLocaleString()} characters.`
  }
  if (input.mediaUrl && !isValidHttpUrl(input.mediaUrl)) return "The image URL must start with http:// or https://."
  const at = Date.parse(input.scheduledAt)
  if (Number.isNaN(at)) return "Pick a valid date and time."
  if (at <= Date.now()) return "The scheduled time must be in the future."
  return null
}

export async function createPost(input: NewPostInput): Promise<Post> {
  await delay(jitter(700))
  const problem = validateNewPost(input)
  if (problem) throw new ApiError(problem)

  const post: Post = {
    id: `usr_${crypto.randomUUID().slice(0, 8)}`,
    content: input.content.trim(),
    platforms: input.platforms,
    mediaUrl: input.mediaUrl || undefined,
    scheduledAt: new Date(input.scheduledAt).toISOString(),
    status: "scheduled",
  }
  const db = readDb()
  db.posts.push(post)
  writeDb(db)
  return post
}

/** Re-attempts publishing a failed post: ~1s latency, fails 20% of the time. */
export async function retryPost(id: string): Promise<Post> {
  await delay(1000)
  if (Math.random() < RETRY_FAILURE_RATE) {
    throw new ApiError("The platform timed out while publishing. Nothing was posted — please try again.")
  }
  const db = readDb()
  const index = db.posts.findIndex((p) => p.id === id)
  if (index === -1) throw new ApiError("This post no longer exists.")

  const updated: Post = { ...db.posts[index], status: "published", errorMessage: undefined }
  db.posts[index] = updated
  writeDb(db)
  return updated
}

export async function deletePost(id: string): Promise<void> {
  await delay(jitter(400))
  const db = readDb()
  db.posts = db.posts.filter((p) => p.id !== id)
  writeDb(db)
}

/** Restores the original demo dataset. */
export function resetDemoData() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
