"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** Aceternity UI — Infinite Moving Cards. A seamless, pausable marquee. */
export function InfiniteMovingCards({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: { quote: string; name: string; title: string }[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow"
  pauseOnHover?: boolean
  className?: string
}) {
  const duration = speed === "fast" ? "25s" : speed === "normal" ? "50s" : "90s"

  return (
    <div
      className={cn("relative z-10 max-w-7xl overflow-hidden mask-fade-x", className)}
      style={
        {
          "--animation-duration": duration,
          "--animation-direction": direction === "left" ? "forwards" : "reverse",
        } as React.CSSProperties
      }
    >
      <ul
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4 animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {/* Rendered twice so the loop is seamless */}
        {[...items, ...items].map((item, idx) => (
          <li
            key={idx}
            aria-hidden={idx >= items.length}
            className="relative w-[320px] max-w-full shrink-0 rounded-2xl border bg-card/80 px-7 py-6 backdrop-blur md:w-[420px]"
          >
            <blockquote>
              <span className="font-serif text-4xl leading-none text-brand/60">&ldquo;</span>
              <p className="-mt-2 text-[15px] leading-relaxed text-foreground/90">{item.quote}</p>
              <footer className="mt-5 flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-xs font-semibold text-white">
                  {item.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.title}</span>
                </span>
              </footer>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  )
}
