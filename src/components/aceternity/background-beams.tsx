"use client"

import { motion } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

const PATHS = Array.from({ length: 24 }, (_, i) => {
  const o = i * 7
  return `M${-380 + o} ${-189 - o * 1.1}C${-380 + o} ${-189 - o * 1.1} ${-312 + o} ${216 - o} ${152 + o} ${343 - o}C${616 + o} ${470 - o} ${684 + o} ${875 - o} ${684 + o} ${875 - o}`
})

/** Aceternity UI — Background Beams. Light pulses travel along curved paths. */
export const BackgroundBeams = React.memo(function BackgroundBeams({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 flex h-full w-full items-center justify-center [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]",
        className
      )}
    >
      <svg className="absolute z-0 h-full w-full" width="100%" height="100%" viewBox="0 0 696 316" fill="none" aria-hidden>
        <path
          d={PATHS.join(" ")}
          stroke="url(#beams-static)"
          strokeOpacity="0.06"
          strokeWidth="0.5"
        />
        {PATHS.map((d, i) => (
          <motion.path key={i} d={d} stroke={`url(#beam-${i})`} strokeOpacity="0.45" strokeWidth="0.6" />
        ))}
        <defs>
          {PATHS.map((_, i) => (
            <motion.linearGradient
              id={`beam-${i}`}
              key={i}
              initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + ((i * 37) % 8)}%`],
              }}
              transition={{
                duration: 10 + ((i * 53) % 10),
                ease: "easeInOut",
                repeat: Infinity,
                delay: (i * 17) % 10,
              }}
            >
              <stop stopColor="var(--brand)" stopOpacity="0" />
              <stop stopColor="var(--brand)" />
              <stop offset="32.5%" stopColor="var(--brand-2)" />
              <stop offset="100%" stopColor="var(--brand-2)" stopOpacity="0" />
            </motion.linearGradient>
          ))}
          <radialGradient
            id="beams-static"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(352 34) rotate(90) scale(555 1560)"
          >
            <stop offset="0.07" stopColor="currentColor" />
            <stop offset="0.25" stopColor="currentColor" />
            <stop offset="0.6" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
})
