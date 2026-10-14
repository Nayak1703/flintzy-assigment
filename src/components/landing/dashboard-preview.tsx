"use client"

import { motion } from "motion/react"
import { CalendarClock, Filter, LayoutList, PenSquare, Search, Settings } from "lucide-react"

import { PlatformStack } from "@/components/brand/platform-icons"
import { LogoMark } from "@/components/brand/logo"
import { StatusBadge } from "@/components/dashboard/status-badge"
import type { Platform, PostStatus } from "@/lib/types"

const GROUPS: {
  label: string
  date: string
  rows: { time: string; text: string; platforms: Platform[]; status: PostStatus; media?: string }[]
}[] = [
  {
    label: "Today",
    date: "Oct 14",
    rows: [
      {
        time: "10:00 AM",
        text: "Meet the Ridgeline Down Jacket. 800-fill, 340 g, packs into its own pocket.",
        platforms: ["instagram", "facebook"],
        status: "published",
        media: "from-amber-300 via-orange-400 to-rose-500",
      },
      {
        time: "1:30 PM",
        text: "Ranking every trail snack our team brought on the Alpine Loop 🥨🍫",
        platforms: ["tiktok", "instagram"],
        status: "scheduled",
      },
      {
        time: "5:00 PM",
        text: "Ridgeline Down is here. Your cold-weather layer, solved. 🧥",
        platforms: ["x", "facebook"],
        status: "scheduled",
      },
    ],
  },
  {
    label: "Tomorrow",
    date: "Oct 15",
    rows: [
      {
        time: "8:00 AM",
        text: "Blue hour on the plateau. Some mornings are worth the 4 AM alarm. 🌌",
        platforms: ["instagram"],
        status: "scheduled",
        media: "from-indigo-400 via-violet-500 to-fuchsia-500",
      },
      {
        time: "11:00 AM",
        text: "Thread: 7 mistakes we see on almost every first winter hike 🧵",
        platforms: ["x", "tiktok"],
        status: "failed",
      },
    ],
  },
]

const NAV = [
  { icon: LayoutList, label: "Queue", active: true },
  { icon: PenSquare, label: "Compose" },
  { icon: CalendarClock, label: "Calendar" },
  { icon: Settings, label: "Settings" },
]

/** A static, illustrative replica of the dashboard used in the hero. */
export function DashboardPreview() {
  return (
    <div className="flex h-[30rem] text-left md:h-[36rem]" aria-hidden>
      <aside className="hidden w-52 shrink-0 flex-col gap-1 border-r bg-sidebar p-3 md:flex">
        <div className="mb-4 flex items-center gap-2 px-2 pt-1">
          <LogoMark className="size-7" />
          <span className="text-sm font-semibold">Cadence</span>
        </div>
        {NAV.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${
              active ? "bg-accent font-medium text-foreground" : "text-muted-foreground"
            }`}
          >
            <Icon className="size-4" />
            {label}
          </div>
        ))}
        <div className="mt-auto rounded-xl border bg-card p-3">
          <div className="text-[11px] text-muted-foreground">This week</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">24 posts</div>
          <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="w-[62%] bg-scheduled" />
            <div className="w-[30%] bg-published" />
            <div className="w-[8%] bg-failed" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border bg-muted/40 px-3 text-[13px] text-muted-foreground">
            <Search className="size-3.5" /> Search posts…
          </div>
          <div className="hidden h-8 items-center gap-1.5 rounded-lg border px-3 text-[13px] text-muted-foreground sm:flex">
            <Filter className="size-3.5" /> Status
          </div>
          <div className="flex h-8 items-center rounded-lg bg-foreground px-3 text-[13px] font-medium text-background">
            New post
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-hidden p-4">
          {GROUPS.map((group, gi) => (
            <div key={group.label}>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold">{group.label}</span>
                <span className="text-xs text-muted-foreground">{group.date}</span>
              </div>
              <div className="space-y-2">
                {group.rows.map((row, ri) => (
                  <motion.div
                    key={row.time}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + (gi * 3 + ri) * 0.08, duration: 0.4 }}
                    className="flex items-center gap-3 rounded-xl border bg-card p-3"
                  >
                    {row.media ? (
                      <div className={`size-11 shrink-0 rounded-lg bg-gradient-to-br ${row.media}`} />
                    ) : (
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-medium text-muted-foreground tabular-nums">
                        {row.time.split(" ")[0]}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px]">{row.text}</p>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <PlatformStack platforms={row.platforms} size="sm" />
                        <span className="tabular-nums">{row.time}</span>
                      </div>
                    </div>
                    <StatusBadge status={row.status} className="hidden sm:inline-flex" />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
