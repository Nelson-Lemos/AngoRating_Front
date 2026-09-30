import React from "react";
import { Star } from "lucide-react";

interface DistributionBar {
  stars: number;
  count: number;
  percentage: number;
}

interface DistributionBarsProps {
  distribution: DistributionBar[];
  totalReviews: number;
  average: number;
  userVote?: number | null;
  communityAgreement?: number | null;
  compact?: boolean;
}

function scoreColor(s: number) {
  if (s >= 80) return "#34D399";
  if (s >= 60) return "#A3E635";
  if (s >= 40) return "#FBBF24";
  return "#FB7185";
}

export default function DistributionBars({
  distribution,
  totalReviews,
  average,
  userVote,
  communityAgreement,
  compact = false,
}: DistributionBarsProps) {
  const sorted = [...distribution].sort((a, b) => b.stars - a.stars);

  return (
    <div>
      {!compact && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor(average * 20), letterSpacing: "-0.03em", lineHeight: 1 }}>
              {average.toFixed(1)}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, marginTop: 4 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(average) ? "#FBBF24" : "var(--star-empty)"}
                  color={i < Math.round(average) ? "#FBBF24" : "var(--star-empty)"}
                />
              ))}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
              {totalReviews.toLocaleString("pt")} avaliações
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
            {sorted.map((bar) => (
              <div key={bar.stars} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", width: 12, textAlign: "right" }}>
                  {bar.stars}
                </span>
                <Star size={10} fill="#FBBF24" color="#FBBF24" />
                <div style={{ flex: 1, height: 8, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${bar.percentage}%`,
                      background: bar.stars >= 4 ? "linear-gradient(90deg, #34D399, #A3E635)" : bar.stars === 3 ? "#FBBF24" : "#FB7185",
                      borderRadius: 999,
                      transition: "width 0.7s ease",
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-2)", width: 34, textAlign: "right" }}>
                  {bar.percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {compact && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {sorted.map((bar) => (
            <div key={bar.stars} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", width: 8, textAlign: "right" }}>
                {bar.stars}
              </span>
              <div style={{ flex: 1, height: 6, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${bar.percentage}%`,
                    background: bar.stars >= 4 ? "#34D399" : bar.stars === 3 ? "#FBBF24" : "#FB7185",
                    borderRadius: 999,
                    transition: "width 0.7s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: 10, color: "var(--muted-2)", width: 28, textAlign: "right" }}>
                {bar.percentage.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      )}

      {userVote !== null && userVote !== undefined && communityAgreement !== null && communityAgreement !== undefined && (
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary-50)",
            border: "1px solid rgba(124,107,255,0.25)",
            fontSize: 13,
            color: "var(--foreground-soft)",
          }}
        >
          Você deu <b style={{ color: "var(--primary-400)" }}>{userVote} estrelas</b>.
          {" "}<b>{communityAgreement}%</b> da comunidade concorda consigo.
        </div>
      )}
    </div>
  );
}
