"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, Sparkles } from "lucide-react"

import { ContainerScroll } from "@/components/aceternity/container-scroll"
import { FlipWords } from "@/components/aceternity/flip-words"
import { MovingBorderLink } from "@/components/aceternity/moving-border"
import { Spotlight } from "@/components/aceternity/spotlight"
import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { PasswordChip } from "@/components/auth/copy-password"
import { Button } from "@/components/ui/button"

import { DashboardPreview } from "./dashboard-preview"

const fadeUp = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
}

export function Hero() {
  return (
    <section className="relative -mt-[68px] overflow-hidden pt-[68px]">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-radial opacity-70" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/15 blur-[120px] animate-aurora" />
      <div className="pointer-events-none absolute top-40 right-[-10rem] -z-10 h-80 w-80 rounded-full bg-brand-2/15 blur-[100px]" />
      <Spotlight className="-top-40 left-0 md:-top-20 md:left-60" fill="var(--brand)" />

      <div className="mx-auto max-w-5xl px-5 pt-16 text-center md:pt-24">
        <motion.div {...fadeUp} transition={{ duration: 0.6 }} className="flex justify-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-full border bg-background/60 py-1 pr-3 pl-1 text-[13px] text-muted-foreground backdrop-blur transition-colors hover:text-foreground"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand to-brand-2 px-2 py-0.5 text-[11px] font-medium text-white">
              <Sparkles className="size-3" /> New
            </span>
            TikTok scheduling is here
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-7 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.035em] text-balance sm:text-6xl md:text-7xl lg:text-[5.25rem]"
        >
          Plan once.{" "}
          <span className="font-serif font-normal tracking-[-0.01em] italic text-gradient">Post everywhere.</span>
        </motion.h1>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-2 text-lg text-muted-foreground md:text-xl"
        >
          The calm way to schedule posts for
          <FlipWords
            words={["Instagram", "TikTok", "X", "Facebook pages"]}
            className="font-medium text-foreground"
          />
        </motion.div>

        <TextGenerateEffect
          delay={0.5}
          className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted-foreground"
          words="Compose once, preview every channel, respect every character limit, and keep your whole week in one beautifully quiet queue."
        />

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <MovingBorderLink href="/login" containerClassName="h-12 w-52" className="font-medium text-foreground">
            Enter the demo
            <ArrowRight className="size-4" />
          </MovingBorderLink>
          <Button asChild variant="ghost" size="lg" className="h-12 rounded-full px-6 text-muted-foreground">
            <a href="#features">Explore features</a>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-6 flex justify-center"
        >
          <PasswordChip />
        </motion.div>
      </div>

      <ContainerScroll header={null}>
        <DashboardPreview />
      </ContainerScroll>
    </section>
  )
}
