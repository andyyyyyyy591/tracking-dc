"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PRODUCT_LABELS, daysSince, getCurrentStageIndex, STAGES, resolveProduct } from "@/lib/trucking";

type Row = {
  codigo_seguimiento: string;
  nombre_cliente: string | null;
  telefono_cliente: string | null;
  fecha_inicio: string;
  producto: string | null;
  modelo: string | null;
};

function getStageLabel(row: Row): string {
  const producto = resolveProduct(row.producto);
  const days = daysSince(row.fecha_inicio);
  const index = getCurrentStageIndex(producto, days);
  return STAGES[producto][index].label;
}

export default function AdminPedidosPage() {
  const [password, setPassword] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("admin_key") || "" : ""
  );
  const [isAuthed, setIsAuthed] = useState(() =>
    typeof window !== "undefined" ? !!localStorage.getItem("admin_key") : false
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function loginAndLoad() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin/list-shipments", {
        method: "GET",
        headers: { "x-admin-key": password },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setIsAuthed(false);
        setRows([]);
        setMsg(data?.error || "Contraseña incorrecta.");
        return;
      }

      localStorage.setItem("admin_key", password);
      setIsAuthed(true);
      setRows(data.rows || []);
      setMsg(null);
    } catch {
      setMsg("Error de conexión.");
      setIsAuthed(false);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("admin_key");
    setPassword("");
    setIsAuthed(false);
    setRows([]);
    setQ("");
    setMsg(null);
  }

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) => {
      const hay = [
        r.codigo_seguimiento,
        r.nombre_cliente,
        r.telefono_cliente,
        r.producto,
        r.modelo,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(s);
    });
  }, [q, rows]);

  const inputClass =
    "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors";

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-border/60 px-6 py-4">
        <div>
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-70"
          >
            Tracking DC
          </Link>
          <p className="text-xs text-muted-foreground">Panel de administración</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            Crear pedido
          </Link>
          {isAuthed && (
            <button
              onClick={logout}
              className="rounded-lg border border-border px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 py-8 space-y-6 max-w-7xl w-full mx-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pedidos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isAuthed ? `${filtered.length} pedido${filtered.length !== 1 ? "s" : ""} encontrado${filtered.length !== 1 ? "s" : ""}` : "Iniciá sesión para ver los pedidos."}
          </p>
        </div>

        {!isAuthed ? (
          <div className="max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <h2 className="text-base font-semibold text-foreground">Iniciar sesión</h2>

            <div className="space-y-2">
              <input
                type="password"
                className={inputClass}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loginAndLoad()}
                placeholder="Contraseña de administrador"
              />
            </div>

            <button
              onClick={loginAndLoad}
              disabled={loading || !password.trim()}
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Verificando…" : "Entrar"}
            </button>

            {msg && (
              <p className="text-sm text-destructive">{msg}</p>
            )}
          </div>
        ) : (
          <>
            {/* Search + refresh bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <input
                className={inputClass + " flex-1"}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por código, nombre, teléfono, producto o modelo…"
              />
              <button
                onClick={loginAndLoad}
                disabled={loading}
                className="shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-60"
              >
                {loading ? "Actualizando…" : "Actualizar"}
              </button>
              {msg && <p className="text-sm text-destructive">{msg}</p>}
            </div>

            {/* Table */}
            <div className="overflow-auto rounded-2xl border border-border/60 shadow-sm">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="bg-muted/40 border-b border-border/60">
                  <tr className="text-left">
                    {[
                      "Código",
                      "Nombre",
                      "Producto",
                      "Modelo",
                      "Teléfono",
                      "Fecha inicio",
                      "Estado actual",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-border/60">
                  {filtered.map((r) => {
                    const producto = resolveProduct(r.producto, r.codigo_seguimiento);
                    const productoLabel = PRODUCT_LABELS[producto];
                    const stageLabel = getStageLabel(r);

                    return (
                      <tr
                        key={r.codigo_seguimiento}
                        className="bg-card transition-colors hover:bg-muted/30"
                      >
                        <td className="px-4 py-3 font-mono font-semibold text-foreground whitespace-nowrap">
                          {r.codigo_seguimiento}
                        </td>
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {r.nombre_cliente || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {productoLabel}
                        </td>
                        <td className="px-4 py-3 text-foreground">
                          {r.modelo || "—"}
                        </td>
                        <td className="px-4 py-3 text-foreground whitespace-nowrap">
                          {r.telefono_cliente || "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {r.fecha_inicio}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary whitespace-nowrap">
                            {stageLabel}
                          </span>
                        </td>
                      </tr>
                    );
                  })}

                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td
                        className="px-4 py-8 text-center text-muted-foreground"
                        colSpan={7}
                      >
                        No hay resultados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-border/60 px-6 py-5">
        <p className="text-center text-xs font-light tracking-wide text-muted-foreground">
          © 2025 Tracking DC · Todos los derechos reservados
        </p>
      </footer>
    </div>
  );
}
