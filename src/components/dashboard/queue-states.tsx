"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { PenSquare, RotateCw, SearchX, WifiOff } from "lucide-react"

import { PlatformChip } from "@/components/brand/platform-icons"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export function QueueSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading posts">
      {[3, 2].map((rows, g) => (
        <div key={g}>
          <Skeleton className="mb-4 h-6 w-40 rounded-md" />
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="grid grid-cols-1 gap-4 sm:grid-cols-[84px_1fr]">
                <Skeleton className="mt-4 hidden h-4 w-14 justify-self-end sm:block" />
                <div className="rounded-2xl border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="ml-auto h-6 w-20 rounded-full" />
                  </div>
                  <div className="mt-4 flex gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3.5 w-11/12" />
                      <Skeleton className="h-3.5 w-2/3" />
                    </div>
                    {i % 2 === 0 && <Skeleton className="size-16 rounded-xl sm:size-20" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function StateFrame({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col items-center overflow-hidden rounded-3xl border border-dashed bg-card/50 px-6 py-16 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 mask-radial" />
      <div className="relative">{icon}</div>
      <h3 className="relative mt-6 text-lg font-semibold tracking-tight">{title}</h3>
      <p className="relative mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      {action && <div className="relative mt-6">{action}</div>}
    </motion.div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <StateFrame
      icon={
        <span className="flex size-14 items-center justify-center rounded-2xl border border-failed/25 bg-failed/10 text-failed">
          <WifiOff className="size-6" />
        </span>
      }
      title="We couldn't load your queue"
      description={message}
      action={
        <Button onClick={onRetry} className="rounded-full">
          <RotateCw /> Try again
        </Button>
      }
    />
  )
}

export function EmptyState() {
  return (
    <StateFrame
      icon={
        <div className="relative h-20 w-28">
          {(["instagram", "x", "tiktok"] as const).map((p, i) => (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 10, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate: (i - 1) * 9 }}
              transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200, damping: 18 }}
              className="absolute inset-x-3 top-2 flex h-16 items-start gap-2 rounded-xl border bg-card p-2.5 shadow-sm"
              style={{ zIndex: i === 1 ? 2 : 1 }}
            >
              <PlatformChip platform={p} size="sm" />
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-1.5 w-full rounded-full bg-muted" />
                <div className="h-1.5 w-2/3 rounded-full bg-muted" />
              </div>
            </motion.div>
          ))}
        </div>
      }
      title="Your queue is wide open"
      description="Nothing is scheduled yet. Write your first post and pick when it should go out — we'll keep it here."
      action={
        <Button asChild className="rounded-full">
          <Link href="/dashboard/compose">
            <PenSquare /> Compose a post
          </Link>
        </Button>
      }
    />
  )
}

export function NoResults({ onClear }: { onClear: () => void }) {
  return (
    <StateFrame
      icon={
        <span className="flex size-14 items-center justify-center rounded-2xl border bg-background text-muted-foreground">
          <SearchX className="size-6" />
        </span>
      }
      title="No posts match these filters"
      description="Try a different search term, or widen the platforms and statuses you're looking at."
      action={
        <Button variant="outline" onClick={onClear} className="rounded-full">
          Clear all filters
        </Button>
      }
    />
  )
}
