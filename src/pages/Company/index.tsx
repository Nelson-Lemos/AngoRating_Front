import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Shield, ArrowLeft, Star, MessageSquare, TrendingUp, Award, MapPin, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";
import type { Company, Review, DistributionData, ScoreHistory } from "../../types";
import ScoreRing from "../../components/ScoreRing";
import TrendIndicator from "../../components/TrendIndicator";
import RatingInput from "../../components/rating/RatingInput";
import ReviewVoteBar from "../../components/rating/ReviewVoteBar";
import PostRatingModal from "../../components/rating/PostRatingModal";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../contexts/AuthContext";
import Skeleton from "../../components/ui/Skeleton";
import { CompanyGraphic, CompanyBanner } from "../../components/BrandAssets";

const CRITERIA = [
  { key: "quality_score" as const, label: "Qualidade", color: "#8b7bff" },
  { key: "service_score" as const, label: "Atendimento", color: "#34d399" },
  { key: "price_score" as const, label: "Preço", color: "#fbbf24" },
  { key: "reliability_score" as const, label: "Confiabilidade", color: "#38bdf8" },
  { key: "experience_score" as const, label: "Experiência", color: "#f472b6" },
];

const CRITERIA_META: Record<string, string> = {
  quality_score: "Qualidade dos produtos e serviços",
  service_score: "Simpatia e eficácia do atendimento",
  price_score: "Relação preço/qualidade",
  reliability_score: "Cumprimento de promessas",
  experience_score: "Experiência global do cliente",
};

function scoreLabel(s: number) {
  if (s >= 90) return "Excelente";
  if (s >= 75) return "Muito bom";
  if (s >= 60) return "Bom";
  if (s >= 40) return "Razoável";
  return "Fraco";
}

function scoreColor(s: number) {
  if (s >= 80) return "#34D399";
  if (s >= 60) return "#A3E635";
  if (s >= 40) return "#FBBF24";
  return "#FB7185";
}

