"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Check, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEMO_PASSWORD } from "@/lib/auth"
import { cn } from "@/lib/utils"

import { PasswordChip } from "./copy-password"

type Phase = "idle" | "loading" | "success"

export function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const [password, setPassword] = React.useState("")
  const [visible, setVisible] = React.useState(false)
  const [phase, setPhase] = React.useState<Phase>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const [shakeKey, setShakeKey] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (phase !== "idle") return
    if (!password.trim()) {
      setError("Enter the demo password shown above.")
      setShakeKey((k) => k + 1)
      inputRef.current?.focus()
      return
    }

    setPhase("loading")
    setError(null)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = (await res.json()) as { ok: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Incorrect password.")

      setPhase("success")
      setTimeout(() => {
        router.replace(next)
        router.refresh()
      }, 550)
    } catch (err) {
      setPhase("idle")
      setError(err instanceof Error ? err.message : "Something went wrong.")
      setShakeKey((k) => k + 1)
      inputRef.current?.select()
    }
  }

  return (
    <div className="w-full max-w-sm">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="flex size-11 items-center justify-center rounded-2xl border bg-card shadow-sm">
          <LockKeyhole className="size-5 text-brand" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">
          Welcome <span className="font-serif font-normal italic">back</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a public demo. Use the password below to open the dashboard.
        </p>
      </motion.div>

      {/* The password is intentionally visible above the field */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-7 overflow-hidden rounded-2xl border border-brand/25 bg-brand/[0.06] p-4"
      >
        <div className="pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-brand/20 blur-2xl" />
        <p className="relative text-xs font-medium tracking-wide text-brand uppercase">Demo access</p>
        <p className="relative mt-1 text-sm text-muted-foreground">Anyone can sign in with:</p>
        <PasswordChip
          className="relative mt-3"
          onUse={(value) => {
            setPassword(value)
            setError(null)
            inputRef.current?.focus()
          }}
        />
      </motion.div>

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 space-y-4"
        noValidate
      >
        <div key={shakeKey} className={cn("space-y-2", shakeKey > 0 && "animate-shake")}>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              ref={inputRef}
              id="password"
              name="password"
              type={visible ? "text" : "password"}
              autoComplete="current-password"
              placeholder={`Try "${DEMO_PASSWORD}"`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (error) setError(null)
              }}
              aria-invalid={!!error}
              aria-describedby={error ? "password-error" : undefined}
              className="h-11 rounded-xl pr-11 font-mono"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <AnimatePresence>
            {error && (
              <motion.p
                id="password-error"
                role="alert"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <Button
          type="submit"
          disabled={phase !== "idle"}
          className={cn(
            "h-11 w-full rounded-xl text-[15px] transition-colors disabled:opacity-100",
            phase === "success" && "bg-published text-white hover:bg-published"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2"
            >
              {phase === "idle" && (
                <>
                  Enter dashboard <ArrowRight className="size-4" />
                </>
              )}
              {phase === "loading" && (
                <>
                  <Loader2 className="size-4 animate-spin" /> Checking…
                </>
              )}
              {phase === "success" && (
                <>
                  <Check className="size-4" /> Welcome in
                </>
              )}
            </motion.span>
          </AnimatePresence>
        </Button>
      </motion.form>
    </div>
  )
}
