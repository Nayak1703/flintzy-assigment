"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { MotionConfig } from "motion/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  )
}
