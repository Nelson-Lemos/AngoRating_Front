import React from "react";
import { Timer, Vote } from "lucide-react";
import type { WaveData } from "../../types";

interface WaveCardProps {
  wave: WaveData;
}

export default function WaveCard({ wave }: WaveCardProps) {
  const sorted = [...wave.company_votes].sort((a, b) => b.votes - a.votes);
  const top = sorted[0];
  const maxVotes = top ? top.votes : 1;

  return (
    <div
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(56,189,248,0.3)",
        background: "linear-gradient(160deg, rgba(56,189,248,0.06), var(--surface))",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🇦🇴</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#38bdf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Rating da Semana
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--muted)" }}>
          <Timer size={12} />
          {wave.ends_at}
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--foreground)", marginBottom: 14 }}>
          {wave.title}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.map((item, i) => (
            <div key={item.company_id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground-soft)" }}>
                  {i === 0 && "🏆 "}{item.company_name}
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-400)" }}>
                  {item.percentage.toFixed(0)}%
                </span>
              </div>
              <div style={{ height: 8, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${item.percentage}%`,
                    background: i === 0 ? "linear-gradient(90deg, #FBBF24, #F59E0B)" : "var(--gradient-brand)",
                    borderRadius: 999,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, justifyContent: "center" }}>
          <Vote size={13} style={{ color: "var(--muted)" }} />
          <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
            {wave.total_votes.toLocaleString("pt")} votos
          </span>
        </div>
      </div>
    </div>
  );
}
