"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { AlertTriangle, Copy, ImageOff, MoreHorizontal, RefreshCcw, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { PlatformStack } from "@/components/brand/platform-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatFull, formatTime } from "@/lib/date"
import { PLATFORM_META } from "@/lib/platforms"
import type { Post } from "@/lib/types"
import { cn } from "@/lib/utils"

import { StatusBadge } from "./status-badge"

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded-[3px] bg-brand/20 px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  )
}

function Thumbnail({ src }: { src: string }) {
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading")
  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border bg-muted sm:size-20">
      {state !== "ready" && (
        <div className={cn("absolute inset-0 flex items-center justify-center", state === "loading" && "animate-pulse")}>
          {state === "error" && <ImageOff className="size-4 text-muted-foreground" />}
        </div>
      )}
      {state !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided URLs
        <img
          src={src}
          alt=""
          loading="lazy"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
          className={cn(
            "size-full object-cover transition-all duration-500",
            state === "ready" ? "scale-100 opacity-100" : "scale-105 opacity-0"
          )}
        />
      )}
    </div>
  )
}

export function PostCard({
  post,
  query,
  retrying,
  onRetry,
  onDelete,
}: {
  post: Post
  query: string
  retrying: boolean
  onRetry: (id: string) => void
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = React.useState(false)
  const isLong = post.content.length > 180
  const platformNames = post.platforms.map((p) => PLATFORM_META[p].label).join(" · ")

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.97, filter: "blur(4px)", transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 380, damping: 34 }}
      className="relative grid grid-cols-1 gap-2 sm:grid-cols-[84px_1fr] sm:gap-4"
    >
      {/* Timeline time column */}
      <div className="relative hidden sm:block">
        <Tooltip>
          <TooltipTrigger asChild>
            <time
              dateTime={post.scheduledAt}
              className="block pt-4 text-right text-[13px] font-medium tabular-nums"
            >
              {formatTime(post.scheduledAt)}
            </time>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{formatFull(post.scheduledAt)}</p>
            <p className="font-mono text-[10px] opacity-70">{post.scheduledAt} (UTC)</p>
          </TooltipContent>
        </Tooltip>
        <span
          className={cn(
            "absolute top-[22px] -right-[13px] z-10 size-2.5 rounded-full ring-4 ring-background",
            post.status === "scheduled" && "bg-scheduled",
            post.status === "published" && "bg-published",
            post.status === "failed" && "bg-failed"
          )}
        />
      </div>

      <article
        className={cn(
          "group relative rounded-2xl border bg-card p-4 shadow-xs transition-[border-color,box-shadow] duration-300 hover:border-foreground/15 hover:shadow-md",
          post.status === "failed" && "border-failed/30"
        )}
      >
        <header className="flex items-center gap-2.5">
          <PlatformStack platforms={post.platforms} />
          <span className="hidden truncate text-xs text-muted-foreground sm:inline">{platformNames}</span>
          <time
            dateTime={post.scheduledAt}
            className="text-xs font-medium whitespace-nowrap text-muted-foreground tabular-nums sm:hidden"
          >
            {formatTime(post.scheduledAt)}
          </time>
          <div className="ml-auto flex items-center gap-1">
            <StatusBadge status={post.status} pending={retrying} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Post actions"
                  className="text-muted-foreground opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:data-[state=open]:opacity-100 sm:focus-visible:opacity-100"
                >
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    void navigator.clipboard?.writeText(post.content)
                    toast("Copied post text")
                  }}
                >
                  <Copy /> Copy text
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onSelect={() => onDelete(post.id)} disabled={retrying}>
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="mt-3 flex gap-4">
          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-[15px] leading-relaxed break-words whitespace-pre-line text-foreground/90",
                !expanded && "line-clamp-3"
              )}
            >
              <Highlight text={post.content} query={query} />
            </p>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((e) => !e)}
                className="mt-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
          {post.mediaUrl && <Thumbnail src={post.mediaUrl} />}
        </div>

        <AnimatePresence initial={false}>
          {post.status === "failed" && post.errorMessage && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-failed/20 bg-failed/[0.07] p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-2.5">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-failed" />
                  <p className="text-[13px] leading-snug text-foreground/85">{post.errorMessage}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRetry(post.id)}
                  disabled={retrying}
                  className="shrink-0 rounded-lg bg-background"
                >
                  <RefreshCcw className={cn(retrying && "animate-spin")} />
                  Retry now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </article>
    </motion.li>
  )
}
