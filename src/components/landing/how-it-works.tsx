"use client"

import { motion } from "motion/react"
import { CalendarCheck2, Coffee, PenLine } from "lucide-react"

import { CardSpotlight } from "@/components/aceternity/card-spotlight"

import { SectionHeading } from "./section-heading"

const STEPS = [
  {
    icon: PenLine,
    title: "Compose once",
    body: "Write your post, pick your channels and drop in an image. Live previews show exactly how it lands on each platform.",
  },
  {
    icon: CalendarCheck2,
    title: "Pick a moment",
    body: "Choose a date and time in your own time zone — or tap a smart slot. We store it in UTC so it's right everywhere.",
  },
  {
    icon: Coffee,
    title: "Get on with your day",
    body: "Your queue handles the rest. If a platform hiccups, you'll see why and can retry in one tap.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative scroll-mt-24 border-y bg-muted/30 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-40 mask-radial" />
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From idea to <span className="font-serif font-normal italic text-gradient">queued</span> in under a minute.
            </>
          }
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <CardSpotlight className="h-full p-7">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl border bg-background shadow-sm">
                    <step.icon className="size-5 text-brand" />
                  </span>
                  <span className="font-serif text-5xl text-muted-foreground/30 italic">0{i + 1}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
