function must(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

const SUPABASE_URL = must("SUPABASE_URL");
const SUPABASE_SECRET = must("SUPABASE_SERVICE_ROLE_KEY");

export async function supabaseInsertShipment(payload: {
  codigo_seguimiento: string;
  fecha_inicio: string; // YYYY-MM-DD
  nombre_cliente: string;
  telefono_cliente?: string;
  producto: string;
  modelo: string;
}) {
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
