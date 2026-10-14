"use client"

import { AnimatePresence, motion } from "motion/react"
import { Loader2 } from "lucide-react"

import type { PostStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const STYLES: Record<PostStatus, { label: string; className: string; dot: string }> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-scheduled/10 text-scheduled ring-scheduled/25",
    dot: "bg-scheduled",
  },
  published: {
    label: "Published",
    className: "bg-published/10 text-published ring-published/25",
    dot: "bg-published",
  },
  failed: {
    label: "Failed",
    className: "bg-failed/10 text-failed ring-failed/25",
    dot: "bg-failed",
  },
}

export const STATUS_LABEL: Record<PostStatus, string> = {
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
}

export function StatusDot({ status, className }: { status: PostStatus; className?: string }) {
  return <span className={cn("inline-block size-1.5 rounded-full", STYLES[status].dot, className)} />
}

export function StatusBadge({
  status,
  pending = false,
  className,
}: {
  status: PostStatus
  pending?: boolean
  className?: string
}) {
  const style = STYLES[status]
  return (
    <motion.span
      layout
      className={cn(
        "inline-flex h-6 items-center gap-1.5 overflow-hidden rounded-full px-2.5 text-xs font-medium ring-1 ring-inset transition-colors duration-300",
        style.className,
        className
      )}
    >
      {pending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : (
        <span className={cn("relative flex size-1.5")}>
          {status === "scheduled" && (
            <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-60", style.dot)} />
          )}
          <span className={cn("relative inline-flex size-1.5 rounded-full", style.dot)} />
        </span>
      )}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={pending ? "pending" : status}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          {pending ? "Publishing…" : style.label}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}
