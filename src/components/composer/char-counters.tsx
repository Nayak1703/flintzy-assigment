"use client"

import { AnimatePresence, motion } from "motion/react"

import { PlatformChip } from "@/components/brand/platform-icons"
import { PLATFORM_META } from "@/lib/platforms"
import type { Platform } from "@/lib/types"
import { cn } from "@/lib/utils"

function Ring({ pct, over, warn }: { pct: number; over: boolean; warn: boolean }) {
  const r = 9
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 24 24" className="size-5 -rotate-90" aria-hidden>
      <circle cx="12" cy="12" r={r} className="fill-none stroke-muted" strokeWidth="2.5" />
      <motion.circle
        cx="12"
        cy="12"
        r={r}
        strokeWidth="2.5"
        strokeLinecap="round"
        className={cn("fill-none", over ? "stroke-failed" : warn ? "stroke-brand-2" : "stroke-brand")}
        strokeDasharray={c}
        initial={false}
        animate={{ strokeDashoffset: c * (1 - Math.min(pct, 1)) }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
    </svg>
  )
}

export function CharCounters({ platforms, count }: { platforms: Platform[]; count: number }) {
  if (platforms.length === 0) {
    return <p className="text-xs text-muted-foreground">Pick a channel to see its character limit.</p>
  }

  return (
    <ul className="flex flex-wrap gap-2" aria-label="Character limits">
      <AnimatePresence initial={false} mode="popLayout">
        {platforms.map((p) => {
          const { limit, label } = PLATFORM_META[p]
          const remaining = limit - count
          const over = remaining < 0
          const warn = !over && remaining <= Math.max(20, limit * 0.1)
          return (
            <motion.li
              key={p}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
              className={cn(
                "flex h-8 items-center gap-2 rounded-full border bg-background pr-3 pl-1 text-xs transition-colors",
                over && "border-failed/40 bg-failed/[0.07]"
              )}
              aria-label={`${label}: ${count} of ${limit} characters${over ? `, ${-remaining} over the limit` : ""}`}
            >
              <PlatformChip platform={p} size="md" />
              <Ring pct={count / limit} over={over} warn={warn} />
              <span className={cn("font-mono tabular-nums", over ? "font-semibold text-failed" : "text-muted-foreground")}>
                {count.toLocaleString()}
                <span className="opacity-50">/{limit.toLocaleString()}</span>
              </span>
              {over && (
                <motion.span
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono font-semibold text-failed"
                >
                  −{(-remaining).toLocaleString()}
                </motion.span>
              )}
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ul>
  )
}
