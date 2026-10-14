"use client"

import { motion, useMotionTemplate, useMotionValue } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

/** Aceternity UI — Card Spotlight. A soft brand glow that follows the cursor. */
export function CardSpotlight({
  children,
  className,
  radius = 320,
  ...props
}: React.ComponentProps<"div"> & { radius?: number }) {
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--brand) 14%, transparent), transparent 80%)`
  const border = useMotionTemplate`radial-gradient(${radius * 0.7}px circle at ${mouseX}px ${mouseY}px, color-mix(in oklch, var(--brand) 55%, transparent), transparent 80%)`

  return (
    <div
      onMouseMove={(e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - left)
        mouseY.set(e.clientY - top)
      }}
      onMouseLeave={() => {
        mouseX.set(-1000)
        mouseY.set(-1000)
      }}
      className={cn("group/spot relative rounded-2xl border bg-card", className)}
      {...props}
    >
      {/* glowing border */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 [mask-composite:exclude] [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] p-px"
        style={{ background: border }}
      />
      {/* inner glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{ background }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
