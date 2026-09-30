import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import type { RankingItem, Category, Location } from "../../types";
import Skeleton from "../../components/ui/Skeleton";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, Clock3 } from "lucide-react";
import CompanyVisualCard from "../../components/company/CompanyVisualCard";
import type { RankingBoard } from "../../types";

const TABS: { key: RankingBoard; label: string; icon: React.ReactNode }[] = [
  { key: "rating", label: "Melhor avaliadas", icon: <Trophy size={13} /> },
  { key: "volume", label: "Mais avaliadas", icon: <Star size={13} /> },
  { key: "recent", label: "Avaliação recente", icon: <Clock3 size={13} /> },
];

export default function RankingsPage() {
  const [active, setActive] = useState<RankingBoard>("rating");
  const [items, setItems] = useState<RankingItem[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [catFilter, setCatFilter] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.items)).catch(() => setCategories([]));
    api.locations.list().then((r) => setLocations(r.items)).catch(() => setLocations([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.rankings.get(active, {
      limit: 50,
      category_id: catFilter || undefined,
      location_id: locFilter || undefined,
    })
      .then((r) => {
        setItems(r.items);
        setNote(r.note);
      })
      .catch((reason: unknown) => {
        setItems([]);
        setNote(null);
        setError(reason instanceof Error ? reason.message : "Não foi possível carregar os rankings.");
      })
      .finally(() => setLoading(false));
  }, [active, catFilter, locFilter]);

  return (
    <div className="container" style={{ maxWidth: 1024, paddingTop: 28, paddingBottom: 28 }}>
      <div className="flex items-center gap-3 mb-6">
        <Trophy size={26} style={{ color: "var(--primary-400)" }} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--foreground)", letterSpacing: "-0.02em" }}>Rankings</h1>
      </div>
      {note && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: -16, marginBottom: 16 }}>{note}</p>}

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
      ) : error ? (
        <div className="card text-center" style={{ padding: "48px 16px", color: "var(--danger)" }}>
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center" style={{ padding: "72px 0", color: "var(--muted)" }}>
          <p className="text-sm font-medium">Nenhum resultado encontrado.</p>
        </div>
      ) : (
        <div className="vis-card-grid">
          {items.map((item, i) => (
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
      )}
    </div>
  );
}
