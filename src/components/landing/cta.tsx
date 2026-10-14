"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"

import { LampContainer } from "@/components/aceternity/lamp"
import { PasswordChip } from "@/components/auth/copy-password"
import { Button } from "@/components/ui/button"

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-3 pb-16 md:px-5">
      <LampContainer>
        <motion.h2
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="mt-8 text-center text-4xl font-semibold tracking-[-0.035em] text-balance md:text-6xl"
        >
          Next month&apos;s posts,
          <br />
          <span className="font-serif font-normal italic text-gradient">scheduled by lunch.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 flex flex-col items-center gap-4"
        >
          <Button asChild size="lg" className="group h-12 rounded-full px-7 text-[15px]">
            <Link href="/login">
              Try the live demo
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <PasswordChip />
        </motion.div>
      </LampContainer>
    </section>
  )
}
