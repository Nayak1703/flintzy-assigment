"use client"

import { motion } from "motion/react"

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: React.ReactNode
  description?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-brand uppercase">
        <span className="h-px w-6 bg-brand/50" />
        {eyebrow}
        <span className="h-px w-6 bg-brand/50" />
      </span>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-balance md:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground md:text-lg">{description}</p>
      )}
    </motion.div>
  )
}
