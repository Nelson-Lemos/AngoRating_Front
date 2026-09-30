import React from "react";
import { Shield, MapPin, Crown, Trophy, Medal } from "lucide-react";
import type { Company } from "../../types";
import ScoreRing from "../ScoreRing";
import TrendIndicator from "../TrendIndicator";
import { CompanyGraphic } from "../BrandAssets";

interface CompanyCardProps {
  company: Company;
  rank?: number;
  onClick?: () => void;
}

export default function CompanyCard({ company: c, rank, onClick }: CompanyCardProps) {
  return (
    <div
      onClick={onClick}
      className="card card-hover flex items-center p-4"
      style={{ gap: 16 }}
    >
      {rank !== undefined && (
        <div style={{ width: 34, textAlign: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
          {rank <= 3 ? (
            <span style={{ display: "inline-flex" }}>
              {rank === 1 ? (
                <Crown size={18} color="#fbbf24" fill="#fbbf24" />
              ) : rank === 2 ? (
                <Trophy size={18} color="#c0c7d1" fill="#c0c7d1" />
              ) : (
                <Medal size={18} color="#cd8a4e" fill="#cd8a4e" />
              )}
            </span>
          ) : (
            <span style={{ color: "var(--muted-2)" }}>#{rank}</span>
          )}
        </div>
      )}

      <CompanyGraphic name={c.name} size={46} radius={13} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center" style={{ gap: 6 }}>
          <span className="text-sm font-semibold truncate" style={{ color: "var(--foreground)", maxWidth: 220 }}>
            {c.name}
          </span>
          {c.is_verified && <Shield size={13} className="text-primary flex-shrink-0" />}
        </div>
        <div className="flex items-center flex-wrap" style={{ gap: 8, marginTop: 5 }}>
          {c.category_name && (
            <span className="cat-chip">{c.category_name}</span>
          )}
          {c.location_name && (
            <span className="flex items-center" style={{ gap: 4, fontSize: 11, color: "var(--muted)" }}>
              <MapPin size={11} /> {c.location_name}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center flex-shrink-0" style={{ gap: 12 }}>
        <div className="text-right hidden sm:block">
          <TrendIndicator value={null} />
          <div style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 2 }}>
            {c.total_reviews.toLocaleString("pt")} avaliações
          </div>
        </div>
        <ScoreRing score={c.score} size={48} strokeWidth={3.5} />
      </div>
    </div>
  );
}

