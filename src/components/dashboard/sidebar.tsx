"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion } from "motion/react"
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FlaskConical,
  LayoutList,
  LogOut,
  PenSquare,
  RotateCcw,
  ServerCrash,
  Inbox,
} from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { PlatformChip } from "@/components/brand/platform-icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { resetDemoData } from "@/lib/mock-api"
import { PLATFORM_LIST } from "@/lib/platforms"
import { usePosts } from "@/lib/posts-store"
import type { PostStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const MAIN_NAV = [
  { href: "/dashboard", label: "Queue", icon: LayoutList },
  { href: "/dashboard/compose", label: "Compose", icon: PenSquare },
]

const VIEWS: { status: PostStatus; label: string; icon: typeof Clock3; tone: string }[] = [
  { status: "scheduled", label: "Scheduled", icon: Clock3, tone: "text-scheduled" },
  { status: "published", label: "Published", icon: CheckCircle2, tone: "text-published" },
  { status: "failed", label: "Needs attention", icon: AlertTriangle, tone: "text-failed" },
]

function NavItem({
  href,
  active,
  children,
  onNavigate,
  layoutGroup,
}: {
  href: string
  active: boolean
  children: React.ReactNode
  onNavigate?: () => void
  layoutGroup: string
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors",
        active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId={`${layoutGroup}-active`}
          className="absolute inset-0 rounded-lg border bg-card shadow-sm"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative flex w-full items-center gap-2.5">{children}</span>
    </Link>
  )
}

function SidebarNav({ onNavigate, layoutGroup }: { onNavigate?: () => void; layoutGroup: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { posts, loadState } = usePosts()
  const activeStatus = searchParams.get("status")
  const hasOtherFilters = searchParams.has("platform") || searchParams.has("q")

  const counts = React.useMemo(() => {
    const c: Record<PostStatus, number> = { scheduled: 0, published: 0, failed: 0 }
    for (const p of posts) c[p.status]++
    return c
  }, [posts])

  const isQueueRoot = pathname === "/dashboard" && !activeStatus && !hasOtherFilters

  return (
    <>
      <nav className="space-y-0.5">
        {MAIN_NAV.map(({ href, label, icon: Icon }) => {
          const active = href === "/dashboard" ? isQueueRoot : pathname.startsWith(href)
          return (
            <NavItem key={href} href={href} active={active} onNavigate={onNavigate} layoutGroup={layoutGroup}>
              <Icon className="size-4" />
              {label}
              {href === "/dashboard" && loadState === "ready" && (
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">{posts.length}</span>
              )}
            </NavItem>
          )
        })}
      </nav>

      <div className="mt-7">
        <p className="mb-2 px-2.5 text-[11px] font-medium tracking-wider text-muted-foreground/80 uppercase">Views</p>
        <nav className="space-y-0.5">
          {VIEWS.map(({ status, label, icon: Icon, tone }) => (
            <NavItem
              key={status}
              href={`/dashboard?status=${status}`}
              active={pathname === "/dashboard" && activeStatus === status && !hasOtherFilters}
              onNavigate={onNavigate}
              layoutGroup={layoutGroup}
            >
              <Icon className={cn("size-4", tone)} />
              {label}
              {loadState === "ready" && (
                <span
                  className={cn(
                    "ml-auto min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums",
                    status === "failed" && counts.failed > 0
                      ? "bg-failed/15 font-medium text-failed"
                      : "text-muted-foreground"
                  )}
                >
                  {counts[status]}
                </span>
              )}
            </NavItem>
          ))}
        </nav>
      </div>
    </>
  )
}

function Channels() {
  return (
    <div className="mt-7">
      <p className="mb-2 px-2.5 text-[11px] font-medium tracking-wider text-muted-foreground/80 uppercase">
        Channels
      </p>
      <ul className="space-y-0.5">
        {PLATFORM_LIST.map((p) => (
          <li key={p.id}>
            <Link
              href={`/dashboard?platform=${p.id}`}
              className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              <PlatformChip platform={p.id} size="sm" />
              <span className="truncate">{p.handle}</span>
              <span className="ml-auto size-1.5 rounded-full bg-published" title="Connected (mock)" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DemoControls() {
  const router = useRouter()
  const go = (query: string) => {
    window.location.href = `/dashboard${query}`
  }
  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card p-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-brand to-brand-2 text-xs font-semibold text-white">
        HO
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">Halcyon Outdoor</p>
        <p className="truncate text-xs text-muted-foreground">Demo workspace</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Demo controls">
            <FlaskConical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-56">
          <DropdownMenuLabel>Demo controls</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => go("?simulate=error")}>
            <ServerCrash /> Simulate API error
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => go("?simulate=empty")}>
            <Inbox /> Simulate empty account
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              resetDemoData()
              go("")
            }}
          >
            <RotateCcw /> Reset demo data
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={signOut}>
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function SidebarContent({ onNavigate, layoutGroup = "sidebar" }: { onNavigate?: () => void; layoutGroup?: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-2">
        <Logo href="/" />
      </div>
      <Button asChild className="mt-3 h-10 w-full justify-start gap-2 rounded-xl shadow-sm">
        <Link href="/dashboard/compose" onClick={onNavigate}>
          <PenSquare /> New post
          <kbd className="ml-auto rounded border border-current/20 px-1.5 font-mono text-[10px] opacity-60">N</kbd>
        </Link>
      </Button>
      <div className="mt-6 flex-1 overflow-y-auto scrollbar-none">
        <React.Suspense fallback={null}>
          <SidebarNav onNavigate={onNavigate} layoutGroup={layoutGroup} />
        </React.Suspense>
        <Channels />
      </div>
      <div className="pt-4">
        <DemoControls />
      </div>
    </div>
  )
}
