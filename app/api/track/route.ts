// app/api/track/route.ts
import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get("code") || "").trim();

    if (!code) {
      return NextResponse.json({ error: "Missing code" }, { status: 400 });
    }

    // Consulta a Supabase REST
    const url = `${SUPABASE_URL}/rest/v1/shipments?codigo_seguimiento=eq.${encodeURIComponent(
      code
    )}&select=*`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SECRET,
        Authorization: `Bearer ${SUPABASE_SECRET}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Supabase error", detail: text },
        { status: 500 }
      );
    }

    const rows = (await res.json()) as any[];

    if (!rows || rows.length === 0) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    // Devolvemos el envío encontrado
    return NextResponse.json({ found: true, shipment: rows[0] }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Server error", detail: String(e?.message || e) },
      { status: 500 }
    );
  }
}
