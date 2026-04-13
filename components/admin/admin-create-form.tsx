"use client"

import { useState } from "react"
import { Loader2, Copy, Check, PackageCheck } from "lucide-react"

const PRODUCTOS = [
  { value: "MOTO",      label: "Moto" },
  { value: "TRICICLO",  label: "Triciclo" },
  { value: "KIT_SOLAR", label: "Kit Solar" },
]

export function AdminCreateForm({ adminKey }: { adminKey: string }) {
  const [nombre,   setNombre]   = useState("")
  const [producto, setProducto] = useState("")
  const [modelo,   setModelo]   = useState("")
  const [fecha,    setFecha]    = useState("")

  const [loading,       setLoading]       = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [copied,        setCopied]        = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setGeneratedCode(null)
    setLoading(true)
    try {
      const res = await fetch("/api/admin/create-shipment", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({
          fecha_inicio: fecha,
          nombre_cliente: nombre,
          telefono_cliente: "-",
          producto,
          modelo,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Error desconocido")
      } else {
        setGeneratedCode(data.codigo_seguimiento)
        setNombre(""); setProducto(""); setModelo(""); setFecha("")
      }
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  function copyCode() {
    if (!generatedCode) return
    navigator.clipboard.writeText(generatedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const labelClass = "block text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2"
  const inputClass = "h-12 w-full rounded-xl border border-border bg-muted/40 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white transition-all"

  /* ── Success screen ── */
  if (generatedCode) {
    return (
      <div className="flex flex-col items-center gap-6 py-2 text-center animate-fade-up">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-2xl"
          style={{
            background: 'color-mix(in oklch, var(--success) 10%, white)',
            border: '1.5px solid color-mix(in oklch, var(--success) 25%, transparent)',
          }}
        >
          <PackageCheck className="h-10 w-10" style={{ color: 'var(--success)' }} />
        </div>

        <div className="space-y-1.5">
          <p className="text-xl font-extrabold text-foreground">¡Pedido creado!</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Compartí este código con el cliente para que pueda rastrear su envío.
          </p>
        </div>

        <div
          className="w-full rounded-2xl border border-border p-5 space-y-4"
          style={{ background: 'color-mix(in oklch, var(--primary) 5%, white)' }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground">
            Código de seguimiento
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex-1 rounded-xl border border-border bg-white px-5 py-4 text-left"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <p className="font-mono text-3xl font-extrabold tracking-[0.2em] text-foreground">
                {generatedCode}
              </p>
            </div>
            <button
              type="button"
              onClick={copyCode}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-white transition-all hover:bg-muted active:scale-95"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              {copied
                ? <Check className="h-5 w-5" style={{ color: 'var(--success)' }} />
                : <Copy className="h-5 w-5 text-muted-foreground" />
              }
            </button>
          </div>
          {copied && (
            <p className="text-xs font-semibold" style={{ color: 'var(--success)' }}>
              ✓ Copiado al portapapeles
            </p>
          )}
        </div>

        <button
          onClick={() => { setGeneratedCode(null); setError(null) }}
          className="w-full h-12 rounded-xl border-2 text-sm font-bold transition-all hover:opacity-80"
          style={{
            borderColor: 'color-mix(in oklch, var(--primary) 30%, transparent)',
            color: 'var(--primary)',
            background: 'color-mix(in oklch, var(--primary) 6%, transparent)',
          }}
        >
          Crear otro pedido
        </button>
      </div>
    )
  }

  /* ── Form ── */
  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      <div>
        <label htmlFor="nombre" className={labelClass}>Nombre del cliente</label>
        <input
          id="nombre" type="text" required
          value={nombre} onChange={(e) => setNombre(e.target.value)}
          placeholder="Juan Pérez" className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="producto" className={labelClass}>Producto</label>
        <select
          id="producto" required
          value={producto} onChange={(e) => setProducto(e.target.value)}
          className={inputClass + " cursor-pointer"}
        >
          <option value="" disabled>Seleccioná un producto…</option>
          {PRODUCTOS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="modelo" className={labelClass}>Modelo</label>
        <input
          id="modelo" type="text" required
          value={modelo} onChange={(e) => setModelo(e.target.value)}
          placeholder="Ej: Honda CB 190, Kuba KM8, Kit SAKO 3kW…"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="fecha" className={labelClass}>Fecha de inicio</label>
        <input
          id="fecha" type="date" required
          value={fecha} onChange={(e) => setFecha(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit" disabled={loading}
        className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}
      >
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando…</> : "Crear pedido"}
      </button>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </form>
  )
}
