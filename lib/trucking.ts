export type ProductType = "MOTO" | "TRICICLO" | "KIT_SOLAR"

export type Stage = {
  key: string
  label: string
  description: string
  fromDay: number
}

export const PRODUCT_LABELS: Record<ProductType, string> = {
  MOTO: "Moto",
  TRICICLO: "Triciclo",
  KIT_SOLAR: "Kit Solar",
}

export const STAGES: Record<ProductType, Stage[]> = {
  MOTO: [
    {
      key: "confirmed",
      label: "Pedido confirmado",
      fromDay: 0,
      description:
        "Tu pedido fue registrado y el pago confirmado. Estamos coordinando el proceso de exportación.",
    },
    {
      key: "title",
      label: "Proceso de título",
      fromDay: 6,
      description:
        "Estamos gestionando la documentación y el título de la moto para habilitar la exportación.",
    },
    {
      key: "ready",
      label: "Listo para despacho",
      fromDay: 16,
      description:
        "La documentación está completa. Tu pedido está siendo preparado para salir.",
    },
    {
      key: "transit",
      label: "En tránsito",
      fromDay: 22,
      description:
        "Tu pedido está en camino. El traslado marítimo tiene una duración aproximada de 5 días.",
    },
    {
      key: "customs",
      label: "Proceso aduanal",
      fromDay: 27,
      description:
        "Tu pedido llegó a destino y se encuentra en proceso de revisión y despacho aduanal.",
    },
    {
      key: "delivery",
      label: "Listo para entregar",
      fromDay: 70,
      description:
        "Tu pedido completó el proceso aduanal y está listo. Nos comunicaremos para coordinar la entrega.",
    },
  ],

  TRICICLO: [
    {
      key: "confirmed",
      label: "Pedido confirmado",
      fromDay: 0,
      description:
        "Tu pedido fue registrado y el pago confirmado. Estamos coordinando el proceso de exportación.",
    },
    {
      key: "title",
      label: "Proceso de título",
      fromDay: 7,
      description:
        "Estamos gestionando la documentación y el título del triciclo para habilitar la exportación.",
    },
    {
      key: "prep",
      label: "Preparación técnica",
      fromDay: 20,
      description:
        "El triciclo está siendo inspeccionado, configurado y empacado con los estándares requeridos para el traslado internacional.",
    },
    {
      key: "ready",
      label: "Listo para despacho",
      fromDay: 30,
      description:
        "La documentación está completa. El triciclo está siendo preparado para salir.",
    },
    {
      key: "transit",
      label: "En tránsito",
      fromDay: 38,
      description:
        "Tu triciclo está en camino. El traslado marítimo tiene una duración aproximada de 5 días.",
    },
    {
      key: "customs",
      label: "Proceso aduanal",
      fromDay: 43,
      description:
        "Tu triciclo llegó a destino y se encuentra en proceso de revisión y despacho aduanal.",
    },
    {
      key: "coordinating",
      label: "Coordinando entrega",
      fromDay: 110,
      description:
        "El triciclo fue liberado de aduana. Estamos coordinando la logística de entrega a domicilio.",
    },
    {
      key: "delivery",
      label: "Listo para entregar",
      fromDay: 120,
      description:
        "Tu triciclo completó todo el proceso y está listo. Nos comunicaremos para confirmar la entrega.",
    },
  ],

  KIT_SOLAR: [
    {
      key: "confirmed",
      label: "Pedido confirmado",
      fromDay: 0,
      description:
        "Tu pedido fue registrado y el pago confirmado. Estamos preparando tu kit solar.",
    },
    {
      key: "prep",
      label: "Preparación del kit",
      fromDay: 5,
      description:
        "Estamos ensamblando y verificando todos los componentes de tu kit: paneles, inversor, baterías y cableado.",
    },
    {
      key: "ready",
      label: "Listo para despacho",
      fromDay: 12,
      description: "El kit está completo y documentado. Listo para salir.",
    },
    {
      key: "transit",
      label: "En tránsito",
      fromDay: 15,
      description: "Tu pedido está en camino.",
    },
    {
      key: "customs",
      label: "Proceso aduanal",
      fromDay: 20,
      description:
        "Tu pedido llegó a destino y se encuentra en proceso de revisión y despacho aduanal.",
    },
    {
      key: "delivery",
      label: "Listo para entregar",
      fromDay: 50,
      description:
        "Tu pedido completó el proceso aduanal y está listo. Nos comunicaremos para coordinar la entrega.",
    },
  ],
}

export function daysSince(fechaInicio: string): number {
  const [y, m, d] = fechaInicio.split("-").map(Number)
  const startUTC = Date.UTC(y, m - 1, d)
  const now = new Date()
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.max(0, Math.floor((todayUTC - startUTC) / 86400000))
}

export function getCurrentStageIndex(producto: ProductType, days: number): number {
  const stages = STAGES[producto]
  let current = 0
  for (let i = 0; i < stages.length; i++) {
    if (days >= stages[i].fromDay) current = i
  }
  return current
}

export function resolveProduct(
  producto: string | null | undefined,
  codigo: string | null | undefined
): ProductType {
  // 1. Si tiene el campo producto definido, usarlo
  if (producto === "MOTO" || producto === "TRICICLO" || producto === "KIT_SOLAR") return producto

  // 2. Detectar por prefijo del código (códigos viejos)
  const code = (codigo || "").toUpperCase()
  if (code.startsWith("KIT"))  return "KIT_SOLAR"
  if (code.startsWith("TRIC")) return "TRICICLO"
  if (code.startsWith("MOT"))  return "MOTO"

  // 3. Fallback
  return "MOTO"
}

export function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = "TDC-"
  for (let i = 0; i < 6; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}
