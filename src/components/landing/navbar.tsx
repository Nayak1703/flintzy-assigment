"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react"
import { ArrowRight, Menu, X } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#love", label: "Customers" },
]

/** Resizable floating navbar — becomes a compact glass pill after scrolling. */
export function Navbar() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [hovered, setHovered] = React.useState<string | null>(null)

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40))

  return (
    <header className="sticky top-0 z-40 px-3 pt-3">
      <motion.nav
        animate={{
          maxWidth: scrolled ? 860 : 1240,
          y: scrolled ? 4 : 0,
        }}
        transition={{ type: "spring", stiffness: 220, damping: 30 }}
        className={cn(
          "mx-auto flex h-14 items-center justify-between rounded-full border px-3 pl-4 transition-[background-color,box-shadow,border-color] duration-300",
          scrolled
            ? "border-border bg-background/75 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
        <Logo />

        <div className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              className="relative px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {hovered === link.href && (
                <motion.span
                  layoutId="nav-hover"
                  className="absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" variant="ghost" className="hidden rounded-full sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="group hidden rounded-full sm:inline-flex">
            <Link href="/login">
              Open app
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-2 max-w-[860px] rounded-3xl border bg-background/95 p-3 shadow-xl backdrop-blur-xl md:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-accent"
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="mt-2 w-full rounded-2xl">
              <Link href="/login">Open the app</Link>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