export default function CompanyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [history, setHistory] = useState<ScoreHistory[]>([]);
  const [distribution, setDistribution] = useState<DistributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    quality: 3, service: 3, price: 3, reliability: 3, experience: 3,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [isReRating, setIsReRating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.companies.get(id),
      api.reviews.list(id),
      api.score.history(id),
      api.reviews.distribution(id).catch(() => null),
    ])
      .then(([c, r, h, d]) => {
        setCompany(c);
        setReviews(r.items);
        setHistory(h.items);
        setDistribution(d);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (searchParams.get("rate") === "1" && isAuthenticated && !reviewModalOpen) {
      setReviewModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, isAuthenticated, reviewModalOpen, setSearchParams]);

  function openRating() {
    setFormError("");
    setIsReRating(hasReviewed);
    if (isAuthenticated) {
      setReviewModalOpen(true);
    } else {
      navigate("/login", { state: { from: `/company/${id}?rate=1` } });
    }
  }

  async function handleReview() {
    if (!id) return;
    setSubmitting(true);
    setFormError("");
    try {
      await api.reviews.create(id, reviewForm, { mode: isReRating ? "update" : "new" });
      setSubmitted(true);
      const [c, r, d] = await Promise.all([
        api.companies.get(id),
        api.reviews.list(id),
        api.reviews.distribution(id).catch(() => null),
      ]);
      setCompany(c);
      setReviews(r.items);
      setDistribution(d);
    } catch (e: any) {
      setFormError(e.message || "Não foi possível guardar a avaliação.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmittedContinue() {
    setReviewModalOpen(false);
    setSubmitted(false);
    setShowComparison(true);
  }

  if (loading) {
    return (
      <div className="container container-lg" style={{ paddingTop: 28, paddingBottom: 28 }}>
        <Skeleton className="h-6 w-24 mb-6" />
        <Skeleton className="h-56 mb-5" />
        <Skeleton className="h-40 mb-5" />
        <Skeleton className="h-28" count={2} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container container-lg text-center" style={{ padding: "72px 16px", color: "var(--muted)" }}>
        <p className="text-sm">Empresa não encontrada.</p>
      </div>
    );
  }

  const avgCriteria = CRITERIA.reduce((acc, { key }) => acc + (company[key] ?? 0), 0) / CRITERIA.length;
  const hasReviewed = user ? reviews.some((r) => r.user_id === user.id) : false;

  return (
    <div className="container container-lg" style={{ paddingTop: 28, paddingBottom: 28 }}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center"
        style={{ gap: 6, fontSize: 13, fontWeight: 500, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 22, transition: "color 0.15s ease" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary-400)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      {/* === BANNER HERO: imagem real da empresa === */}
      <CompanyBanner name={company.name} img={null} />

      {/* === HEADER: Empresa + AngoScore === */}
      <div className="card p-6 mb-5" style={{ boxShadow: "var(--shadow-card-hover)", position: "relative", overflow: "hidden", marginTop: 14 }}>
        <div style={{ position: "absolute", top: -80, right: -40, width: 340, height: 340, background: "radial-gradient(circle, rgba(124,107,255,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="flex flex-col sm:flex-row items-start" style={{ gap: 24, position: "relative" }}>
          {/* Logo + info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center" style={{ gap: 16, marginBottom: 12 }}>
              <CompanyGraphic
                name={company.name}
                size={64}
                radius={18}
                img={null}
              />
              <div>
                <div className="flex items-center" style={{ gap: 9, flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "var(--foreground)", lineHeight: 1.15 }}>
                    {company.name}
                  </h1>
                  {company.is_verified && (
                    <span
                      title="Empresa verificada"
                      style={{ color: "#38BDF8", display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(56,189,248,0.14)", border: "1px solid rgba(56,189,248,0.3)", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}
                    >
                      <CheckCircle2 size={12} /> Verificada
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-wrap" style={{ gap: 10, marginTop: 8 }}>
                  {company.category_name && (
                    <span className="cat-chip" style={{ fontSize: 12, padding: "4px 12px" }}>
                      {company.category_name}
                    </span>
                  )}
                  {company.location_name && (
                    <span className="flex items-center" style={{ gap: 5, fontSize: 12, color: "var(--muted)" }}>
                      <MapPin size={13} /> {company.location_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {company.description && (
              <p className="leading-relaxed" style={{ fontSize: 14, color: "var(--muted)", marginTop: 6, maxWidth: 600 }}>{company.description}</p>
            )}
          </div>

          {/* AngoScore - hero */}
          <div className="flex flex-col items-center sm:items-end flex-shrink-0" style={{ gap: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 2 }}>AngoScore</div>
            <div className="flex items-center" style={{ gap: 18 }}>
              <ScoreRing score={company.score} size={92} strokeWidth={8} />
              <div className="text-right">
                <div className="font-semibold" style={{ fontSize: 14, color: scoreColor(company.score) }}>
                  {scoreLabel(company.score)}
                </div>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <TrendIndicator value={null} size="md" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === STATS BAR === */}
      <div className="grid grid-cols-3 mb-5" style={{ gap: 14 }}>
        <div className="stat-card text-center">
          <div className="stat-value">{company.total_reviews.toLocaleString("pt")}</div>
          <div className="stat-label">Avaliações</div>
        </div>
        <div className="stat-card text-center">
          <div className="stat-value">{Math.round(avgCriteria)}</div>
          <div className="stat-label">Média geral</div>
        </div>
        <div className="stat-card text-center">
          <div
            className="stat-value"
            style={{
              color: company.confidence_level === "HIGH" ? "#34D399" : company.confidence_level === "MEDIUM" ? "#FBBF24" : "var(--muted)",
            }}
          >
            {company.confidence_level === "HIGH" ? "Alta" : company.confidence_level === "MEDIUM" ? "Média" : "Baixa"}
          </div>
          <div className="stat-label">Confiança dos dados</div>
        </div>
      </div>

      {/* === CRITÉRIOS === */}
      <div className="card p-6 mb-5">
        <h3 className="section-title mb-4" style={{ marginBottom: 20 }}>
          <Award size={14} style={{ color: "var(--primary-400)" }} />
          Critérios de avaliação
        </h3>
        <div className="space-y-5">
          {CRITERIA.map(({ key, label, color }) => {
            const val = company[key] ?? 0;
            return (
              <div key={key}>
                <div className="flex items-center justify-between" style={{ marginBottom: 7 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground-soft)" }}>{label}</span>
                    <span style={{ fontSize: 11, color: "var(--muted-2)", marginLeft: 8 }}>{CRITERIA_META[key]}</span>
                  </div>
                  <span className="font-bold" style={{ fontSize: 14, color: "var(--foreground)" }}>{Math.round(val)}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${val}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}66` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* === HISTÓRICO (chart) === */}
      {history.length > 0 && (
        <div className="card p-6 mb-5">
          <h3 className="section-title" style={{ marginBottom: 20 }}>
            <TrendingUp size={14} style={{ color: "var(--primary-400)" }} />
            Performance
          </h3>
          <div className="chart-bars" style={{ height: 150 }}>
            {history.slice().reverse().map((h, i) => (
              <div key={h.id} className="chart-bar">
                <div
                  className="w-full"
                  style={{
                    height: `${Math.max((h.score / 100) * 100, 4)}px`,
                    background: `linear-gradient(180deg, ${scoreColor(h.score)}, ${scoreColor(h.score)}55)`,
                    opacity: 0.7 + (i / history.length) * 0.3,
                    borderTopLeftRadius: 7,
                    borderTopRightRadius: 7,
                    transition: "height 0.5s ease",
                    boxShadow: `0 0 12px ${scoreColor(h.score)}44`,
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3" style={{ fontSize: 10, color: "var(--muted-2)", fontWeight: 500 }}>
            <span>{history.length > 0 ? new Date(history[0].created_at).toLocaleDateString("pt-PT", { month: "short" }) : ""}</span>
            <span>{history.length > 1 ? new Date(history[history.length - 1].created_at).toLocaleDateString("pt-PT", { month: "short" }) : ""}</span>
          </div>
        </div>
      )}

      {/* === BOTÃO AVALIAR + AVALIAÇÕES === */}
      <div className="mb-5">
        {!isAuthenticated && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--primary-50)",
              border: "1px solid rgba(124,107,255,0.35)",
              borderRadius: "var(--radius-lg)",
              padding: "14px 16px",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--gradient-brand)",
                color: "#fff",
              }}
            >
              <Star size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-semibold" style={{ fontSize: 14, color: "var(--foreground)" }}>
                Quer dar a sua opinião?
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                Entre ou crie uma conta grátis — demora menos de 1 minuto.
              </div>
            </div>
            <Button size="sm" variant="primary" onClick={() => navigate("/login", { state: { from: `/company/${id}?rate=1` } })}>
              Avaliar agora
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="section-title">
            <MessageSquare size={14} style={{ color: "var(--primary-400)" }} />
            Avaliações ({reviews.length})
          </div>
          {isAuthenticated && hasReviewed ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                className="badge badge-success badge-md"
                style={{ display: "inline-flex", alignItems: "center", gap: 5 }}
              >
                <CheckCircle2 size={12} /> Já avaliou
              </span>
              <Button size="md" variant="secondary" onClick={openRating}>
                Atualizar opinião
              </Button>
            </div>
          ) : (
            <Button
              size="md"
              variant={isAuthenticated ? "primary" : "secondary"}
              onClick={openRating}
            >
              <Star size={14} /> Avaliar
            </Button>
          )}
        </div>
        {reviews.length === 0 ? (
          <div className="card text-center" style={{ padding: "48px 0", color: "var(--muted)" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <MessageSquare size={22} style={{ color: "var(--muted-2)" }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground-soft)" }}>Nenhuma avaliação ainda.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Seja o primeiro a avaliar esta empresa.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => {
              const stars = Math.round((r.quality + r.service + r.price + r.reliability + r.experience) / 5);
              return (
                <div key={r.id} className="card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center" style={{ gap: 10 }}>
                      <div
                        className="flex items-center justify-center"
                        style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--gradient-brand)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, fontWeight: 800 }}
                      >
                        {(r.user_name || "A")[0].toUpperCase()}
                      </div>
                      <span className="font-semibold" style={{ fontSize: 14, color: "var(--foreground)" }}>
                        {r.user_name || "Anónimo"}
                      </span>
                    </div>
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <span className="font-bold" style={{ fontSize: 16, color: scoreColor(stars * 20) }}>
                        {stars}
                      </span>
                      <div className="flex items-center" style={{ gap: 1, color: "#FBBF24" }}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={13}
                            fill={j < stars ? "#FBBF24" : "var(--star-empty)"}
                            color={j < stars ? "#FBBF24" : "var(--star-empty)"}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap" style={{ gap: 10, fontSize: 12, color: "var(--muted)" }}>
                    {[
                      ["Qualidade", r.quality],
                      ["Atendimento", r.service],
                      ["Preço", r.price],
                      ["Confiab.", r.reliability],
                      ["Experiência", r.experience],
                    ].map(([label, value]) => (
                      <span key={label as string} style={{ background: "var(--surface-2)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 999 }}>
                        <b style={{ color: "var(--foreground-soft)" }}>{value}</b> {label}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 12 }}>
                    {new Date(r.created_at).toLocaleDateString("pt-PT")}
                  </div>
                  <ReviewVoteBar
                    reviewId={r.id}
                    reviewUserId={r.user_id}
                    initialAgree={r.agree_count || 0}
                    initialDisagree={r.disagree_count || 0}
                    initialComments={r.comment_count || 0}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal
        open={reviewModalOpen}
        onClose={() => { setReviewModalOpen(false); setSubmitted(false); setFormError(""); }}
        title="Avaliar Empresa"
        size="md"
      >
        {submitted ? (
          <div className="text-center" style={{ padding: "36px 0" }}>
            <div className="flex items-center justify-center mx-auto mb-4" style={{ width: 62, height: 62, borderRadius: "50%", background: "var(--success-light)", border: "1px solid rgba(52,211,153,0.3)" }}>
              <Star size={28} className="text-success fill-success" />
            </div>
            <h3 className="font-semibold mb-1" style={{ fontSize: 16, color: "var(--foreground)" }}>Avaliação registrada!</h3>
            <p className="text-sm" style={{ fontSize: 13, color: "var(--muted)" }}>Obrigado pela sua contribuição.</p>
            <button
              onClick={handleSubmittedContinue}
              className="btn btn-primary"
              style={{ marginTop: 18, padding: "10px 22px", fontSize: 13 }}
            >
              Ver como a comunidade avalia
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--primary-50)",
                border: "1px solid rgba(124,107,255,0.3)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                marginBottom: 14,
              }}
            >
              <Award size={16} style={{ color: "var(--primary-400)", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "var(--foreground-soft)", lineHeight: 1.4 }}>
                Toque nas estrelas: <b>1</b> estrela = fraco, <b>5</b> estrelas = ótimo.
              </span>
            </div>
            <div className="space-y-3">
              <RatingInput label="Qualidade" value={reviewForm.quality} onChange={(v) => setReviewForm((f) => ({ ...f, quality: v }))} />
              <RatingInput label="Atendimento" value={reviewForm.service} onChange={(v) => setReviewForm((f) => ({ ...f, service: v }))} />
              <RatingInput label="Preço" value={reviewForm.price} onChange={(v) => setReviewForm((f) => ({ ...f, price: v }))} />
              <RatingInput label="Confiabilidade" value={reviewForm.reliability} onChange={(v) => setReviewForm((f) => ({ ...f, reliability: v }))} />
              <RatingInput label="Experiência" value={reviewForm.experience} onChange={(v) => setReviewForm((f) => ({ ...f, experience: v }))} />
              {formError && (
                <p style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, color: "var(--danger)", background: "var(--danger-light)", border: "1px solid rgba(251,113,133,0.3)" }}>
                  {formError}
                </p>
              )}
              <Button onClick={handleReview} disabled={submitting} block className="mt-4">
                {submitting ? "A enviar..." : "Enviar avaliação"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <PostRatingModal
        open={showComparison}
        companyName={company?.name || ""}
        userVote={Math.round((reviewForm.quality + reviewForm.service + reviewForm.price + reviewForm.reliability + reviewForm.experience) / 5)}
        average={company?.score ? (company.score / 20) : 0}
        communityAgreement={distribution?.community_agreement ?? null}
        percentile={null}
        onClose={() => setShowComparison(false)}
      />
    </div>
  );
}
