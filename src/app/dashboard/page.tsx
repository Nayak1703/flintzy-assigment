import { Suspense } from "react"

import { QueueView } from "@/components/dashboard/queue-view"
import { QueueSkeleton } from "@/components/dashboard/queue-states"

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-10">
          <QueueSkeleton />
        </div>
      }
    >
      <QueueView />
    </Suspense>
  )
}
