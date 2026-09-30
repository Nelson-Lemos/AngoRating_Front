import React from "react";
import { MapPin, Shield, Star, MessageSquare, Eye } from "lucide-react";
import type { Company, RankingItem } from "../../types";
import ScoreRing from "../ScoreRing";
import TrendIndicator from "../TrendIndicator";
import { BrandCover, companyBrandColor } from "../BrandAssets";

interface CompanyVisualCardProps {
  name: string;
  score: number;
  category?: string | null;
  location?: string | null;
  totalReviews?: number;
  isVerified?: boolean;
  trend?: number | null;
  rank?: number;
  onClick?: () => void;
}

/* Card grande e visual: imagem/capa da empresa bem visível em cima, nome,
   categoria e score. Extremo clareza para qualquer utilizador. */
export default function CompanyVisualCard({
  name,
  score,
  category,
  location,
  totalReviews = 0,
  isVerified = false,
  trend,
  rank,
  onClick,
}: CompanyVisualCardProps) {
  const color = companyBrandColor(name);
  const label =
    score >= 80 ? "Excelente" : score >= 60 ? "Bom" : score >= 40 ? "Razoável" : "Fraco";
  const scoreText =
    score >= 80 ? "#34D399" : score >= 60 ? "#A3E635" : score >= 40 ? "#FBBF24" : "#FB7185";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
      className="card card-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <div style={{ position: "relative" }}>
        <BrandCover name={name} height={150} />
        {rank !== undefined && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(7,8,16,0.72)",
              backdropFilter: "blur(6px)",
              color: rank <= 3 ? "#FBBF24" : "#fff",
              borderRadius: 999,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 800,
              border: rank <= 3 ? "1px solid rgba(251,191,36,0.5)" : "1px solid var(--border-strong)",
            }}
          >
            #{rank}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            background: "rgba(7,8,16,0.72)",
            backdropFilter: "blur(6px)",
            borderRadius: "50%",
            width: 46,
            height: 46,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScoreRing score={score} size={46} strokeWidth={4} showLabel={false} />
        </div>
      </div>

      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <span className="font-bold truncate" style={{ fontSize: 16, color: "var(--foreground)", letterSpacing: "-0.01em" }}>
            {name}
          </span>
          {isVerified && <Shield size={14} style={{ color: "#38BDF8", flexShrink: 0 }} />}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 800, color: scoreText }}>{label}</span>
          {trend !== undefined && <TrendIndicator value={trend} />}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {category && <span className="cat-chip">{category}</span>}
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 10 }}>
          {location ? (
            <span className="flex items-center" style={{ gap: 4, fontSize: 11, color: "var(--muted)" }}>
              <MapPin size={12} /> {location}
            </span>
          ) : (
            <span />
          )}
          <span className="flex items-center" style={{ gap: 4, fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>
            <MessageSquare size={12} /> {totalReviews.toLocaleString("pt")}
          </span>
        </div>

        <div
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: `${color}1c`,
            color,
            border: `1px solid ${color}40`,
            borderRadius: 10,
            padding: "8px 10px",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          <Eye size={14} /> Ver avaliações
        </div>
      </div>
    </div>
  );
}
