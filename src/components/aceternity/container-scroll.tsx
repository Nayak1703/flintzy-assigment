"use client"

import { motion, useScroll, useTransform } from "motion/react"
import * as React from "react"

/** Aceternity UI — Container Scroll Animation. The card tilts flat as you scroll into it. */
export function ContainerScroll({ header, children }: { header: React.ReactNode; children: React.ReactNode }) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)")
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const rotate = useTransform(scrollYProgress, [0.1, 0.45], [22, 0])
  const scale = useTransform(scrollYProgress, [0.1, 0.45], isMobile ? [0.85, 0.95] : [1.04, 1])
  const translate = useTransform(scrollYProgress, [0.1, 0.45], [0, -60])

  return (
    <div ref={containerRef} className="relative flex items-center justify-center px-2 py-10 md:px-10 md:py-20">
      <div className="relative w-full" style={{ perspective: "1000px" }}>
        <motion.div style={{ translateY: translate }} className="mx-auto max-w-5xl text-center">
          {header}
        </motion.div>
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="mx-auto -mt-6 w-full max-w-6xl rounded-[28px] border-4 border-foreground/10 bg-foreground/[0.04] p-2 md:p-3"
        >
          <div className="h-full w-full overflow-hidden rounded-[20px] border bg-background">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
