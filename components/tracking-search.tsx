"use client"

import { useState } from "react"
import { Search, Loader2 } from "lucide-react"

type Shipment = {
  codigo_seguimiento: string
  fecha_inicio: string
  nombre_cliente?: string | null
  producto?: string | null
  modelo?: string | null
}

export function TrackingSearch({
  onResult,
}: {
  onResult: (shipment: Shipment | null) => void
}) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function search() {
    const clean = code.trim().toUpperCase()
    if (!clean) return
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/track?code=${encodeURIComponent(clean)}`)
      const data = await res.json()

      if (data?.found && data?.shipment) {
        onResult(data.shipment as Shipment)
      } else {
        onResult(null)
        setError("No encontramos ese código. Verificá e intentá de nuevo.")
      }
    } catch {
      onResult(null)
      setError("Error al consultar. Intentá de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="flex overflow-hidden rounded-2xl border border-border bg-card"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06)' }}
      >
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="TDC-A4F8X2"
            className="h-14 w-full bg-transparent pl-12 pr-4 font-mono text-base font-semibold tracking-widest text-foreground placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <button
          onClick={search}
          disabled={loading || !code.trim()}
          className="flex h-14 shrink-0 items-center gap-2 bg-primary px-7 text-sm font-bold text-white transition-all hover:bg-[var(--primary-dark)] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  )
}
