"use client"

import { motion, stagger, useAnimate, useInView } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

/** Aceternity UI — Text Generate Effect. Words fade and un-blur in sequence. */
export function TextGenerateEffect({
  words,
  className,
  delay = 0,
  duration = 0.5,
}: {
  words: string
  className?: string
  delay?: number
  duration?: number
}) {
  const [scope, animate] = useAnimate()
  const inView = useInView(scope, { once: true })
  const tokens = words.split(" ")

  React.useEffect(() => {
    if (!inView) return
    animate(
      "span",
      { opacity: 1, filter: "blur(0px)", y: 0 },
      { duration, delay: stagger(0.06, { startDelay: delay }) }
    )
  }, [inView, animate, delay, duration])

  return (
    <p ref={scope} className={cn(className)}>
      {tokens.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block opacity-0"
          style={{ filter: "blur(8px)", transform: "translateY(4px)" }}
        >
          {word}
          {i < tokens.length - 1 && " "}
        </motion.span>
      ))}
    </p>
  )
}
