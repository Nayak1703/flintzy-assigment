"use client"

import { motion } from "motion/react"

import { cn } from "@/lib/utils"

/** Aceternity UI — Lamp effect. Two conic beams ignite above the content. */
export function LampContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative z-0 flex min-h-[32rem] w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border bg-background",
        className
      )}
    >
      <div className="relative isolate z-0 flex w-full flex-1 scale-y-125 items-center justify-center">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: "conic-gradient(from 70deg at center top, var(--brand), transparent, transparent)" }}
          className="absolute inset-auto right-1/2 h-56 w-[30rem] overflow-visible"
        >
          <div className="absolute bottom-0 left-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute bottom-0 left-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: "conic-gradient(from 290deg at center top, transparent, transparent, var(--brand))" }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem]"
        >
          <div className="absolute right-0 bottom-0 z-20 h-full w-40 bg-background [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute right-0 bottom-0 z-20 h-40 w-full bg-background [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-brand opacity-40 blur-3xl" />
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-brand-2/70 blur-2xl"
        />
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-brand"
        />
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-background" />
      </div>
      <div className="relative z-50 flex -translate-y-44 flex-col items-center px-5">{children}</div>
    </div>
  )
}
