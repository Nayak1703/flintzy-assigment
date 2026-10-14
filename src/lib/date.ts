import {
  addDays,
  format,
  isSameYear,
  isToday,
  isTomorrow,
  isYesterday,
  startOfDay,
} from "date-fns"

import type { Post } from "./types"

export interface DayGroup {
  key: string
  label: string
  /** Secondary label, e.g. "Wed, Oct 14" next to "Today" */
  sublabel: string
  isPast: boolean
  posts: Post[]
}

function dayLabel(day: Date) {
  if (isToday(day)) return "Today"
  if (isTomorrow(day)) return "Tomorrow"
  if (isYesterday(day)) return "Yesterday"
  return format(day, "EEEE")
}

function daySublabel(day: Date) {
  return format(day, isSameYear(day, new Date()) ? "MMM d" : "MMM d, yyyy")
}

/**
 * Groups posts by their local calendar day.
 * Upcoming days (today onwards) come first in chronological order,
 * followed by past days, most recent first.
 */
export function groupPostsByDay(posts: Post[], now = new Date()): DayGroup[] {
  const today = startOfDay(now).getTime()
  const map = new Map<number, Post[]>()

  for (const post of posts) {
    const day = startOfDay(new Date(post.scheduledAt)).getTime()
    const list = map.get(day)
    if (list) list.push(post)
    else map.set(day, [post])
  }

  const days = [...map.keys()]
  const upcoming = days.filter((d) => d >= today).sort((a, b) => a - b)
  const past = days.filter((d) => d < today).sort((a, b) => b - a)

  return [...upcoming, ...past].map((day) => {
    const date = new Date(day)
    return {
      key: String(day),
      label: dayLabel(date),
      sublabel: daySublabel(date),
      isPast: day < today,
      posts: map
        .get(day)!
        .slice()
        .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt)),
    }
  })
}

export function formatTime(iso: string) {
  return format(new Date(iso), "h:mm a")
}

export function formatFull(iso: string) {
  return format(new Date(iso), "EEE, MMM d, yyyy 'at' h:mm a")
}

export function localTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function timeZoneAbbr(date = new Date()) {
  return (
    new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? ""
  )
}

/** Combine a calendar date and an "HH:mm" string into a local Date. */
export function combineDateAndTime(date: Date, time: string) {
  const [h, m] = time.split(":").map(Number)
  const result = new Date(date)
  result.setHours(h || 0, m || 0, 0, 0)
  return result
}

export function quickSlots(now = new Date()) {
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000)
  inOneHour.setMinutes(Math.ceil(inOneHour.getMinutes() / 15) * 15, 0, 0)

  const tomorrowMorning = addDays(startOfDay(now), 1)
  tomorrowMorning.setHours(9, 0, 0, 0)

  const daysUntilMonday = ((8 - now.getDay()) % 7) || 7
  const nextMonday = addDays(startOfDay(now), daysUntilMonday)
  nextMonday.setHours(10, 0, 0, 0)

  return [
    { label: "In 1 hour", date: inOneHour },
    { label: "Tomorrow, 9 AM", date: tomorrowMorning },
    { label: "Next Monday, 10 AM", date: nextMonday },
  ]
}
