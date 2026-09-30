import React from "react";
import { Flame, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RankingItem } from "../../types";
import { CompanyGraphic } from "../BrandAssets";

interface SpotLightProps {
  item: RankingItem;
}

export default function EventSpotlight({ item }: SpotLightProps) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 18px",
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(251,191,36,0.35)",
        background: "linear-gradient(135deg, rgba(251,191,36,0.1), rgba(124,107,255,0.06), var(--surface))",
        marginBottom: 22,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 14px rgba(251,191,36,0.4)",
        }}
      >
        <Flame size={22} color="#000" />
      </div>

      <div style={{ flex: 1, minWidth: 220 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#FBBF24", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
          O que Angola acha?
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--foreground)" }}>
          {item.company_name}
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
          {item.category_name || ""} · ⭐ {item.score.toFixed(1)} · {item.total_reviews.toLocaleString("pt")} avaliações
        </div>
      </div>

      <button
        onClick={() => navigate(`/company/${item.company_id}`)}
        className="btn btn-primary"
        style={{ padding: "9px 18px", fontSize: 13, whiteSpace: "nowrap" }}
      >
        Avaliar agora <ArrowRight size={14} />
      </button>
    </div>
  );
}