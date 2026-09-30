import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";
import { Shield, Users, Building2, Star, AlertTriangle } from "lucide-react";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"stats" | "users" | "reports">("stats");

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      api.admin.stats(),
      api.admin.users(0, 50),
      api.admin.reports(undefined, 0, 50),
    ])
      .then(([s, u, r]) => {
        setStats(s);
        setUsers(u.items);
        setReports(r.items);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container text-center" style={{ maxWidth: 896, padding: "64px 16px", color: "var(--muted)" }}>
        <Shield size={32} className="mx-auto mb-3" style={{ color: "var(--muted-2)" }} />
        <p className="text-sm font-medium">Acesso restrito a administradores.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container" style={{ maxWidth: 896, paddingTop: 24, paddingBottom: 24 }}>
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-32 mb-6" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const statCards = [
    { icon: <Users size={16} />, label: "Utilizadores", value: stats.total_users, color: "text-primary", bg: "rgba(124,107,255,0.16)" },
    { icon: <Building2 size={16} />, label: "Empresas", value: stats.total_companies, color: "text-success", bg: "rgba(52,211,153,0.14)" },
    { icon: <Star size={16} />, label: "Avaliações", value: stats.total_reviews, color: "text-warning", bg: "rgba(251,191,36,0.14)" },
    { icon: <AlertTriangle size={16} />, label: "Denúncias", value: stats.pending_reports, color: "text-danger", bg: "rgba(251,113,133,0.14)" },
    { icon: <Shield size={16} />, label: "Categorias", value: stats.total_categories, color: "text-muted", bg: "var(--glass-soft)" },
    { icon: <Building2 size={16} />, label: "Localizações", value: stats.total_locations, color: "text-muted", bg: "var(--glass-soft)" },
  ];

  return (
    <div className="container" style={{ maxWidth: 896, paddingTop: 24, paddingBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)", marginBottom: 20 }}>Admin</h1>

      <div className="tab-bar">
        {(["stats", "users", "reports"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "tab-btn tab-btn-active" : "tab-btn"}
          >
            {t === "stats"
              ? "Visão Geral"
              : t === "users"
              ? "Utilizadores"
              : "Denúncias"}
          </button>
        ))}
      </div>

      {tab === "stats" && stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3" style={{ gap: 12 }}>
          {statCards.map((s) => (
            <Card key={s.label} className="p-4">
              <div
                className="flex items-center justify-center mb-3"
                style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, border: "1px solid var(--border)" }}
              >
                <span className={s.color}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--foreground)" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      {tab === "users" && (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="card flex items-center justify-between p-4" style={{ flexWrap: "wrap", gap: 12 }}>
              <div className="flex items-center" style={{ gap: 12 }}>
                <div className="flex items-center justify-center" style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--gradient-brand)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 800 }}>
                  {u.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <span className="font-semibold block" style={{ fontSize: 14, color: "var(--foreground)" }}>
                    {u.name}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{u.email}</span>
                </div>
                <span
                  className="font-semibold"
                  style={{
                    fontSize: 10,
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: u.role === "ADMIN" ? "var(--warning-light)" : "var(--glass-soft)",
                    color: u.role === "ADMIN" ? "#FBBF24" : "var(--muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {u.role}
                </span>
              </div>
              <Button
                size="sm"
                variant={u.is_active ? "danger" : "secondary"}
                onClick={async () => {
                  await api.admin.toggleUserActive(u.id);
                  setUsers((prev) =>
                    prev.map((x) =>
                      x.id === u.id ? { ...x, is_active: !x.is_active } : x
                    )
                  );
                }}
              >
                {u.is_active ? "Bloquear" : "Ativar"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {tab === "reports" && (
        <div className="space-y-2">
          {reports.length === 0 ? (
            <div className="card text-center" style={{ padding: "48px 0", color: "var(--muted)" }}>
              <AlertTriangle size={24} className="mx-auto mb-2" style={{ color: "var(--muted-2)" }} />
              <p className="text-sm font-medium" style={{ fontSize: 14 }}>Nenhuma denúncia pendente.</p>
            </div>
          ) : (
            reports.map((r) => (
              <div key={r.id} className="card p-4" style={{ flexWrap: "wrap" }}>
                <div className="flex items-center justify-between" style={{ flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <span className="font-semibold" style={{ fontSize: 14, color: "var(--foreground)" }}>
                      {r.reason}
                    </span>
                    {r.description && (
                      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                        {r.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      await api.admin.resolveReport(r.id);
                      setReports((prev) => prev.filter((x) => x.id !== r.id));
                    }}
                  >
                    Resolver
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
