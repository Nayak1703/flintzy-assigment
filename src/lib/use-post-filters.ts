"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { isPlatform, isStatus, type Platform, type Post, type PostStatus } from "./types"

export interface PostFilters {
  platforms: Platform[]
  statuses: PostStatus[]
  query: string
}

function parseList<T extends string>(value: string | null, guard: (v: string) => v is T): T[] {
  if (!value) return []
  return [...new Set(value.split(",").filter(guard))]
}

/**
 * Filters live in the URL (?platform=x,instagram&status=failed&q=launch)
 * so they survive refreshes and can be shared as links.
 */
export function usePostFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = React.useMemo<PostFilters>(
    () => ({
      platforms: parseList(searchParams.get("platform"), isPlatform),
      statuses: parseList(searchParams.get("status"), isStatus),
      query: searchParams.get("q") ?? "",
    }),
    [searchParams]
  )

  const update = React.useCallback(
    (next: Partial<PostFilters>) => {
      const params = new URLSearchParams(searchParams.toString())
      const set = (key: string, value: string) => (value ? params.set(key, value) : params.delete(key))

      if (next.platforms) set("platform", next.platforms.join(","))
      if (next.statuses) set("status", next.statuses.join(","))
      if (next.query !== undefined) set("q", next.query.trim() ? next.query : "")

      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const clear = React.useCallback(() => update({ platforms: [], statuses: [], query: "" }), [update])

  const activeCount = filters.platforms.length + filters.statuses.length + (filters.query.trim() ? 1 : 0)

  return { filters, update, clear, activeCount }
}

export function applyFilters(posts: Post[], { platforms, statuses, query }: PostFilters) {
  const q = query.trim().toLowerCase()
  return posts.filter(
    (post) =>
      (platforms.length === 0 || post.platforms.some((p) => platforms.includes(p))) &&
      (statuses.length === 0 || statuses.includes(post.status)) &&
      (!q || post.content.toLowerCase().includes(q))
  )
}
