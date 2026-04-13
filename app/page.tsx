"use client"

import { useState } from "react"
import { TrackingSearch } from "@/components/tracking-search"
import { TrackingStatusCard } from "@/components/tracking-status-card"
import { TrackingTimeline } from "@/components/tracking-timeline"

type Shipment = {
  codigo_seguimiento: string
  fecha_inicio: string
  nombre_cliente?: string | null
  producto?: string | null
  modelo?: string | null
}

export default function Home() {
  const [shipment, setShipment] = useState<Shipment | null>(null)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 w-full border-b border-border/70 bg-white/95 backdrop-blur-md"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}
            >
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                <rect x="9" y="11" width="14" height="10" rx="2" />
                <circle cx="12" cy="20" r="1" /><circle cx="20" cy="20" r="1" />
              </svg>
            </div>
            <div>
              <p className="text-base font-extrabold leading-none tracking-tight text-foreground">
                Tracking DC
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Seguimiento de envíos
              </p>
            </div>
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold"
              style={{
                color: 'var(--primary)',
                borderColor: 'color-mix(in oklch, var(--primary) 30%, transparent)',
                background: 'color-mix(in oklch, var(--primary) 8%, transparent)',
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
              En línea
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative w-full overflow-hidden border-b border-border/60 py-16 sm:py-20 flex-1"
        style={{
          background: 'linear-gradient(180deg, color-mix(in oklch, var(--primary) 6%, white) 0%, white 100%)',
        }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'color-mix(in oklch, var(--primary) 10%, transparent)' }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-2xl"
          style={{ background: 'color-mix(in oklch, var(--primary) 7%, transparent)' }}
        />

        <div className="relative mx-auto flex max-w-xl flex-col items-center gap-8 px-6 text-center">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
            style={{
              color: 'var(--primary)',
              borderColor: 'color-mix(in oklch, var(--primary) 25%, transparent)',
              background: 'color-mix(in oklch, var(--primary) 8%, white)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            Rastreo en tiempo real
          </span>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              Rastreá tu envío
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              Ingresá tu código de seguimiento para ver el estado actual de tu pedido.
            </p>
          </div>

          <div className="w-full">
            <TrackingSearch onResult={(s) => setShipment(s)} />
          </div>

          <p className="text-xs text-muted-foreground">
            Ejemplo: <span className="font-mono font-semibold tracking-wider text-foreground/60">TDC-A4F8X2</span>
          </p>
        </div>
      </section>

      {/* ── Results ── */}
      {shipment && (
        <main className="mx-auto w-full max-w-xl flex-1 px-6 py-10">
          <div className="flex flex-col gap-5 animate-fade-up">
            <TrackingStatusCard shipment={shipment} />

            <div
              className="overflow-hidden rounded-2xl border border-border bg-card"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
                  Historial del envío
                </p>
                <div
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                  style={{
                    background: 'color-mix(in oklch, var(--primary) 10%, transparent)',
                    color: 'var(--primary)',
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                  En curso
                </div>
              </div>
              <div className="px-6 py-7">
                <TrackingTimeline shipment={shipment} />
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── Footer ── */}
      <footer className="w-full border-t border-border/60 bg-card/60 px-6 py-6">
        <p className="text-center text-xs font-light tracking-wide text-muted-foreground">
          © 2025 Tracking DC · Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
