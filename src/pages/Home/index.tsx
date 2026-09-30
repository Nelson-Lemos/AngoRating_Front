import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, TrendingUp, ChevronRight, ArrowRight, Star, Flame, MessageSquare, PenLine } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import type { RankingItem, Category, FeedReview, NeedsReviewsItem, Contributor } from "../../types";
import { categoryIcon, categoryColor } from "../../components/CategoryIcons";
import CompanyVisualCard from "../../components/company/CompanyVisualCard";
import LiveActivity from "../../components/feed/LiveActivity";
import EventSpotlight from "../../components/feed/EventSpotlight";
import TopReviewers from "../../components/gamification/TopReviewers";
import RisingCard from "../../components/ranking/RisingCard";
import { useAuth } from "../../contexts/AuthContext";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [top, setTop] = useState<RankingItem[]>([]);
  const [recent, setRecent] = useState<RankingItem[]>([]);
  const [mostRated, setMostRated] = useState<RankingItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [liveReviews, setLiveReviews] = useState<FeedReview[]>([]);
  const [needsReviews, setNeedsReviews] = useState<NeedsReviewsItem[]>([]);
  const [reviewers, setReviewers] = useState<Contributor[]>([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function loadHome() {
      const results = await Promise.allSettled([
        api.rankings.top({ limit: 10 }),
        api.rankings.recent({ limit: 8 }),
        api.rankings.mostRated({ limit: 5 }),
        api.categories.list(),
        api.feed.get(20),
        api.feed.contributors(5),
      ]);
      const [topResult, recentResult, mostRatedResult, categoriesResult, feedResult, contributorsResult] = results;
      if (topResult.status === "fulfilled") setTop(topResult.value.items);
      if (recentResult.status === "fulfilled") setRecent(recentResult.value.items);
      if (mostRatedResult.status === "fulfilled") setMostRated(mostRatedResult.value.items);
      if (categoriesResult.status === "fulfilled") setCategories(categoriesResult.value.items);
      if (feedResult.status === "fulfilled") {
        setLiveReviews(feedResult.value.recent_reviews);
        setNeedsReviews(feedResult.value.needs_reviews);
      }
      if (contributorsResult.status === "fulfilled") setReviewers(contributorsResult.value.items);
    }
    void loadHome();
  }, []);

  return (
    <div className="min-h-content">
      {/* HERO v3 — ação rápida */}
      <div className="hero-section">
        <div style={{ position: "absolute", top: "-25%", right: "-5%", width: 520, height: 520, background: "radial-gradient(circle, rgba(124,107,255,0.3) 0%, transparent 65%)" }} />
        <div style={{ position: "absolute", bottom: "-30%", left: "-8%", width: 420, height: 420, background: "radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 60%)" }} />

        <div className="hero-inner-v3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="hero-badge">
              <div className="status-dot" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground-soft)" }}>Feed ao vivo · Angola</span>
            </div>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 34 }}
          >
            O que Angola avalia?
            <br />
            <span className="text-gradient text-glow">Descubra &amp; opine</span>
          </motion.h1>

          <motion.div
            style={{ marginTop: 26 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <div className="hero-search" style={{ maxWidth: 540 }}>
              <span className="hero-search-icon">
                <Search size={18} />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search && navigate(`/search?q=${search}`)}
                placeholder="Pesquisar empresa, categoria, província..."
              />
              <button
                onClick={() => search && navigate(`/search?q=${search}`)}
                className="btn"
                style={{
                  background: "var(--gradient-brand)",
                  color: "#fff",
                  padding: "9px 18px",
                  fontSize: 13,
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                }}
              >
                Buscar
              </button>
            </div>
          </motion.div>

          <motion.div
            style={{ marginTop: 20 }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <span
              onClick={() => !isAuthenticated && navigate("/register")}
              className="quick-rate-strip"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && !isAuthenticated && navigate("/register")}
            >
              {isAuthenticated ? (
                <Link to="/search" style={{ display: "flex", alignItems: "center", gap: 10, color: "inherit" }}>
                  <span className="quick-rate-strip-icon">
                    <Flame size={15} />
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                    <span style={{ color: "var(--primary-400)" }}>⚡ Avaliar agora</span> — demora menos de 30s
                  </span>
                </Link>
              ) : (
                <Link to="/register" style={{ display: "flex", alignItems: "center", gap: 10, color: "inherit" }}>
                  <span className="quick-rate-strip-icon">
                    <Star size={15} />
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--foreground)" }}>
                    ⚡ Criar conta e avaliar — grátis
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}> demora 1 minuto</span>
                  </span>
                  <ArrowRight size={14} style={{ color: "var(--primary-400)" }} />
                </Link>
              )}
            </span>
          </motion.div>

          <motion.div
            className="trust-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ marginTop: 26 }}
          >
            {[
              { icon: <Flame size={16} />, label: "Feed ao vivo" },
              { icon: <TrendingUp size={16} />, label: "Rankings por avaliação" },
              { icon: <Star size={16} />, label: "Avaliar em 30s" },
            ].map((t) => (
              <div key={t.label} className="trust-item">
                <span style={{ color: "var(--primary-400)" }}>{t.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{t.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="container container-xl" style={{ marginTop: -14, position: "relative", zIndex: 10 }}>
        <div className="home-grid">
          {/* ═══════ MAIN COLUMN ═══════ */}
          <div className="home-grid-main">
            {/* Avaliação mais recente */}
            {recent.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <EventSpotlight item={recent[0]} />
              </motion.section>
            )}

            {/* AVALIAÇÕES RECENTES */}
            {recent.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 22 }}
              >
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <div className="section-title">
                    <span className="dot" />
                    Avaliações recentes
                  </div>
                  <Link to="/rankings" className="section-link">
                    Ver ranking <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="vis-card-grid">
                  {recent.slice(0, 4).map((item) => (
                    <CompanyVisualCard
                      key={item.company_id}
                      name={item.name}
                      score={item.score}
                      category={item.category_name}
                      location={item.location_name}
                      totalReviews={item.total_reviews}
                      onClick={() => navigate(`/company/${item.company_id}`)}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* A COMUNIDADE ESTÁ AVALIANDO */}
            {liveReviews.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="feed-card"
                style={{ marginBottom: 22 }}
              >
                <div className="feed-card-title" style={{ marginBottom: 14 }}>
                  <span className="pulse-dot" style={{ background: "#34D399", boxShadow: "0 0 0 3px rgba(52,211,153,0.15), 0 0 12px rgba(52,211,153,0.5)" }} />
                  A comunidade está avaliando
                </div>
                <LiveActivity reviews={liveReviews} />
              </motion.section>
            )}

            {/* EMPRESAS COM POUCAS AVALIAÇÕES */}
            {needsReviews.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="feed-card"
                style={{ marginBottom: 22 }}
              >
                <div className="feed-card-title">
                  <MessageSquare size={14} style={{ color: "#34D399" }} />
                  Precisam de mais avaliações
                </div>
                <RisingCard items={needsReviews} />
              </motion.section>
            )}

            {/* CATEGORIAS */}
            {categories.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: 22 }}
              >
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <div className="section-title">
                    <Search size={14} style={{ color: "var(--primary-400)" }} />
                    Explorar por sector
                  </div>
                  <Link to="/search" className="section-link">
                    Ver tudo <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="cat-grid">
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/search?category=${cat.id}`}
                      className="cat-card"
                    >
                      <div className="cat-icon" style={{
                        color: categoryColor(cat.slug),
                        background: `${categoryColor(cat.slug)}1f`,
                        border: `1px solid ${categoryColor(cat.slug)}40`,
                      }}>
                        {categoryIcon(cat.slug)}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, textAlign: "center", lineHeight: 1.3, color: "var(--foreground-soft)" }}>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}

            {/* TOP EMPRESAS */}
            {top.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <div className="section-title">
                    <Star size={14} style={{ color: "var(--primary-400)" }} />
                    Top empresas
                  </div>
                  <Link to="/rankings" className="section-link">
                    Ranking completo <ChevronRight size={13} />
                  </Link>
                </div>
                <div className="vis-card-grid">
                  {top.slice(0, 4).map((item, i) => (
                    <CompanyVisualCard
                      key={item.company_id}
                      name={item.name}
                      score={item.score}
                      category={item.category_name}
                      location={item.location_name}
                      totalReviews={item.total_reviews}
                      rank={i + 1}
                      onClick={() => navigate(`/company/${item.company_id}`)}
                    />
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* ═══════ SIDE COLUMN ═══════ */}
          <div className="home-grid-side">
            {/* MAIS AVALIADAS */}
            {mostRated.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="feed-card"
                style={{ marginBottom: 18 }}
              >
                <div className="feed-card-title">
                  <Star size={14} style={{ color: "#FBBF24" }} />
                  Mais avaliadas
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {mostRated.slice(0, 4).map((item, i) => (
                    <div
                      key={item.company_id}
                      onClick={() => navigate(`/company/${item.company_id}`)}
                      className="rising-item"
                    >
                      <div style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted-3)" }}>#{i + 1}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>{item.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{item.total_reviews} avaliações</div>
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--primary-400)" }}>
                        {item.rating.toFixed(1)} / 5
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* TOP AVALIADORES */}
            {reviewers.length > 0 && (
              <motion.section
                variants={fadeUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="feed-card"
              >
                <div className="feed-card-title">
                  <Star size={14} style={{ color: "#FBBF24" }} />
                  Principais contribuidores
                </div>
                <TopReviewers reviewers={reviewers} />
              </motion.section>
            )}
          </div>
        </div>

        {/* CTA */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cta-section"
          style={{ marginBottom: 44 }}
        >
          <div style={{ position: "relative" }}>
            <div className="cta-icon">
              {isAuthenticated ? <PenLine size={27} style={{ color: "#fff" }} /> : <Star size={27} style={{ color: "#fff" }} />}
            </div>
            <h3 className="cta-title">{isAuthenticated ? "Dê a sua opinião" : "Junte-se ao painel de opinião de Angola"}</h3>
            <p className="cta-text">
              {isAuthenticated
                ? "Encontre uma empresa e dê a sua opinião. Veja como a sua avaliação muda o resultado."
                : "Avalie empresas e ajude a comunidade a tomar decisões com informação real."}
            </p>
            {isAuthenticated ? (
              <Link to="/search" className="btn btn-lg cta-btn">
                Avaliar agora <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/register" className="btn btn-lg cta-btn">
                Criar conta grátis <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}