"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { format } from "date-fns"
import { Bookmark, Heart, MessageCircle, Music2, Repeat2, Send, Share, ThumbsUp } from "lucide-react"

import { PLATFORM_ICONS } from "@/components/brand/platform-icons"
import { LogoMark } from "@/components/brand/logo"
import { PLATFORM_META } from "@/lib/platforms"
import { splitAtLimit } from "@/lib/text"
import type { Platform } from "@/lib/types"
import { cn } from "@/lib/utils"

function Body({ text, limit, className }: { text: string; limit: number; className?: string }) {
  const [ok, overflow] = splitAtLimit(text, limit)
  return (
    <p className={cn("break-words whitespace-pre-wrap", className)}>
      {text ? (
        <>
          {ok}
          {overflow && <mark className="rounded-sm bg-failed/25 text-inherit">{overflow}</mark>}
        </>
      ) : (
        <span className="text-muted-foreground/70 italic">Your post will appear here…</span>
      )}
    </p>
  )
}

function Avatar({ size = "size-9" }: { size?: string }) {
  return <LogoMark className={cn(size, "rounded-full")} />
}

function Media({ src, aspect }: { src?: string; aspect: string }) {
  if (!src) return null
  return (
    <div className={cn("relative overflow-hidden bg-muted", aspect)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided URLs */}
      <img src={src} alt="" className="absolute inset-0 size-full object-cover" />
    </div>
  )
}

interface PreviewProps {
  text: string
  mediaUrl?: string
  when: Date | null
}

function XPreview({ text, mediaUrl }: PreviewProps) {
  const meta = PLATFORM_META.x
  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Avatar />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-sm">
            <span className="font-semibold">Halcyon Outdoor</span>
            <span className="text-muted-foreground">{meta.handle} · now</span>
          </div>
          <Body text={text} limit={meta.limit} className="mt-1 text-[15px] leading-snug" />
          {mediaUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border">
              <Media src={mediaUrl} aspect="aspect-[16/10]" />
            </div>
          )}
          <div className="mt-3 flex max-w-xs justify-between text-muted-foreground">
            <MessageCircle className="size-4" />
            <Repeat2 className="size-4" />
            <Heart className="size-4" />
            <Share className="size-4" />
          </div>
        </div>
      </div>
    </div>
  )
}

function InstagramPreview({ text, mediaUrl }: PreviewProps) {
  const meta = PLATFORM_META.instagram
  return (
    <div>
      <div className="flex items-center gap-2.5 p-3">
        <span className="rounded-full bg-[conic-gradient(#FFD776,#F77737,#E1306C,#C13584,#833AB4,#FFD776)] p-[2px]">
          <span className="block rounded-full bg-card p-[2px]">
            <Avatar size="size-7" />
          </span>
        </span>
        <span className="text-sm font-semibold">{meta.handle.slice(1)}</span>
      </div>
      {mediaUrl ? (
        <Media src={mediaUrl} aspect="aspect-square" />
      ) : (
        <div className="flex aspect-square items-center justify-center bg-linear-to-br from-brand/20 via-muted to-brand-2/20 px-8 text-center text-xs text-muted-foreground">
          Instagram posts need an image — add one above to see it here.
        </div>
      )}
      <div className="flex items-center gap-4 p-3 pb-1">
        <Heart className="size-5" />
        <MessageCircle className="size-5" />
        <Send className="size-5" />
        <Bookmark className="ml-auto size-5" />
      </div>
      <div className="px-3 pb-4 text-sm leading-snug">
        <span className="mr-1.5 font-semibold">{meta.handle.slice(1)}</span>
        <Body text={text} limit={meta.limit} className="inline" />
      </div>
    </div>
  )
}

function FacebookPreview({ text, mediaUrl, when }: PreviewProps) {
  const meta = PLATFORM_META.facebook
  return (
    <div>
      <div className="flex items-center gap-2.5 p-4 pb-3">
        <Avatar size="size-10" />
        <div>
          <p className="text-sm font-semibold">{meta.handle}</p>
          <p className="text-xs text-muted-foreground">{when ? format(when, "MMMM d 'at' h:mm a") : "Scheduled"} · 🌐</p>
        </div>
      </div>
      <Body text={text} limit={meta.limit} className="px-4 pb-3 text-[15px] leading-snug" />
      <Media src={mediaUrl} aspect="aspect-[1.91/1]" />
      <div className="mx-4 flex justify-around border-t py-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="size-4" /> Like
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="size-4" /> Comment
        </span>
        <span className="flex items-center gap-1.5">
          <Share className="size-4" /> Share
        </span>
      </div>
    </div>
  )
}

function TikTokPreview({ text, mediaUrl }: PreviewProps) {
  const meta = PLATFORM_META.tiktok
  return (
    <div className="flex justify-center bg-muted/40 p-4">
      <div className="relative aspect-[9/16] w-full max-w-[260px] overflow-hidden rounded-2xl bg-neutral-900 text-white shadow-xl">
        {mediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided URLs
          <img src={mediaUrl} alt="" className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-linear-to-b from-neutral-800 via-neutral-900 to-black" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute right-2.5 bottom-24 flex flex-col items-center gap-4">
          <Avatar size="size-9" />
          <Heart className="size-6 fill-white" />
          <MessageCircle className="size-6 fill-white" />
          <Bookmark className="size-6 fill-white" />
        </div>
        <div className="absolute inset-x-3 bottom-4 pr-12">
          <p className="text-sm font-semibold">{meta.handle}</p>
          <Body text={text} limit={meta.limit} className="mt-1 line-clamp-4 text-[13px] leading-snug" />
          <p className="mt-2 flex items-center gap-1.5 text-xs opacity-90">
            <Music2 className="size-3" /> original sound — Halcyon
          </p>
        </div>
      </div>
    </div>
  )
}

const PREVIEWS: Record<Platform, (props: PreviewProps) => React.ReactElement> = {
  x: XPreview,
  instagram: InstagramPreview,
  facebook: FacebookPreview,
  tiktok: TikTokPreview,
}

export function PostPreview({ platforms, ...props }: PreviewProps & { platforms: Platform[] }) {
  const [active, setActive] = React.useState<Platform | null>(platforms[0] ?? null)
  const current = active && platforms.includes(active) ? active : (platforms[0] ?? null)

  if (!current) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed text-center text-sm text-muted-foreground">
        <span className="font-serif text-2xl italic">Nothing to preview yet</span>
        Select a channel to see a live preview.
      </div>
    )
  }

  const Preview = PREVIEWS[current]

  return (
    <div>
      <div className="mb-3 flex gap-1 rounded-xl border bg-muted/50 p-1" role="tablist" aria-label="Preview platform">
        {platforms.map((p) => {
          const Icon = PLATFORM_ICONS[p]
          const selected = p === current
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(p)}
              className={cn(
                "relative flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors",
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="preview-tab"
                  className="absolute inset-0 rounded-lg border bg-card shadow-sm"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              <Icon className="relative size-3.5" />
              <span className="relative hidden sm:inline">{PLATFORM_META[p].label}</span>
            </button>
          )
        })}
      </div>
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.2 }}
          >
            <Preview {...props} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
