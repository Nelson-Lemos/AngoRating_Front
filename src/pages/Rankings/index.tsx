import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { RankingItem, Category, Location } from "../../types";
import Skeleton from "../../components/ui/Skeleton";
import { useNavigate } from "react-router-dom";
import { Trophy, TrendingUp, Star, TrendingDown, ArrowUpRight } from "lucide-react";
import CompanyVisualCard from "../../components/company/CompanyVisualCard";

type RankingType = "top" | "trending" | "most-rated" | "rising" | "declining";

const TABS: { key: RankingType; label: string; icon: React.ReactNode }[] = [
  { key: "top", label: "Top", icon: <Trophy size={13} /> },
  { key: "trending", label: "Em alta", icon: <TrendingUp size={13} /> },
  { key: "most-rated", label: "Mais avaliadas", icon: <Star size={13} /> },
  { key: "rising", label: "Em ascensão", icon: <ArrowUpRight size={13} /> },
  { key: "declining", label: "Em declínio", icon: <TrendingDown size={13} /> },
];

export default function RankingsPage() {
  const [active, setActive] = useState<RankingType>("top");
  const [items, setItems] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [catFilter, setCatFilter] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.items));
    api.locations.list().then((r) => setLocations(r.items));
  }, []);

  useEffect(() => {
    setLoading(true);
    const fn = {
      top: api.rankings.top,
      trending: api.rankings.trending,
      "most-rated": api.rankings.mostRated,
      rising: api.rankings.rising,
      declining: api.rankings.declining,
    }[active];
    fn({
      limit: 50,
      category_id: catFilter || undefined,
      location_id: locFilter || undefined,
    })
      .then((r) => setItems(r.items))
      .finally(() => setLoading(false));
  }, [active, catFilter, locFilter]);

  return (
    <div className="container" style={{ maxWidth: 1024, paddingTop: 28, paddingBottom: 28 }}>
      <div className="flex items-center gap-3 mb-6">
        <Trophy size={26} style={{ color: "var(--primary-400)" }} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>Rankings</h1>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={active === t.key ? "tab-btn tab-btn-active" : "tab-btn"}
          >
            <span className="inline-flex items-center" style={{ gap: 6 }}>
              {t.icon}
              <span>{t.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex mb-5" style={{ gap: 10 }}>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="select-field"
          style={{ padding: "9px 14px", fontSize: 13, maxWidth: 220 }}
        >
          <option value="">Todas categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={locFilter}
          onChange={(e) => setLocFilter(e.target.value)}
          className="select-field"
          style={{ padding: "9px 14px", fontSize: 13, maxWidth: 220 }}
        >
          <option value="">Todas províncias</option>
          {locations.flatMap((l) =>
            l.provinces?.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            )) || []
          )}
        </select>
      </div>

      {loading ? (
        <Skeleton className="h-40" count={5} />
      ) : items.length === 0 ? (
        <div className="card text-center" style={{ padding: "72px 0", color: "var(--muted)" }}>
          <p className="text-sm font-medium">Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <div className="vis-card-grid">
          {items.map((item, i) => (
            <CompanyVisualCard
              key={item.company_id}
              name={item.company_name}
              score={item.score}
              category={item.category_name}
              location={item.location_name}
              totalReviews={item.total_reviews}
              trend={item.trend}
              rank={i + 1}
              onClick={() => navigate(`/company/${item.company_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
