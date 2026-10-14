import { cn } from "@/lib/utils"

/** Aceternity UI — Bento Grid. */
export function BentoGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto grid grid-cols-1 gap-4 md:auto-rows-[22rem] md:grid-cols-3", className)}>
      {children}
    </div>
  )
}

export function BentoGridItem({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title: React.ReactNode
  description: React.ReactNode
  header: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group/bento relative row-span-1 flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border bg-card p-4 shadow-sm transition duration-300 hover:shadow-xl hover:shadow-brand/5",
        className
      )}
    >
      <div className="relative flex min-h-36 flex-1 overflow-hidden rounded-xl border bg-muted/40">{header}</div>
      <div className="transition duration-300 group-hover/bento:translate-x-1.5">
        {icon}
        <div className="mt-2 mb-1 font-semibold tracking-tight">{title}</div>
        <div className="text-sm leading-relaxed text-muted-foreground">{description}</div>
      </div>
    </div>
  )
}
