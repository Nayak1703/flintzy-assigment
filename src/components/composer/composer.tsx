"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Check, Info, Loader2, Send } from "lucide-react"
import { toast } from "sonner"

import { PLATFORM_ICONS } from "@/components/brand/platform-icons"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { formatFull, localTimeZone, quickSlots, timeZoneAbbr } from "@/lib/date"
import { PLATFORM_LIST, PLATFORM_META } from "@/lib/platforms"
import { usePosts } from "@/lib/posts-store"
import { countCharacters, isValidHttpUrl } from "@/lib/text"
import type { Platform } from "@/lib/types"
import { useNow } from "@/lib/use-now"
import { cn } from "@/lib/utils"

import { CharCounters } from "./char-counters"
import { DateTimePicker } from "./datetime-picker"
import { MediaInput } from "./media-input"
import { PostPreview } from "./post-preview"

function Section({
  step,
  title,
  hint,
  children,
}: {
  step: number
  title: string
  hint?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border-b p-5 last:border-b-0 sm:p-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="font-serif text-lg text-muted-foreground/60 italic">0{step}</span>
        <h2 className="font-semibold tracking-tight">{title}</h2>
        {hint && <span className="ml-auto text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </section>
  )
}

export function Composer() {
  const router = useRouter()
  const { createPost } = usePosts()
  const now = useNow(30_000)

  const [content, setContent] = React.useState("")
  const [platforms, setPlatforms] = React.useState<Platform[]>(["instagram", "x"])
  const [mediaUrl, setMediaUrl] = React.useState("")
  const [scheduledFor, setScheduledFor] = React.useState<Date | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const [attempted, setAttempted] = React.useState(false)
  const [tz, setTz] = React.useState("")

  // Initialise client-only values after mount to avoid hydration mismatches.
  React.useEffect(() => {
    setScheduledFor(quickSlots()[0].date)
    setTz(`${localTimeZone()} (${timeZoneAbbr()})`)
  }, [])

  const count = countCharacters(content)
  const overLimit = platforms.filter((p) => count > PLATFORM_META[p].limit)
  const isPast = scheduledFor ? scheduledFor.getTime() <= now.getTime() : false
  const mediaInvalid = mediaUrl.trim() !== "" && !isValidHttpUrl(mediaUrl.trim())

  const problems: string[] = []
  if (!content.trim()) problems.push("Write something to post.")
  if (platforms.length === 0) problems.push("Select at least one channel.")
  if (overLimit.length)
    problems.push(`Too long for ${overLimit.map((p) => PLATFORM_META[p].label).join(" and ")}.`)
  if (!scheduledFor) problems.push("Pick a date and time.")
  else if (isPast) problems.push("The scheduled time must be in the future.")
  if (mediaInvalid) problems.push("Fix the image URL or remove it.")

  const canSubmit = problems.length === 0 && !submitting && !done

  const togglePlatform = (p: Platform) =>
    setPlatforms((list) => (list.includes(p) ? list.filter((x) => x !== p) : [...list, p]))

  const submit = async () => {
    setAttempted(true)
    if (!canSubmit || !scheduledFor) return
    setSubmitting(true)
    try {
      const post = await createPost({
        content,
        platforms,
        mediaUrl: mediaUrl.trim() || undefined,
        scheduledAt: scheduledFor.toISOString(), // always stored as UTC
      })
      setDone(true)
      toast.success("Post scheduled", { description: formatFull(post.scheduledAt) })
      setTimeout(() => router.push("/dashboard"), 700)
    } catch (err) {
      toast.error("Couldn't schedule this post", {
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-10" onKeyDown={onKeyDown}>
      <PageHeader
        eyebrow={
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <ArrowLeft className="size-3.5" /> Back to queue
          </Link>
        }
        title={
          <>
            Compose a <span className="font-serif font-normal italic">post</span>
          </>
        }
        description="Write once, tailor nothing. We'll check every channel's limits as you type."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
          <Section step={1} title="Channels" hint={`${platforms.length} selected`}>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PLATFORM_LIST.map((p) => {
                const Icon = PLATFORM_ICONS[p.id]
                const selected = platforms.includes(p.id)
                return (
                  <motion.button
                    key={p.id}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    aria-pressed={selected}
                    onClick={() => togglePlatform(p.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-3 rounded-2xl border p-3 text-left transition-[border-color,background-color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                      selected
                        ? "border-foreground/70 bg-background shadow-[0_0_0_3px_color-mix(in_oklch,var(--foreground)_8%,transparent)]"
                        : "bg-background/50 hover:border-foreground/25"
                    )}
                  >
                    <span className={cn("flex size-8 items-center justify-center rounded-full", p.chip)}>
                      <Icon className="size-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{p.label}</span>
                      <span className="block truncate text-xs text-muted-foreground">{p.handle}</span>
                    </span>
                    <span
                      className={cn(
                        "absolute top-3 right-3 flex size-5 items-center justify-center rounded-full border transition-colors",
                        selected ? "border-foreground bg-foreground text-background" : "bg-background"
                      )}
                    >
                      <AnimatePresence>
                        {selected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 600, damping: 30 }}
                          >
                            <Check className="size-3" strokeWidth={3} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </motion.button>
                )
              })}
            </div>
            {attempted && platforms.length === 0 && (
              <p className="mt-3 text-xs text-destructive">Select at least one channel.</p>
            )}
          </Section>

          <Section step={2} title="Content">
            <div
              className={cn(
                "rounded-2xl border bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30 dark:bg-input/20",
                overLimit.length > 0 && "border-failed/60 focus-within:border-failed focus-within:ring-failed/20"
              )}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to share?"
                aria-label="Post content"
                aria-invalid={overLimit.length > 0 || (attempted && !content.trim())}
                rows={7}
                className="block min-h-44 w-full resize-y bg-transparent px-4 pt-4 pb-2 text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
              />
              <div className="flex flex-wrap items-center gap-2 border-t border-dashed px-3 py-2.5">
                <CharCounters platforms={platforms} count={count} />
              </div>
            </div>
            <AnimatePresence>
              {overLimit.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center gap-1.5 overflow-hidden text-xs text-failed"
                >
                  <Info className="size-3.5" />
                  Trim {count - Math.min(...overLimit.map((p) => PLATFORM_META[p].limit))} characters or deselect{" "}
                  {overLimit.map((p) => PLATFORM_META[p].label).join(" / ")} to schedule.
                </motion.p>
              )}
            </AnimatePresence>
          </Section>

          <Section step={3} title="Image" hint="Optional">
            <MediaInput value={mediaUrl} onChange={setMediaUrl} />
          </Section>

          <Section step={4} title="Schedule" hint={tz}>
            <DateTimePicker value={scheduledFor} onChange={setScheduledFor} invalid={isPast} />
            <AnimatePresence initial={false}>
              {isPast && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden text-xs text-destructive"
                >
                  That time has already passed — pick a moment in the future.
                </motion.p>
              )}
            </AnimatePresence>
            {scheduledFor && !isPast && (
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                Stored as UTC · {scheduledFor.toISOString()}
              </p>
            )}
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Live preview</h2>
            <span className="text-xs text-muted-foreground">Approximation</span>
          </div>
          <PostPreview
            platforms={platforms}
            text={content}
            mediaUrl={isValidHttpUrl(mediaUrl.trim()) ? mediaUrl.trim() : undefined}
            when={scheduledFor}
          />
        </aside>
      </div>

      {/* Sticky action bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/85 backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-10">
          <div className="min-w-0 flex-1 text-sm">
            {problems.length === 0 && scheduledFor ? (
              <p className="truncate">
                <span className="text-muted-foreground">Goes out </span>
                <span className="font-medium">{formatFull(scheduledFor.toISOString())}</span>
                <span className="text-muted-foreground"> to {platforms.length} {platforms.length === 1 ? "channel" : "channels"}</span>
              </p>
            ) : (
              <p className="truncate text-muted-foreground">{problems[0]}</p>
            )}
          </div>
          <span className="hidden text-xs text-muted-foreground md:inline">
            <kbd className="rounded border bg-muted px-1.5 font-mono">Ctrl</kbd> +{" "}
            <kbd className="rounded border bg-muted px-1.5 font-mono">Enter</kbd>
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              {/* span wrapper keeps the tooltip working while the button is disabled */}
              <span tabIndex={canSubmit ? -1 : 0}>
                <Button
                  onClick={submit}
                  disabled={!canSubmit}
                  className={cn(
                    "h-11 min-w-40 rounded-full px-6 transition-colors",
                    done && "bg-published text-white disabled:opacity-100"
                  )}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={done ? "done" : submitting ? "loading" : "idle"}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      {done ? (
                        <>
                          <Check className="size-4" /> Scheduled
                        </>
                      ) : submitting ? (
                        <>
                          <Loader2 className="size-4 animate-spin" /> Scheduling…
                        </>
                      ) : (
                        <>
                          <Send className="size-4" /> Schedule post
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </span>
            </TooltipTrigger>
            {problems.length > 0 && !submitting && !done && (
              <TooltipContent side="top" className="max-w-64">
                <ul className="space-y-1">
                  {problems.map((p) => (
                    <li key={p}>• {p}</li>
                  ))}
                </ul>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
