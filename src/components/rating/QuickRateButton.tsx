import React, { useState, useEffect } from "react";
import { Zap, Star, X, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { CompanyGraphic } from "../BrandAssets";
import type { Company, Category, DistributionData } from "../../types";
import { useAuth } from "../../contexts/AuthContext";
import { categoryIcon, categoryColor } from "../CategoryIcons";

export default function QuickRateButton() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deque, setDeque] = useState<Company[]>([]);
  const [current, setCurrent] = useState<Company | null>(null);
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [justRated, setJustRated] = useState<{ company: Company; vote: number; distribution: DistributionData | null } | null>(null);
  const [ratedCount, setRatedCount] = useState(0);

  useEffect(() => {
    if (open && categories.length === 0) {
      api.categories.list().then((r) => {
        setCategories(r.items);
        if (r.items.length > 0) {
          setActiveCategory(r.items[0].id);
        }
      }).catch(() => {});
    }
  }, [open, categories.length]);

  useEffect(() => {
    if (activeCategory) {
      setLoading(true);
      api.companies.list({ category_id: activeCategory, limit: 50 })
        .then((r) => {
          setFilteredCompanies(r.items.sort(() => Math.random() - 0.5));
        })
        .finally(() => setLoading(false));
    }
  }, [activeCategory]);

  function handleOpen() {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setOpen(true);
    setActiveCategory(null);
    setDeque([]);
    setCurrent(null);
    setRating(0);
    setJustRated(null);
    setRatedCount(0);
    setCompanies([]);
    setFilteredCompanies([]);
  }

  function startRating() {
    if (!activeCategory || filteredCompanies.length === 0) return;
    const remaining = filteredCompanies.filter((c) => c.id !== (justRated?.company.id ?? null));
    const shuffled = remaining.length > 0 ? remaining : filteredCompanies;
    setDeque(shuffled);
    setCurrent(shuffled[0] || null);
    setRating(0);
    setJustRated(null);
  }

  function nextCompany() {
    if (deque.length <= 1) {
      // cycle again
      const shuffled = filteredCompanies.filter((c) => c.id !== (justRated?.company.id ?? null));
      setDeque(shuffled);
      setCurrent(shuffled[0] || null);
    } else {
      const [, ...rest] = deque;
      setDeque(rest);
      setCurrent(rest[0] || null);
    }
    setRating(0);
    setJustRated(null);
  }

  async function handleSubmit() {
    if (!current || rating === 0) return;
    setSubmitting(true);
    try {
      const q = rating, s = rating, p = rating, r2 = rating, e = rating;
      await api.reviews.create(current.id, {
        quality: q, service: s, price: p, reliability: r2, experience: e,
      }, { mode: "new" });
      let distribution: DistributionData | null = null;
      try {
        distribution = await api.reviews.distribution(current.id);
      } catch {
        // silent
      }
      setJustRated({ company: current, vote: rating, distribution });
      setRatedCount((c) => c + 1);
      setRating(0);
    } catch {
      // Já avaliou esta empresa — avança para a próxima
      if (deque.length <= 1) {
        const shuffled = filteredCompanies.filter((c) => c.id !== current.id);
        setDeque(shuffled);
        setCurrent(shuffled[0] || filteredCompanies[0] || null);
      } else {
        const [, ...rest] = deque;
        setDeque(rest);
        setCurrent(rest[0] || null);
      }
      setRating(0);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "var(--gradient-brand)",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 28px rgba(124,107,255,0.55)",
          zIndex: 45,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.boxShadow = "0 12px 36px rgba(124,107,255,0.65)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 28px rgba(124,107,255,0.55)";
        }}
        title="Avaliar agora"
        aria-label="Avaliar agora"
      >
        <Zap size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-backdrop"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              className="modal-panel modal-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={18} style={{ color: "var(--primary-400)" }} />
                  <span style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)" }}>
                    {current ? "Rating rápido" : justRated ? "" : "Avaliar agora"}
                  </span>
                </div>
                <button className="modal-close" onClick={() => setOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body">
                {/* STEP 1: choose category */}
                {!current && !justRated && (
                  <div>
                    <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 14 }}>
                      O que você quer avaliar? Escolha uma categoria:
                    </p>
                    {categories.length === 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="skeleton" style={{ height: 52, borderRadius: "var(--radius-md)" }} />
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {categories.map((cat) => {
                          const cc = categoryColor(cat.slug);
                          return (
                            <button
                              key={cat.id}
                              onClick={() => setActiveCategory(cat.id)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "11px 14px",
                                borderRadius: "var(--radius-md)",
                                background: activeCategory === cat.id ? "rgba(124,107,255,0.14)" : "var(--glass-soft)",
                                border: activeCategory === cat.id ? "1px solid rgba(124,107,255,0.4)" : "1px solid var(--border)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                fontSize: 13,
                                fontWeight: 600,
                                color: "var(--foreground)",
                                textAlign: "left",
                              }}
                            >
                              <span style={{ color: cc, fontSize: 17 }}>{categoryIcon(cat.slug)}</span>
                              {cat.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    <div style={{ marginTop: 16 }}>
                      <button
                        onClick={startRating}
                        disabled={!activeCategory || filteredCompanies.length === 0}
                        className="btn btn-primary"
                        style={{ width: "100%", padding: "11px", fontSize: 13 }}
                      >
                        {loading ? "A carregar..." : "⚡ Rating rápido"}
                      </button>
                      {activeCategory && filteredCompanies.length === 0 && !loading && (
                        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 8 }}>
                          Sem empresas nesta categoria ainda.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: swipe-style rating */}
                {current && (
                  <div>
                    <div style={{ textAlign: "center", marginBottom: 18 }}>
                      <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
                        • {ratedCount} avaliados • {current.category_name || ""}
                      </div>
                    </div>

                    <motion.div
                      key={current.id + (justRated?.company.id === current.id ? "-rated" : "")}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        padding: "16px",
                        borderRadius: "var(--radius-lg)",
                        background: "var(--glass-soft)",
                        border: "1px solid var(--border)",
                        marginBottom: 18,
                      }}
                    >
                      <CompanyGraphic name={current.name} size={52} radius={14} img={null} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--foreground)" }}>
                          {current.name}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>
                          ⭐ {current.score.toFixed(1)} · {current.total_reviews.toLocaleString("pt")} avaliações
                        </div>
                        {current.location_name && (
                          <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>
                            {current.location_name}
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {justRated && justRated.company.id === current.id ? (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          padding: "14px",
                          borderRadius: "var(--radius-lg)",
                          background: "var(--primary-50)",
                          border: "1px solid rgba(124,107,255,0.3)",
                          marginBottom: 16,
                        }}
                      >
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#FBBF24" }}>{"★".repeat(justRated.vote)}</span>
                          Avaliação registrada!
                        </div>
                        {justRated.distribution && (
                          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                            Média da comunidade: <b style={{ color: "var(--foreground)" }}>{justRated.distribution.average.toFixed(1)}</b> estrelas
                            {justRated.distribution.community_agreement !== null && (
                              <> · <b style={{ color: "var(--primary-400)" }}>{justRated.distribution.community_agreement}%</b> concorda consigo</>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <>
                        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRating(star)}
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: 4,
                                transition: "transform 0.15s ease",
                                transform: star <= rating ? "scale(1.12)" : "scale(1)",
                              }}
                            >
                              <Star
                                size={30}
                                fill={star <= rating ? "#FBBF24" : "var(--star-empty)"}
                                color={star <= rating ? "#FBBF24" : "var(--star-empty)"}
                              />
                            </button>
                          ))}
                        </div>
                        {rating > 0 && (
                          <div style={{ textAlign: "center", marginBottom: 14, fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                            {rating === 1 && "Fraco"}
                            {rating === 2 && "Razoável"}
                            {rating === 3 && "Bom"}
                            {rating === 4 && "Muito bom"}
                            {rating === 5 && "Excelente"}
                          </div>
                        )}
                      </>
                    )}

                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() => setCurrent(null)}
                        className="btn btn-secondary"
                        style={{ flex: 1, padding: "10px 16px", fontSize: 13 }}
                      >
                        Trocar sector
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || submitting || Boolean(justRated && justRated.company.id === current.id)}
                        className="btn btn-primary"
                        style={{ flex: 2, padding: "10px 16px", fontSize: 13 }}
                      >
                        {submitting ? "A enviar..." : "Publicar"}
                      </button>
                      {justRated && justRated.company.id === current.id ? (
                        <button
                          onClick={nextCompany}
                          className="btn btn-secondary"
                          style={{ flex: 1, padding: "10px 16px", fontSize: 13 }}
                        >
                          Próxima →
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}