import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards"

import { SectionHeading } from "./section-heading"

// Fictional testimonials for the demo product.
const ROW_ONE = [
  {
    quote: "We moved four tools into one queue. Monday planning went from two hours to twenty minutes.",
    name: "Maya Fernandes",
    title: "Social Lead, Northwind Bakery",
  },
  {
    quote: "The per-platform character counters alone have saved us from so many truncated X posts.",
    name: "Daniel Okafor",
    title: "Content Manager, Loop Studio",
  },
  {
    quote: "Seeing exactly why a post failed — and retrying in one click — is the feature I didn't know I needed.",
    name: "Aiko Tanaka",
    title: "Founder, Kumo Ceramics",
  },
  {
    quote: "Our team works across three time zones. Cadence is the first scheduler where nobody gets it wrong.",
    name: "Lucas Moreau",
    title: "Head of Brand, Atelier Nord",
  },
]

const ROW_TWO = [
  {
    quote: "It's the calmest piece of software in our stack. Our interns learned it in an afternoon.",
    name: "Priya Raman",
    title: "Marketing Director, Tidewater",
  },
  {
    quote: "Shareable filtered views mean I just send a link: 'here's everything failing on TikTok'.",
    name: "Jonah Weiss",
    title: "Growth, Fieldnotes",
  },
  {
    quote: "Dark mode is genuinely beautiful. I schedule everything at 11 PM and my eyes thank me.",
    name: "Sofia Alvarez",
    title: "Creator, @sofiacooks",
  },
  {
    quote: "Compose once, preview everywhere. That's the whole pitch, and it delivers.",
    name: "Ethan Brooks",
    title: "Agency Owner, Brightside",
  },
]

export function Testimonials() {
  return (
    <section id="love" className="relative scroll-mt-24 overflow-hidden py-24 md:py-32">
      <div className="px-5">
        <SectionHeading
          eyebrow="Loved by small teams"
          title={
            <>
              Social teams <span className="font-serif font-normal italic text-gradient">exhale</span> a little.
            </>
          }
        />
      </div>
      <div className="mt-12 flex flex-col items-center gap-2">
        <InfiniteMovingCards items={ROW_ONE} speed="slow" />
        <InfiniteMovingCards items={ROW_TWO} speed="slow" direction="right" />
      </div>
    </section>
  )
}
