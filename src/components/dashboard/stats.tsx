"use client"

import * as React from "react"
import Link from "next/link"
import { animate, motion, useMotionValue, useTransform } from "motion/react"
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, Timer } from "lucide-react"
import { formatDistanceStrict } from "date-fns"

import { PlatformStack } from "@/components/brand/platform-icons"
import { Skeleton } from "@/components/ui/skeleton"
import { formatTime } from "@/lib/date"
import type { Post } from "@/lib/types"
import { useNow } from "@/lib/use-now"
import { cn } from "@/lib/utils"

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(0)
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString())
  React.useEffect(() => {
    const controls = animate(mv, value, { duration: 0.9, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [mv, value])
  return <motion.span>{rounded}</motion.span>
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
  index,
  children,
}: {
  label: string
  value?: number
  icon: typeof Clock3
  tone: string
  href?: string
  index: number
  children?: React.ReactNode
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-muted-foreground">{label}</span>
        <span className={cn("flex size-7 items-center justify-center rounded-lg", tone)}>
          <Icon className="size-3.5" />
        </span>
      </div>
      {children ?? (
        <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
          <AnimatedNumber value={value ?? 0} />
        </p>
      )}
      {href && (
        <ArrowUpRight className="absolute right-3 bottom-3 size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
      )}
    </>
  )
  const className =
    "group relative block h-full overflow-hidden rounded-2xl border bg-card p-4 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {href ? (
        <Link href={href} className={className}>
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}
    </motion.div>
  )
}

export function StatsStrip({ posts, loading }: { posts: Post[]; loading: boolean }) {
  const now = useNow()

  const { scheduled, published, failed, next } = React.useMemo(() => {
    let scheduled = 0
    let published = 0
    let failed = 0
    let next: Post | null = null
    for (const p of posts) {
      if (p.status === "scheduled") {
        scheduled++
        if (Date.parse(p.scheduledAt) > now.getTime() && (!next || p.scheduledAt < next.scheduledAt)) next = p
      } else if (p.status === "published") published++
      else failed++
    }
    return { scheduled, published, failed, next }
  }, [posts, now])

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-2xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <StatCard label="Up next" icon={Timer} tone="bg-brand/10 text-brand" index={0}>
        {next ? (
          <div className="mt-3">
            <p className="text-xl font-semibold tracking-tight">
              in {formatDistanceStrict(new Date(next.scheduledAt), now)}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <PlatformStack platforms={next.platforms} size="sm" />
              <span className="tabular-nums">{formatTime(next.scheduledAt)}</span>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xl font-semibold tracking-tight text-muted-foreground">Nothing queued</p>
        )}
      </StatCard>
      <StatCard
        label="Scheduled"
        value={scheduled}
        icon={Clock3}
        tone="bg-scheduled/10 text-scheduled"
        href="/dashboard?status=scheduled"
        index={1}
      />
      <StatCard
        label="Published"
        value={published}
        icon={CheckCircle2}
        tone="bg-published/10 text-published"
        href="/dashboard?status=published"
        index={2}
      />
      <StatCard
        label="Needs attention"
        value={failed}
        icon={AlertTriangle}
        tone="bg-failed/10 text-failed"
        href="/dashboard?status=failed"
        index={3}
      />
    </div>
  )
}
