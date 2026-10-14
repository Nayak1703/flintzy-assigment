"use client"

import { AnimatePresence, motion } from "motion/react"
import * as React from "react"

import { cn } from "@/lib/utils"

/** Aceternity UI — Flip Words. Cycles through words with a letter-by-letter reveal. */
export function FlipWords({
  words,
  duration = 2600,
  className,
}: {
  words: string[]
  duration?: number
  className?: string
}) {
  const [index, setIndex] = React.useState(0)
  const word = words[index]

  React.useEffect(() => {
    const id = setTimeout(() => setIndex((i) => (i + 1) % words.length), duration)
    return () => clearTimeout(id)
  }, [index, duration, words.length])

  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={word}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40, x: 40, filter: "blur(8px)", scale: 2, position: "absolute" }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className={cn("relative z-10 inline-block whitespace-nowrap", className)}
      >
        {word.split("").map((letter, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="inline-block"
          >
            {letter === " " ? " " : letter}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  )
}
