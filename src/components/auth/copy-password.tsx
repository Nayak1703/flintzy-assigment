"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Check, Copy, KeyRound } from "lucide-react"

import { DEMO_PASSWORD } from "@/lib/auth"
import { cn } from "@/lib/utils"

function useCopy() {
  const [copied, setCopied] = React.useState(false)
  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(DEMO_PASSWORD)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can be blocked; the password is visible anyway.
    }
  }, [])
  return { copied, copy }
}

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={copied ? "check" : "copy"}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="flex"
      >
        {copied ? <Check className="size-3.5 text-published" /> : <Copy className="size-3.5" />}
      </motion.span>
    </AnimatePresence>
  )
}

/** Inline pill showing the public demo password with a copy button. */
export function PasswordChip({ className, onUse }: { className?: string; onUse?: (password: string) => void }) {
  const { copied, copy } = useCopy()
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border bg-background/70 py-1 pr-1 pl-3 text-sm shadow-sm backdrop-blur",
        className
      )}
    >
      <KeyRound className="size-3.5 text-brand" />
      <span className="text-muted-foreground">Password</span>
      <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[13px] font-medium tracking-wide">
        {DEMO_PASSWORD}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy password"
        className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <CopyIcon copied={copied} />
      </button>
      {onUse && (
        <button
          type="button"
          onClick={() => onUse(DEMO_PASSWORD)}
          className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background transition-opacity hover:opacity-90"
        >
          Use it
        </button>
      )}
    </div>
  )
}

/** Thin announcement bar pinned to the top of the marketing site. */
export function DemoAccessBar() {
  const { copied, copy } = useCopy()
  return (
    <div className="relative z-50 border-b bg-foreground text-background">
      <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-2 px-4 text-[13px] sm:gap-3">
        <span className="hidden items-center gap-1.5 sm:inline-flex">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-2 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-brand-2" />
          </span>
          Public demo
        </span>
        <span className="hidden opacity-40 sm:inline">·</span>
        <span className="opacity-80">Access password:</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md bg-background/10 px-2 py-0.5 font-mono font-medium tracking-wide transition-colors hover:bg-background/20"
          aria-label={`Copy password ${DEMO_PASSWORD}`}
        >
          {DEMO_PASSWORD}
          <CopyIcon copied={copied} />
        </button>
      </div>
    </div>
  )
}
