import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import type { Review, UserProgress } from "../../types";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";
import { BarChart3, Building2, Calendar, MessageSquare, Trophy, CheckCircle2, Clock3, Camera } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.reviews.myReviews(0, 50),
      api.feed.myProgress().catch(() => null),
    ])
      .then(([r, p]) => {
        setReviews(r.items);
        setTotal(r.total);
        setProgress(p);
      })
      .catch((reason: unknown) => {
        setLoadError(reason instanceof Error ? reason.message : "Não foi possível carregar as avaliações.");
      })
      .finally(() => setLoading(false));
  }, []);

  const uniqueCompanies = new Set(reviews.map((r) => r.company_id)).size;
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
      label: "Reputação",
      value: progress ? progress.reputation.score.toLocaleString("pt") : "—",
      color: "text-success",
      bg: "rgba(52,211,153,0.14)",
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
              {user?.name}
            </h1>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
              {user?.email}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {progress && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "rgba(124,107,255,0.14)", color: "var(--primary-400)", border: "1px solid rgba(124,107,255,0.3)" }}>
                  {progress.reputation.level}
                </span>
              )}
              {progress && (
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: "rgba(52,211,153,0.12)", color: "#34D399", border: "1px solid rgba(52,211,153,0.3)" }}>
                  {progress.reputation.open_signals} sinais em análise
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Reputação real */}
        {progress && (
          <div style={{ marginTop: 20, position: "relative", fontSize: 12, color: "var(--muted)" }}>
            Nível de reputação: <strong style={{ color: "var(--foreground)" }}>{progress.reputation.level}</strong>
            {" · "}{progress.reviews.published} avaliações publicadas
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

      {/* === CONTRIBUIÇÕES === */}
      {progress && (
        <div className="card p-5 mb-6">
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={15} style={{ color: "#34D399" }} />
            Estado das contribuições
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 12 }}>
            <div><CheckCircle2 size={14} /><div>{progress.reviews.published} publicadas</div></div>
            <div><Clock3 size={14} /><div>{progress.reviews.pending} em análise</div></div>
            <div><Trophy size={14} /><div>{progress.contributions.approved} contribuições aprovadas</div></div>
            <div><Camera size={14} /><div>{progress.photos_approved} fotos aprovadas</div></div>
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
      ) : loadError ? (
        <div className="card text-center" style={{ padding: "44px 20px", color: "var(--danger)" }}>
          <p className="font-semibold">{loadError}</p>
        </div>
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