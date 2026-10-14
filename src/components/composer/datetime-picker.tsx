"use client"

import * as React from "react"
import { format, startOfDay } from "date-fns"
import { CalendarDays, Clock, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { combineDateAndTime, quickSlots } from "@/lib/date"
import { cn } from "@/lib/utils"

export function DateTimePicker({
  value,
  onChange,
  invalid,
}: {
  value: Date | null
  onChange: (date: Date) => void
  invalid?: boolean
}) {
  const [open, setOpen] = React.useState(false)
  const time = value ? format(value, "HH:mm") : "09:00"
  const slots = React.useMemo(() => quickSlots(), [])

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[1fr_9rem]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              aria-invalid={invalid}
              className={cn(
                "h-11 justify-start rounded-xl px-3 font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarDays className="text-muted-foreground" />
              {value ? format(value, "EEEE, MMMM d, yyyy") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto rounded-2xl p-0" align="start">
            <Calendar
              mode="single"
              selected={value ?? undefined}
              defaultMonth={value ?? undefined}
              disabled={{ before: startOfDay(new Date()) }}
              onSelect={(day) => {
                if (!day) return
                onChange(combineDateAndTime(day, time))
                setOpen(false)
              }}
              className="rounded-2xl"
            />
          </PopoverContent>
        </Popover>

        <label
          className={cn(
            "relative flex h-11 items-center rounded-xl border bg-background shadow-xs transition-shadow focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/40 dark:bg-input/30",
            invalid && "border-destructive"
          )}
        >
          <Clock className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <span className="sr-only">Time</span>
          <input
            type="time"
            step={300}
            value={time}
            onChange={(e) => {
              if (!e.target.value) return
              onChange(combineDateAndTime(value ?? new Date(), e.target.value))
            }}
            className="h-full w-full bg-transparent pr-3 pl-9 text-sm tabular-nums outline-none [&::-webkit-calendar-picker-indicator]:opacity-0"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Zap className="size-3.5 text-brand" />
        {slots.map((slot) => {
          const active = value?.getTime() === slot.date.getTime()
          return (
            <button
              key={slot.label}
              type="button"
              onClick={() => onChange(slot.date)}
              className={cn(
                "h-7 rounded-full border px-3 text-xs transition-colors",
                active
                  ? "border-brand/50 bg-brand/10 text-brand"
                  : "text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              )}
            >
              {slot.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
