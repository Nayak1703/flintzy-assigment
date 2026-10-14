"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, LayoutGroup, motion } from "motion/react"
import { format } from "date-fns"
import { History, PenSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { groupPostsByDay, localTimeZone, timeZoneAbbr } from "@/lib/date"
import { usePosts } from "@/lib/posts-store"
import { applyFilters, usePostFilters } from "@/lib/use-post-filters"
import { useNow } from "@/lib/use-now"

import { FiltersBar } from "./filters-bar"
import { PageHeader } from "./page-header"
import { PostCard } from "./post-card"
import { EmptyState, ErrorState, NoResults, QueueSkeleton } from "./queue-states"
import { StatsStrip } from "./stats"

function greeting(date: Date) {
  const h = date.getHours()
  if (h < 5) return "Burning the midnight oil"
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

export function QueueView() {
  const { posts, loadState, error, retrying, reload, retryPost, deletePost } = usePosts()
  const { filters, update, clear, activeCount } = usePostFilters()
  const now = useNow(60_000)
  const [tz, setTz] = React.useState<{ name: string; abbr: string } | null>(null)

  React.useEffect(() => {
    setTz({ name: localTimeZone(), abbr: timeZoneAbbr() })
  }, [])

  // Posts mid-retry stay visible even if their optimistic status no longer matches the filter,
  // so the user sees the "Publishing…" feedback and any rollback.
  const filtered = React.useMemo(() => {
    const matches = new Set(applyFilters(posts, filters).map((p) => p.id))
    return posts.filter((p) => matches.has(p.id) || retrying.includes(p.id))
  }, [posts, filters, retrying])
  const groups = React.useMemo(() => groupPostsByDay(filtered, now), [filtered, now])
  const firstPastIndex = groups.findIndex((g) => g.isPast)

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10">
      <PageHeader
        eyebrow={
          <span suppressHydrationWarning>
            {greeting(now)} · {format(now, "EEEE, MMMM d")}
          </span>
        }
        title={
          <>
            Your <span className="font-serif font-normal italic">queue</span>
          </>
        }
        description={
          tz ? (
            <>
              All times shown in <span className="font-medium text-foreground">{tz.name}</span> ({tz.abbr}). Stored in UTC.
            </>
          ) : (
            " "
          )
        }
        actions={
          <Button asChild className="hidden rounded-full sm:inline-flex">
            <Link href="/dashboard/compose">
              <PenSquare /> New post
            </Link>
          </Button>
        }
      />

      <div className="mt-8">
        <StatsStrip posts={posts} loading={loadState === "loading"} />
      </div>

      <div className="sticky top-14 z-20 -mx-4 mt-8 border-b border-transparent bg-background/80 px-4 py-3 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <FiltersBar
          filters={filters}
          onChange={update}
          onClear={clear}
          activeCount={activeCount}
          resultCount={filtered.length}
          totalCount={posts.length}
        />
      </div>

      <div className="mt-6">
        {loadState === "loading" && <QueueSkeleton />}
        {loadState === "error" && <ErrorState message={error ?? "Something went wrong."} onRetry={reload} />}
        {loadState === "ready" && posts.length === 0 && <EmptyState />}
        {loadState === "ready" && posts.length > 0 && filtered.length === 0 && <NoResults onClear={clear} />}

        {loadState === "ready" && filtered.length > 0 && (
          <LayoutGroup>
            <div className="space-y-10">
              <AnimatePresence initial={false} mode="popLayout">
                {groups.map((group, gi) => (
                  <motion.section
                    key={group.key}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    aria-labelledby={`day-${group.key}`}
                  >
                    {gi === firstPastIndex && (
                      <div className="mb-8 flex items-center gap-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                        <History className="size-3.5" />
                        Earlier
                        <span className="h-px flex-1 bg-border" />
                      </div>
                    )}
                    <div className="mb-4 flex items-baseline gap-2.5 sm:pl-[100px]">
                      <h2 id={`day-${group.key}`} className="text-lg font-semibold tracking-tight">
                        {group.label}
                      </h2>
                      <span className="text-sm text-muted-foreground">{group.sublabel}</span>
                      <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
                        {group.posts.length} {group.posts.length === 1 ? "post" : "posts"}
                      </span>
                    </div>
                    <ol className="relative space-y-3 sm:before:absolute sm:before:top-5 sm:before:bottom-5 sm:before:left-[91.5px] sm:before:w-px sm:before:bg-border">
                      <AnimatePresence initial={false} mode="popLayout">
                        {group.posts.map((post) => (
                          <PostCard
                            key={post.id}
                            post={post}
                            query={filters.query}
                            retrying={retrying.includes(post.id)}
                            onRetry={retryPost}
                            onDelete={deletePost}
                          />
                        ))}
                      </AnimatePresence>
                    </ol>
                  </motion.section>
                ))}
              </AnimatePresence>
            </div>
          </LayoutGroup>
        )}
      </div>
    </div>
  )
}
