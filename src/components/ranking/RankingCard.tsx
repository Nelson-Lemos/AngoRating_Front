import React from "react";
import { Crown, Trophy, Medal } from "lucide-react";
import type { RankingItem } from "../../types";
import ScoreRing from "../ScoreRing";
import TrendIndicator from "../TrendIndicator";

interface RankingCardProps {
  item: RankingItem;
  rank: number;
  onClick?: () => void;
}

export default function RankingCard({ item, rank, onClick }: RankingCardProps) {
  const isTop3 = rank <= 3;

  return (
    <div
      onClick={onClick}
      className="card card-hover flex items-center p-4"
      style={{
        gap: 16,
        ...(isTop3 ? { border: `1px solid rgba(99,91,255,0.2)` } : {}),
      }}
    >
      <div style={{ width: 36, textAlign: "center", flexShrink: 0 }}>
        {isTop3 ? (
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
          <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(100,116,139,0.4)" }}>#{rank}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "var(--foreground)" }}>{item.company_name}</div>
        <div className="flex items-center" style={{ gap: 8, marginTop: 4 }}>
          {item.category_name && (
            <span
              className="text-primary-600 font-medium"
              style={{ fontSize: 10, background: "rgba(124,107,255,0.16)", padding: "2px 6px", borderRadius: 4, color: "var(--primary-400)" }}
            >
              {item.category_name}
            </span>
          )}
          {item.location_name && <span style={{ fontSize: 10, color: "var(--muted)" }}>{item.location_name}</span>}
        </div>
      </div>

      <div className="flex items-center flex-shrink-0" style={{ gap: 12 }}>
        <div className="text-right">
          <TrendIndicator value={item.trend} />
          <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{item.total_reviews} avaliações</div>
        </div>
        <ScoreRing score={item.score} size={46} strokeWidth={3.5} />
      </div>
    </div>
  );
}
