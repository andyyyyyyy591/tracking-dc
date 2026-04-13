"use client"

import { useState } from "react"
import Link from "next/link"
import { AdminCreateForm } from "@/components/admin/admin-create-form"
import { LogOut, LayoutList, ShieldCheck, ArrowLeft } from "lucide-react"

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("")
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isAuthed = !!adminKey

  async function login() {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/list-shipments", {
        headers: { "x-admin-key": input.trim() },
        cache: "no-store",
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        setError("Contraseña incorrecta.")
      } else {
        setAdminKey(input.trim())
        setInput("")
      }
    } catch {
      setError("Error de conexión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-20 w-full border-b border-border/70 bg-white/95 backdrop-blur-md"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)' }}
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-70">
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
                Administración
              </p>
            </div>
          </Link>

          {isAuthed && (
            <div className="flex items-center gap-2">
              <Link
                href="/admin/pedidos"
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <LayoutList className="h-3.5 w-3.5" />
                Ver pedidos
              </Link>
              <button
                onClick={() => { setAdminKey(""); setInput(""); setError(null) }}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
              >
                <LogOut className="h-3.5 w-3.5" />
                Salir
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-14">
        <div className="w-full max-w-md">
          {!isAuthed ? (
            /* ── LOGIN ── */
            <div className="flex flex-col gap-8 animate-fade-up">
              <div className="flex flex-col items-center gap-4 text-center">
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: 'color-mix(in oklch, var(--primary) 10%, white)',
                    border: '1.5px solid color-mix(in oklch, var(--primary) 20%, transparent)',
                    boxShadow: '0 4px 16px color-mix(in oklch, var(--primary) 15%, transparent)',
                  }}
                >
                  <ShieldCheck className="h-8 w-8" style={{ color: 'var(--primary)' }} />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                    Acceso de administrador
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Ingresá la contraseña para gestionar los pedidos.
                  </p>
                </div>
              </div>

              <div
                className="rounded-2xl border border-border bg-card p-7 space-y-5"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.07)' }}
              >
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && login()}
                    placeholder="••••••••••••"
                    className="h-12 w-full rounded-xl border border-border bg-muted/40 px-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:bg-white transition-all"
                    style={{ '--tw-ring-color': 'var(--primary)' } as React.CSSProperties}
                  />
                </div>

                <button
                  onClick={login}
                  disabled={loading || !input.trim()}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)' }}
                >
                  {loading ? "Verificando…" : "Ingresar"}
                </button>

                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            /* ── FORMULARIO ── */
            <div className="flex flex-col gap-8 animate-fade-up">
              <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Crear pedido
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  El código de seguimiento se genera automáticamente al confirmar.
                </p>
              </div>

              <div
                className="rounded-2xl border border-border bg-card p-7"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.07)' }}
              >
                <AdminCreateForm adminKey={adminKey} />
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="w-full border-t border-border/60 bg-card/60 px-6 py-6">
        <p className="text-center text-xs font-light tracking-wide text-muted-foreground">
          © 2025 Tracking DC · Todos los derechos reservados
        </p>
      </footer>
    </div>
  )
}
