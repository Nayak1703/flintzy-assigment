"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Plus } from "lucide-react"
import { motion } from "motion/react"

import { Logo } from "@/components/brand/logo"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PostsProvider } from "@/lib/posts-store"

import { SidebarContent } from "./sidebar"

function useNewPostShortcut() {
  const router = useRouter()
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const typing = target?.closest("input, textarea, [contenteditable=true], [role=dialog]")
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === "n" || e.key === "N") {
        e.preventDefault()
        router.push("/dashboard/compose")
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router])
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = React.useState(false)
  const pathname = usePathname()
  useNewPostShortcut()

  return (
    <PostsProvider>
      <div className="relative min-h-dvh bg-background">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar px-3 pt-2 pb-3 lg:block">
          <SidebarContent />
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar px-3 pt-2 pb-3" showCloseButton={false}>
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setMenuOpen(false)} layoutGroup="sheet" />
            </SheetContent>
          </Sheet>
          <Logo href="/dashboard" />
          <ThemeToggle />
        </header>

        <main className="lg:pl-64">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile floating compose button */}
        {pathname !== "/dashboard/compose" && (
          <Button
            asChild
            size="icon-lg"
            className="fixed right-5 bottom-5 z-30 size-14 rounded-full shadow-xl shadow-brand/20 lg:hidden"
          >
            <Link href="/dashboard/compose" aria-label="New post">
              <Plus className="size-6" />
            </Link>
          </Button>
        )}
      </div>
    </PostsProvider>
  )
}
