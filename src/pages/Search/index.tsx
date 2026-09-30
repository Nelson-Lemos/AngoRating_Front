import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";
import { api } from "../../services/api";
import type { Company, Category } from "../../types";
import CompanyVisualCard from "../../components/company/CompanyVisualCard";
import Skeleton from "../../components/ui/Skeleton";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("category") || "");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.categories.list().then((r) => setCategories(r.items));
    inputRef.current?.focus();
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.companies.list({
        q: query || undefined,
        category_id: categoryId || undefined,
        limit: 50,
      });
      setCompanies(res.items);
      setTotal(res.total);
    } finally {
      setLoading(false);
    }
  }, [query, categoryId]);

  useEffect(() => {
    const t = setTimeout(search, 250);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="container container-lg" style={{ paddingTop: 28, paddingBottom: 28 }}>
      {/* Search bar */}
      <div className="card p-5 mb-6" style={{ boxShadow: "var(--shadow-card-hover)" }}>
        <div className="relative">
          <SearchIcon size={17} className="absolute" style={{ left: 15, top: "50%", transform: "translateY(-50%)", color: "var(--muted-40)" }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar empresas..."
            className="w-full"
            style={{
              paddingLeft: 44,
              paddingRight: 40,
              paddingTop: 13,
              paddingBottom: 13,
              background: "var(--bg-2)",
              border: "1.5px solid var(--border)",
              borderRadius: 12,
              color: "var(--foreground)",
              fontSize: 15,
              outline: "none",
              fontFamily: "inherit",
              transition: "all 0.18s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
          {query && (
            <button
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute"
              style={{ right: 12, top: "50%", transform: "translateY(-50%)", padding: 6, borderRadius: 8, background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap mt-4" style={{ gap: 7 }}>
          <button
            onClick={() => setCategoryId("")}
            className={!categoryId ? "pill pill-active" : "pill"}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryId(categoryId === c.id ? "" : c.id)}
              className={categoryId === c.id ? "pill pill-active" : "pill"}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {loading ? "Pesquisando..." : `${total} empresas encontradas`}
      </div>

      {loading ? (
        <Skeleton className="h-20" count={5} />
      ) : companies.length === 0 ? (
        <div className="card text-center" style={{ padding: "72px 0", color: "var(--muted)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--gray-100)" }}>
            <SearchIcon size={26} style={{ color: "var(--muted-30)" }} />
          </div>
          <p className="text-sm font-semibold" style={{ fontSize: 14 }}>Nenhuma empresa encontrada.</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Tente outros termos ou categorias.</p>
        </div>
      ) : (
        <div className="vis-card-grid">
          {companies.map((c) => (
            <CompanyVisualCard
              key={c.id}
              name={c.name}
              score={c.score}
              category={c.category_name}
              location={c.location_name}
              totalReviews={c.total_reviews}
              trend={null}
              onClick={() => navigate(`/company/${c.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}