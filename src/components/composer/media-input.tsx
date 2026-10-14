"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { ImageIcon, ImageOff, Link2, Loader2, Sparkles, X } from "lucide-react"

import { isValidHttpUrl } from "@/lib/text"
import { cn } from "@/lib/utils"

const SAMPLES = [
  "https://picsum.photos/seed/cadence-alpine/1200/900",
  "https://picsum.photos/seed/cadence-forest/1080/1350",
  "https://picsum.photos/seed/cadence-coast/1200/1200",
]

type MediaStatus = "empty" | "invalid" | "loading" | "ready" | "error"

export function MediaInput({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const trimmed = value.trim()
  const valid = trimmed !== "" && isValidHttpUrl(trimmed)
  const [loadState, setLoadState] = React.useState<{ url: string; state: "loading" | "ready" | "error" }>({
    url: "",
    state: "loading",
  })

  const status: MediaStatus = !trimmed
    ? "empty"
    : !valid
      ? "invalid"
      : loadState.url === trimmed
        ? loadState.state
        : "loading"

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "relative flex h-11 items-center rounded-xl border bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40 dark:bg-input/30",
          status === "invalid" && "border-destructive"
        )}
      >
        <Link2 className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          aria-label="Image URL"
          aria-invalid={status === "invalid"}
          className="h-full w-full bg-transparent pr-10 pl-9 text-sm outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute right-2 flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {status === "invalid" && (
        <p className="text-xs text-destructive">Enter a full URL starting with http:// or https://</p>
      )}
      {status === "error" && (
        <p className="text-xs text-brand-2">We couldn&apos;t load that image. You can still schedule, but double-check the link.</p>
      )}
      {status === "empty" && (
        <button
          type="button"
          onClick={() => onChange(SAMPLES[Math.floor(Math.random() * SAMPLES.length)])}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <Sparkles className="size-3.5 text-brand" /> Use a sample image
        </button>
      )}

      <AnimatePresence initial={false}>
        {valid && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border bg-muted/50">
              {status === "loading" && <Loader2 className="size-5 animate-spin text-muted-foreground" />}
              {status === "error" && (
                <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                  <ImageOff className="size-5" /> Image unavailable
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary user-provided URLs */}
              <img
                key={trimmed}
                src={trimmed}
                alt="Attached media preview"
                onLoad={() => setLoadState({ url: trimmed, state: "ready" })}
                onError={() => setLoadState({ url: trimmed, state: "error" })}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-500",
                  status === "ready" ? "opacity-100" : "opacity-0"
                )}
              />
              {status === "ready" && (
                <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] text-white backdrop-blur">
                  <ImageIcon className="size-3" /> Attached
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
