import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import type { Review, UserXP } from "../../types";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import { BarChart3, Building2, Calendar, MessageSquare, Trophy, Zap, Crown, Flame } from "lucide-react";

const XP_LEVELS: { min: number; name: string; icon: string }[] = [
  { min: 5000, name: "Top Reviewer", icon: "👑" },
  { min: 2000, name: "Especialista", icon: "🏆" },
  { min: 500, name: "Crítico", icon: "🔥" },
  { min: 100, name: "Avaliador", icon: "⭐" },
  { min: 0, name: "Novato", icon: "🌱" },
];

function levelForXp(xp: number) {
  return XP_LEVELS.find((l) => xp >= l.min) || XP_LEVELS[XP_LEVELS.length - 1];
}

function nextLevelInfo(xp: number) {
  const idx = XP_LEVELS.findIndex((l) => xp >= l.min);
  const current = XP_LEVELS[idx];
  const next = idx > 0 ? XP_LEVELS[idx - 1] : null;
  if (!next) return null;
  const range = current.min - next.min;
  const progress = Math.min(((xp - next.min) / range) * 100, 100);
  return { next, progress, xpNeeded: next.min - xp };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [xpData, setXpData] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.reviews.myReviews(0, 50),
      api.gamification.me().catch(() => null),
    ])
      .then(([r, x]) => {
        setReviews(r.items);
        setTotal(r.total);
        setXpData(x);
      })
      .finally(() => setLoading(false));
  }, []);

  const uniqueCompanies = new Set(reviews.map((r) => r.company_id)).size;
  const myLevel = xpData ? levelForXp(xpData.total_xp) : null;
  const nextLevel = xpData ? nextLevelInfo(xpData.total_xp) : null;

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.quality + r.service + r.price + r.reliability + r.experience) / 5, 0) / reviews.length)
    : 0;

  const stats = [
    {
      icon: <MessageSquare size={16} />,
      label: "Avaliações",
      value: total,
      color: "text-primary",
      bg: "rgba(124,107,255,0.16)",
    },
    {
      icon: <Building2 size={16} />,
      label: "Empresas",
      value: uniqueCompanies,
      color: "text-success",
      bg: "rgba(52,211,153,0.14)",
    },
    {
      icon: <Trophy size={16} />,
      label: "XP total",
      value: xpData ? xpData.total_xp.toLocaleString("pt") : "—",
      color: "text-success",
      bg: "rgba(251,191,36,0.16)",
    },
    {
      icon: <Calendar size={16} />,
      label: "Membro desde",
      value: user?.created_at
        ? new Date(user.created_at).getFullYear()
        : "—",
      color: "text-muted",
      bg: "var(--glass-soft)",
    },
  ];

  return (
    <div className="container" style={{ maxWidth: 896, paddingTop: 24, paddingBottom: 24 }}>
      {/* === PROFILE HERO === */}
      <div className="card p-6 mb-6" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -20, width: 260, height: 260, background: "radial-gradient(circle, rgba(124,107,255,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="flex items-center" style={{ gap: 20, position: "relative" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "var(--gradient-brand)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 0 24px rgba(124,107,255,0.45)",
              color: "#fff",
              fontSize: 26,
              fontWeight: 900,
              flexShrink: 0,
            }}
          >
            {(user?.name || "U")[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>
              {myLevel ? `${myLevel.icon} ${user?.name}` : user?.name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              {user?.email}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {myLevel && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "rgba(124,107,255,0.14)", color: "var(--primary-400)", border: "1px solid rgba(124,107,255,0.3)" }}>
                  {myLevel.icon} {myLevel.name}
                </span>
              )}
              {xpData?.rank_percentile !== null && xpData?.rank_percentile !== undefined && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "rgba(251,191,36,0.12)", color: "#FBBF24", border: "1px solid rgba(251,191,36,0.3)" }}>
                  🔥 Top {xpData.rank_percentile}% avaliadores
                </span>
              )}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        {xpData && (
          <div style={{ marginTop: 20, position: "relative" }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--foreground-soft)", display: "flex", alignItems: "center", gap: 5 }}>
                <Zap size={12} style={{ color: "#FBBF24" }} /> {xpData.total_xp.toLocaleString("pt")} XP
              </span>
              {nextLevel ? (
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {nextLevel.xpNeeded.toLocaleString("pt")} XP para {nextLevel.next.icon} {nextLevel.next.name}
                </span>
              ) : (
                <span style={{ fontSize: 11, color: "#FBBF24", fontWeight: 700 }}>
                  Nível máximo alcançado!
                </span>
              )}
            </div>
            <div style={{ height: 8, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
              <div
                style={{
                  height: "100%",
                  width: `${nextLevel ? nextLevel.progress : 100}%`,
                  background: "linear-gradient(90deg, #7C6BFF, #FBBF24)",
                  borderRadius: 999,
                  transition: "width 0.7s ease",
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* === STATS === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 mb-8" style={{ gap: 12 }}>
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div
              className="flex items-center justify-center mb-3"
              style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, border: "1px solid var(--border)" }}
            >
              <span className={s.color}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--foreground)" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* === BADGES === */}
      {xpData && xpData.badges.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Crown size={15} style={{ color: "#FBBF24" }} />
            Conquistas
          </h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {xpData.badges.map((b) => (
              <div
                key={b.type}
                title={b.description}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--glass-soft)",
                  border: "1px solid var(--border)",
                  fontSize: 12,
                }}
              >
                <span style={{ fontSize: 18 }}>{b.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "var(--foreground)" }}>{b.name}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-2)" }}>{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* === RATING TIMELINE === */}
      {reviews.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <BarChart3 size={15} style={{ color: "var(--primary-400)" }} />
            Linha temporal das suas opiniões
          </h2>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>
            Média das suas avaliações: <b style={{ color: "var(--foreground)" }}>{avgRating.toFixed(1)} / 5</b>
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {reviews.slice(0, 8).map((r) => {
              const stars = Math.round((r.quality + r.service + r.price + r.reliability + r.experience) / 5);
              return (
                <Link
                  key={r.id}
                  to={`/company/${r.company_id}`}
                  className="card card-hover flex items-center justify-between p-4"
                  style={{ background: "var(--glass-soft)", border: "1px solid var(--border)" }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                      {r.company_name || "Empresa"}
                    </div>
                    <div style={{ display: "flex", gap: 1, marginTop: 4 }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} style={{ fontSize: 11, color: j < stars ? "#FBBF24" : "var(--star-empty)" }}>★</span>
                      ))}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--muted-2)" }}>
                    {new Date(r.created_at).toLocaleDateString("pt-PT", { month: "short", year: "numeric" })}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--foreground)", marginBottom: 12 }}>
        Últimas avaliações
      </h2>
      {loading ? (
        <Skeleton className="h-16" count={3} />
      ) : reviews.length === 0 ? (
        <div className="card text-center" style={{ padding: "44px 20px", color: "var(--muted)" }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <MessageSquare size={26} style={{ color: "var(--muted-2)" }} />
          </div>
          <p className="font-semibold" style={{ fontSize: 15, color: "var(--foreground)" }}>Ainda não fez avaliações.</p>
          <p style={{ fontSize: 13, marginTop: 4, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
            Encontre uma empresa, veja o score e dê a sua opinião com estrelas. É simples e ajuda toda a gente.
          </p>
          <Link
            to="/search"
            className="btn btn-primary btn-md"
            style={{ marginTop: 20, boxShadow: "0 4px 14px rgba(124,107,255,0.4)" }}
          >
            Explorar empresas e avaliar
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {reviews.slice(0, 10).map((r) => (
            <Link
              key={r.id}
              to={`/company/${r.company_id}`}
              className="card card-hover flex items-center justify-between p-4"
            >
              <div>
                <span className="text-sm font-semibold" style={{ fontSize: 14, color: "var(--foreground)" }}>
                  {r.company_name || "Empresa"}
                </span>
                <div className="flex mt-1 flex-wrap" style={{ gap: 12, fontSize: 11, color: "var(--muted)" }}>
                  <span>Q:{r.quality}</span>
                  <span>S:{r.service}</span>
                  <span>P:{r.price}</span>
                  <span>R:{r.reliability}</span>
                  <span>E:{r.experience}</span>
                </div>
              </div>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                {new Date(r.created_at).toLocaleDateString("pt-PT")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}