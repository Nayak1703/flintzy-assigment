import { Logo } from "@/components/brand/logo"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Logo />
          <p className="text-sm text-muted-foreground">Compose once. Schedule everywhere.</p>
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
          <a href="/login" className="hover:text-foreground">
            Demo
          </a>
        </nav>
        <p className="text-xs text-muted-foreground">
          A frontend demo — all data is mocked. © {new Date().getFullYear()} Cadence
        </p>
      </div>
      <div className="pointer-events-none overflow-hidden select-none" aria-hidden>
        <p className="translate-y-[28%] text-center font-serif text-[22vw] leading-none tracking-tight text-foreground/[0.04] italic">
          Cadence
        </p>
      </div>
    </footer>
  )
}
