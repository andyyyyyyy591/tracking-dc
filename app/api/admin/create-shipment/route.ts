import { NextResponse } from "next/server";
import { generateTrackingCode } from "@/lib/trucking";
import { supabaseInsertShipment } from "@/lib/supabase-rest";

function authorized(req: Request) {
  const key = req.headers.get("x-admin-key");
  return Boolean(key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY);
}

export async function POST(req: Request) {
  try {
    if (!authorized(req)) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { fecha_inicio, nombre_cliente, telefono_cliente, producto, modelo } =
      await req.json();

    if (!fecha_inicio || !nombre_cliente || !producto || !modelo) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    const codigo_seguimiento = generateTrackingCode();

    await supabaseInsertShipment({
      codigo_seguimiento,
      fecha_inicio,
      nombre_cliente,
      telefono_cliente,
      producto,
      modelo,
    });

    return NextResponse.json({ ok: true, codigo_seguimiento });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
