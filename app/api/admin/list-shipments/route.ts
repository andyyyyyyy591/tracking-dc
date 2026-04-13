import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const ADMIN_KEY = process.env.ADMIN_KEY!;
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const incoming = req.headers.get("x-admin-key");
  if (!ADMIN_KEY || incoming !== ADMIN_KEY) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const url = `${SUPABASE_URL}/rest/v1/shipments?select=*&order=fecha_inicio.desc`;

  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_SECRET,
      Authorization: `Bearer ${SUPABASE_SECRET}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ error: "Error Supabase", detail: text }, { status: 500 });
  }

  const rows = await res.json();
  return NextResponse.json({ ok: true, rows });
}
