"use client"

import * as React from "react"

/** Current time, re-rendering every `intervalMs` so relative labels stay fresh. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
