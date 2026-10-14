"use client"

import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useTransform } from "motion/react"
import Link from "next/link"
import * as React from "react"

import { cn } from "@/lib/utils"

/** Aceternity UI — Moving Border. A glowing orb that travels around the element's border. */
export function MovingBorder({
  children,
  duration = 3000,
  rx = "30%",
  ry = "30%",
}: {
  children: React.ReactNode
  duration?: number
  rx?: string
  ry?: string
}) {
  const pathRef = React.useRef<SVGRectElement>(null)
  const progress = useMotionValue(0)

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength()
    if (length) progress.set((time * (length / duration)) % length)
  })

  const x = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).x ?? 0)
  const y = useTransform(progress, (val) => pathRef.current?.getPointAtLength(val).y ?? 0)
  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full"
        width="100%"
        height="100%"
        aria-hidden
      >
        <rect fill="none" width="100%" height="100%" rx={rx} ry={ry} ref={pathRef} />
      </svg>
      <motion.div style={{ position: "absolute", top: 0, left: 0, display: "inline-block", transform }}>
        {children}
      </motion.div>
    </>
  )
}

interface MovingBorderSurfaceProps {
  children: React.ReactNode
  className?: string
  borderRadius: string
  duration: number
}

function MovingBorderSurface({ children, className, borderRadius, duration }: MovingBorderSurfaceProps) {
  return (
    <>
      <span className="absolute inset-0" style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
        <MovingBorder duration={duration} rx="30%" ry="30%">
          <span className="block h-16 w-16 bg-[radial-gradient(var(--brand)_40%,transparent_60%)] opacity-90" />
        </MovingBorder>
      </span>
      <span
        className={cn(
          "relative flex h-full w-full items-center justify-center gap-2 border border-border/60 bg-background/80 antialiased backdrop-blur-xl",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        {children}
      </span>
    </>
  )
}

type SharedProps = {
  containerClassName?: string
  borderRadius?: string
  duration?: number
}

export function MovingBorderButton({
  children,
  className,
  containerClassName,
  borderRadius = "9999px",
  duration = 3500,
  ...props
}: React.ComponentProps<"button"> & SharedProps) {
  return (
    <button
      className={cn("relative inline-block overflow-hidden bg-transparent p-px text-sm", containerClassName)}
      style={{ borderRadius }}
      {...props}
    >
      <MovingBorderSurface className={className} borderRadius={borderRadius} duration={duration}>
        {children}
      </MovingBorderSurface>
    </button>
  )
}

export function MovingBorderLink({
  children,
  className,
  containerClassName,
  borderRadius = "9999px",
  duration = 3500,
  ...props
}: React.ComponentProps<typeof Link> & SharedProps) {
  return (
    <Link
      className={cn("relative inline-block overflow-hidden bg-transparent p-px text-sm", containerClassName)}
      style={{ borderRadius }}
      {...props}
    >
      <MovingBorderSurface className={className} borderRadius={borderRadius} duration={duration}>
        {children}
      </MovingBorderSurface>
    </Link>
  )
}
