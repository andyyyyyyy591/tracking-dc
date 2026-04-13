export async function supabaseInsertShipment(payload: {
  codigo_seguimiento: string;
  fecha_inicio: string;
  nombre_cliente: string;
  telefono_cliente?: string;
  producto: string;
  modelo: string;
}) {
  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SUPABASE_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/shipments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_SECRET,
      Authorization: `Bearer ${SUPABASE_SECRET}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ trucking_number: "", ...payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Supabase insert failed");
  }
}
