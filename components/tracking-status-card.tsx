import { User, Package, Tag, MapPin } from "lucide-react"
import {
  PRODUCT_LABELS,
  STAGES,
  daysSince,
  getCurrentStageIndex,
  resolveProduct,
} from "@/lib/trucking"

type Shipment = {
  codigo_seguimiento: string
  nombre_cliente?: string | null
  fecha_inicio: string
  producto?: string | null
  modelo?: string | null
}

/* Status badge color per stage key */
function getStageBadgeStyle(key: string) {
  if (key === "delivery")
    return "bg-emerald-50 text-emerald-700 border-emerald-200"
  if (key === "transit")
    return "bg-blue-50 text-blue-700 border-blue-200"
  if (key === "customs")
    return "bg-amber-50 text-amber-700 border-amber-200"
  return "bg-teal-50 text-teal-700 border-teal-200"
}

export function TrackingStatusCard({ shipment }: { shipment: Shipment }) {
  const producto = resolveProduct(shipment.producto, shipment.codigo_seguimiento)
  const productoLabel = PRODUCT_LABELS[producto]
  const days = daysSince(shipment.fecha_inicio)
  const stages = STAGES[producto]
  const currentIndex = getCurrentStageIndex(producto, days)
  const currentStage = stages[currentIndex]
  const totalStages = stages.length
  const progressPct = Math.round((currentIndex / (totalStages - 1)) * 100)
  const badgeClass = getStageBadgeStyle(currentStage.key)

  return (
    <div
      className="w-full overflow-hidden rounded-2xl border border-border bg-card animate-fade-up"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.07)' }}
    >
      {/* Gradient header — Cubamax style */}
      <div
        className="px-6 py-5"
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/65">
              Número de seguimiento
            </p>
            <p className="mt-1 font-mono text-2xl font-extrabold tracking-[0.15em] text-white sm:text-3xl">
              {shipment.codigo_seguimiento}
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Progress bar inside header */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium text-white/60">
            <span>Progreso</span>
            <span>Paso {currentIndex + 1} / {totalStages}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: `${Math.max(progressPct, 5)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="divide-y divide-border/60">
        {/* Current status */}
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Estado actual
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {currentStage.label}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${badgeClass}`}
          >
            En proceso
          </span>
        </div>

        {/* Client */}
        <div className="flex items-center gap-3 px-6 py-4">
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Cliente
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {shipment.nombre_cliente || "—"}
            </p>
          </div>
        </div>

        {/* Product */}
        <div className="flex items-center gap-3 px-6 py-4">
          <Tag className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Producto
            </p>
            <p className="mt-0.5 text-sm font-semibold text-foreground">
              {productoLabel}
              {shipment.modelo && (
                <span className="ml-1.5 font-normal text-muted-foreground">
                  · {shipment.modelo}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
