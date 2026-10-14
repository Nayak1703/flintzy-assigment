import type { Metadata } from "next"

import { Composer } from "@/components/composer/composer"

export const metadata: Metadata = { title: "Compose" }

export default function ComposePage() {
  return <Composer />
}
