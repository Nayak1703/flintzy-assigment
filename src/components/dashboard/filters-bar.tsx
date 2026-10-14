"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { Search, X } from "lucide-react"

import { PLATFORM_ICONS } from "@/components/brand/platform-icons"
import { Button } from "@/components/ui/button"
import { PLATFORM_LIST } from "@/lib/platforms"
import { STATUSES, type Platform, type PostStatus } from "@/lib/types"
import type { PostFilters } from "@/lib/use-post-filters"
import { cn } from "@/lib/utils"

import { STATUS_LABEL, StatusDot } from "./status-badge"

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function Chip({
  pressed,
  onClick,
  children,
  label,
}: {
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "relative inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        pressed
          ? "border-foreground/80 bg-foreground text-background"
          : "bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

export function FiltersBar({
  filters,
  onChange,
  onClear,
  activeCount,
  resultCount,
  totalCount,
}: {
  filters: PostFilters
  onChange: (next: Partial<PostFilters>) => void
  onClear: () => void
  activeCount: number
  resultCount: number
  totalCount: number
}) {
  const [query, setQuery] = React.useState(filters.query)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const pushed = React.useRef(filters.query)

  // Pick up URL changes made elsewhere (back button, sidebar links, "clear").
  React.useEffect(() => {
    if (filters.query !== pushed.current) {
      pushed.current = filters.query
      setQuery(filters.query)
    }
  }, [filters.query])

  // Debounce typing into the URL.
  React.useEffect(() => {
    if (query === pushed.current) return
    const id = setTimeout(() => {
      pushed.current = query
      onChange({ query })
    }, 250)
    return () => clearTimeout(id)
  }, [query, onChange])

  // "/" focuses search
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (e.key === "/" && !el?.closest("input, textarea")) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const setPlatform = (p: Platform) => onChange({ platforms: toggle(filters.platforms, p) })
  const setStatus = (s: PostStatus) => onChange({ statuses: toggle(filters.statuses, s) })

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search post content…"
            aria-label="Search posts by content"
            className="h-10 w-full rounded-xl border bg-card pr-16 pl-9 text-sm shadow-xs transition-shadow outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              /
            </kbd>
          )}
        </div>
      </div>

      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:flex-wrap md:px-0">
        {PLATFORM_LIST.map((p) => {
          const Icon = PLATFORM_ICONS[p.id]
          return (
            <Chip
              key={p.id}
              pressed={filters.platforms.includes(p.id)}
              onClick={() => setPlatform(p.id)}
              label={`Filter by ${p.label}`}
            >
              <Icon className="size-3.5" />
              {p.label}
            </Chip>
          )
        })}
        <span className="mx-1 h-5 w-px shrink-0 bg-border" />
        {STATUSES.map((s) => (
          <Chip
            key={s}
            pressed={filters.statuses.includes(s)}
            onClick={() => setStatus(s)}
            label={`Filter by ${STATUS_LABEL[s]}`}
          >
            <StatusDot status={s} />
            {STATUS_LABEL[s]}
          </Chip>
        ))}

        <AnimatePresence>
          {activeCount > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              className="flex shrink-0 items-center gap-2 md:ml-auto"
            >
              <span className="text-xs whitespace-nowrap text-muted-foreground tabular-nums">
                {resultCount} of {totalCount}
              </span>
              <Button variant="ghost" size="sm" onClick={onClear} className="h-8 rounded-full text-[13px]">
                <X /> Clear
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
