"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  STAGES,
  daysSince,
  getCurrentStageIndex,
  type ProductType,
} from "@/lib/trucking"

type Shipment = {
  fecha_inicio: string
  producto?: string | null
}

function resolveProduct(raw: string | null | undefined): ProductType {
  if (raw === "MOTO" || raw === "TRICICLO" || raw === "KIT_SOLAR") return raw
  return "MOTO"
}

export function TrackingTimeline({ shipment }: { shipment: Shipment }) {
  const producto = resolveProduct(shipment.producto)
  const days = daysSince(shipment.fecha_inicio)
  const stages = STAGES[producto]
  const currentIndex = getCurrentStageIndex(producto, days)

  return (
    <div className="relative flex flex-col">
      {/* Vertical background line spanning all steps */}
      <div
        className="absolute left-[15px] top-4 bottom-4 w-0.5 rounded-full"
        style={{ background: 'var(--border)' }}
      />
      {/* Filled line up to current step */}
      <div
        className="absolute left-[15px] top-4 w-0.5 rounded-full transition-all duration-700"
        style={{
          background: 'var(--success)',
          height: currentIndex === 0
            ? '0px'
            : `calc(${(currentIndex / (stages.length - 1)) * 100}% - 1rem)`,
        }}
      />

      <div className="flex flex-col gap-0">
        {stages.map((stage, index) => {
          const isCompleted = index < currentIndex
          const isCurrent   = index === currentIndex
          const isFuture    = index > currentIndex
          const isLast      = index === stages.length - 1

          return (
            <div key={stage.key} className="flex gap-5">
              {/* ── Left: node ── */}
              <div className="relative z-10 flex shrink-0 flex-col items-center">
                {/* Pulse ring (current only) */}
                {isCurrent && (
                  <span
                    className="absolute top-0.5 h-8 w-8 rounded-full animate-ping"
                    style={{ background: 'var(--primary)', opacity: 0.2 }}
                  />
                )}

                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted && "border-transparent",
                    isCurrent  && "border-transparent shadow-lg",
                    isFuture   && "border-border bg-card"
                  )}
                  style={{
                    backgroundColor: isCompleted
                      ? 'var(--success)'
                      : isCurrent
                        ? 'var(--primary)'
                        : undefined,
                    boxShadow: isCurrent
                      ? '0 0 0 4px color-mix(in oklch, var(--primary) 20%, transparent)'
                      : undefined,
                  }}
                >
                  {isCompleted ? (
                    <Check
                      className="h-4 w-4 text-white"
                      strokeWidth={3}
                    />
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-bold",
                        isCurrent && "text-white",
                        isFuture  && "text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Right: content ── */}
              <div className={cn("flex-1 pb-7", isLast && "pb-0")}>
                {/* Stage label row */}
                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <p
                    className={cn(
                      "text-sm font-bold leading-tight",
                      isCompleted && "text-foreground",
                      isCurrent  && "text-foreground",
                      isFuture   && "text-muted-foreground font-medium"
                    )}
                  >
                    {stage.label}
                  </p>
                  {isCompleted && (
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        background: 'var(--success-light)',
                        color: 'var(--success)',
                        borderColor: 'color-mix(in oklch, var(--success) 25%, transparent)',
                      }}
                    >
                      Completado
                    </span>
                  )}
                  {isCurrent && (
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide animate-pulse"
                      style={{
                        background: 'color-mix(in oklch, var(--primary) 10%, transparent)',
                        color: 'var(--primary)',
                        borderColor: 'color-mix(in oklch, var(--primary) 30%, transparent)',
                      }}
                    >
                      En curso
                    </span>
                  )}
                </div>

                {/* Current stage description card */}
                {isCurrent && (
                  <div
                    className="mt-3 rounded-xl px-4 py-3.5 text-sm leading-relaxed text-foreground/80"
                    style={{
                      background: 'color-mix(in oklch, var(--primary) 7%, white)',
                      border: '1px solid color-mix(in oklch, var(--primary) 18%, transparent)',
                    }}
                  >
                    {stage.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
