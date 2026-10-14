import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" />
      <p className="relative font-serif text-[9rem] leading-none tracking-tight italic text-gradient md:text-[12rem]">404</p>
      <h1 className="relative mt-2 text-2xl font-semibold tracking-tight">This page isn&apos;t on the schedule</h1>
      <p className="relative mt-2 max-w-sm text-muted-foreground">
        The link may be broken, or the page may have moved.
      </p>
      <div className="relative mt-8 flex gap-3">
        <Button asChild className="rounded-full">
          <Link href="/dashboard">Go to the queue</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  )
}
