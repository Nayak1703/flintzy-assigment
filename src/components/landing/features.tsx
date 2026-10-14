"use client"

import * as React from "react"
import { AnimatePresence, motion, useInView } from "motion/react"
import { CalendarRange, Globe2, Link2, RefreshCcw, Type } from "lucide-react"

import { BentoGrid, BentoGridItem } from "@/components/aceternity/bento-grid"
import { PlatformChip, PlatformStack } from "@/components/brand/platform-icons"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { PLATFORM_LIST } from "@/lib/platforms"
import { cn } from "@/lib/utils"

import { SectionHeading } from "./section-heading"

/* ---------- Mini demo: live character limits ---------- */
const SAMPLE =
  "Introducing the Halcyon Ultralight 30 — our lightest pack ever at 680 g. Recycled ripstop, a frame that actually breathes, and pockets exactly where your hands expect them. Launching today. 🎒✨ #GoOutside"

function CharacterLimitsDemo() {
  const ref = React.useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: "-80px" })
  const [length, setLength] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setLength((l) => (l >= SAMPLE.length + 40 ? 0 : l + 2)), 45)
    return () => clearInterval(id)
  }, [inView])

  const typed = SAMPLE.slice(0, Math.min(length, SAMPLE.length))
  // Exaggerate the X counter so the demo crosses its limit visibly.
  const limits = [
    { platform: "x" as const, limit: 140 },
    { platform: "instagram" as const, limit: 2200 },
    { platform: "facebook" as const, limit: 5000 },
  ]

  return (
    <div ref={ref} className="flex h-full w-full flex-col justify-between gap-3 p-4">
      <p className="line-clamp-3 font-mono text-[12px] leading-relaxed text-foreground/80">
        {typed}
        <span className="ml-px inline-block h-3.5 w-px translate-y-0.5 animate-pulse bg-brand" />
      </p>
      <div className="flex items-center gap-4">
        {limits.map(({ platform, limit }) => {
          const pct = Math.min(typed.length / limit, 1)
          const over = typed.length > limit
          const r = 11
          const c = 2 * Math.PI * r
          return (
            <div key={platform} className="flex items-center gap-1.5">
              <PlatformChip platform={platform} size="sm" />
              <svg viewBox="0 0 28 28" className="size-6 -rotate-90">
                <circle cx="14" cy="14" r={r} className="fill-none stroke-muted" strokeWidth="3" />
                <circle
                  cx="14"
                  cy="14"
                  r={r}
                  strokeWidth="3"
                  strokeLinecap="round"
                  className={cn(
                    "fill-none transition-[stroke-dashoffset,stroke] duration-150",
                    over ? "stroke-failed" : pct > 0.8 ? "stroke-brand-2" : "stroke-brand"
                  )}
                  strokeDasharray={c}
                  strokeDashoffset={c * (1 - pct)}
                />
              </svg>
              <span className={cn("font-mono text-[11px] tabular-nums", over ? "text-failed" : "text-muted-foreground")}>
                {limit - typed.length}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------- Mini demo: grouped queue ---------- */
function QueueDemo() {
  const days = [
    { label: "Today", rows: [["9:00", ["instagram", "facebook"]], ["13:30", ["tiktok"]]] },
    { label: "Tomorrow", rows: [["8:00", ["x"]], ["11:00", ["x", "tiktok"]]] },
    { label: "Fri, Oct 17", rows: [["10:00", ["facebook", "instagram", "x"]]] },
  ] as const
  return (
    <div className="flex w-full flex-col gap-3 p-4">
      {days.map((day, di) => (
        <motion.div
          key={day.label}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: di * 0.12 }}
        >
          <div className="mb-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{day.label}</div>
          <div className="space-y-1.5">
            {day.rows.map(([time, platforms]) => (
              <div key={time} className="flex items-center gap-2 rounded-lg border bg-card px-2.5 py-1.5">
                <span className="w-9 font-mono text-[11px] text-muted-foreground">{time}</span>
                <span className="h-1.5 flex-1 rounded-full bg-muted" />
                <PlatformStack platforms={[...platforms]} size="sm" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ---------- Mini demo: optimistic retry ---------- */
function RetryDemo() {
  const [phase, setPhase] = React.useState<"failed" | "pending" | "published">("failed")
  React.useEffect(() => {
    const next = { failed: "pending", pending: "published", published: "failed" } as const
    const wait = { failed: 1800, pending: 1000, published: 2200 }[phase]
    const id = setTimeout(() => setPhase(next[phase]), wait)
    return () => clearTimeout(id)
  }, [phase])

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <motion.div layout className="w-full max-w-xs rounded-xl border bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <PlatformStack platforms={["tiktok", "instagram"]} size="sm" />
          <StatusBadge status={phase === "failed" ? "failed" : "published"} pending={phase === "pending"} />
        </div>
        <div className="mt-3 h-1.5 w-4/5 rounded-full bg-muted" />
        <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-muted" />
        <AnimatePresence initial={false}>
          {phase === "failed" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-failed/10 px-2.5 py-2 text-[11px] text-failed">
                Access token expired
                <span className="inline-flex items-center gap-1 rounded-md bg-background px-2 py-0.5 font-medium text-foreground shadow-sm">
                  <RefreshCcw className="size-3" /> Retry
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ---------- Mini demo: URL filters ---------- */
function FiltersDemo() {
  const steps = ["", "?platform=x", "?platform=x,tiktok", "?platform=x,tiktok&status=failed"]
  const [i, setI] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % steps.length), 1400)
    return () => clearInterval(id)
  }, [steps.length])
  return (
    <div className="flex w-full flex-col justify-center gap-3 p-4">
      <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 font-mono text-[11px]">
        <Link2 className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-muted-foreground">
          cadence.app/dashboard
          <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-brand">
            {steps[i]}
          </motion.span>
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {["X", "TikTok", "Failed"].map((label, li) => (
          <motion.span
            key={label}
            animate={{
              opacity: i > li ? 1 : 0.35,
              scale: i > li ? 1 : 0.96,
            }}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              i > li ? "border-brand/40 bg-brand/10 text-brand" : "text-muted-foreground"
            )}
          >
            {label}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

/* ---------- Mini demo: timezones ---------- */
function TimezoneDemo() {
  return (
    <div className="flex w-full items-center justify-center gap-3 p-4">
      {[
        { city: "Stored", time: "03:30", zone: "UTC", accent: false },
        { city: "You see", time: "09:00", zone: "IST", accent: true },
      ].map((t) => (
        <div
          key={t.city}
          className={cn(
            "flex flex-1 flex-col items-center rounded-xl border bg-card px-3 py-3",
            t.accent && "border-brand/40 shadow-[0_0_0_4px_color-mix(in_oklch,var(--brand)_10%,transparent)]"
          )}
        >
          <span className="text-[10px] tracking-wide text-muted-foreground uppercase">{t.city}</span>
          <span className="mt-1 font-mono text-2xl font-semibold tabular-nums">{t.time}</span>
          <span className={cn("text-[11px]", t.accent ? "text-brand" : "text-muted-foreground")}>{t.zone}</span>
        </div>
      ))}
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:py-32">
      <SectionHeading
        eyebrow="Features"
        title={
          <>
            Everything a social team needs.{" "}
            <span className="font-serif font-normal italic text-muted-foreground">Nothing it doesn&apos;t.</span>
          </>
        }
        description="Cadence keeps the important things in view — what's going out, where, and when — and gets out of the way for everything else."
      />

      <BentoGrid className="mt-14">
        <BentoGridItem
          className="md:col-span-2"
          header={<CharacterLimitsDemo />}
          icon={<Type className="size-4 text-brand" />}
          title="Live character limits, per channel"
          description="X at 280, Instagram and TikTok at 2,200, Facebook at 5,000. Counters update as you type, and scheduling is blocked the moment any channel goes over."
        />
        <BentoGridItem
          header={<QueueDemo />}
          icon={<CalendarRange className="size-4 text-brand" />}
          title="A queue that reads like a calendar"
          description="Posts grouped into Today, Tomorrow and beyond — with previews, channels and status at a glance."
        />
        <BentoGridItem
          header={<RetryDemo />}
          icon={<RefreshCcw className="size-4 text-brand" />}
          title="One-tap, optimistic retries"
          description="Failed posts update instantly when retried, and roll back gracefully if the platform says no."
        />
        <BentoGridItem
          header={<FiltersDemo />}
          icon={<Link2 className="size-4 text-brand" />}
          title="Filters that remember"
          description="Platform, status and search live in the URL — refresh, bookmark or share the exact view."
        />
        <BentoGridItem
          header={<TimezoneDemo />}
          icon={<Globe2 className="size-4 text-brand" />}
          title="Your time zone, always"
          description="Stored in UTC, shown in your local time. Past times are never schedulable."
        />
      </BentoGrid>

      <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground">
        {PLATFORM_LIST.map((p) => (
          <span key={p.id} className="inline-flex items-center gap-2">
            <PlatformChip platform={p.id} />
            {p.label}
            <span className="font-mono text-xs opacity-70">{p.limit.toLocaleString()} chars</span>
          </span>
        ))}
      </div>
    </section>
  )
}
