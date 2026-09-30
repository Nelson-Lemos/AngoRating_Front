import React from "react";
import { Target, Zap } from "lucide-react";
import type { Challenge } from "../../types";

interface ChallengeCardProps {
  challenges: Challenge[];
}

export default function ChallengeCard({ challenges }: ChallengeCardProps) {
  if (challenges.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {challenges.map((ch) => {
        const progress = Math.min((ch.current / ch.target) * 100, 100);
        return (
          <div
            key={ch.id}
            style={{
              padding: "14px 16px",
              borderRadius: "var(--radius-lg)",
              background: ch.completed
                ? "linear-gradient(135deg, rgba(52,211,153,0.1), var(--surface))"
                : "var(--glass-soft)",
              border: ch.completed
                ? "1px solid rgba(52,211,153,0.35)"
                : "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Target size={14} style={{ color: ch.completed ? "#34D399" : "var(--primary-400)" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
                  {ch.description}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Zap size={12} style={{ color: "#FBBF24" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: "#FBBF24" }}>+{ch.xp_reward} XP</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1, height: 6, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${progress}%`,
                    background: ch.completed
                      ? "linear-gradient(90deg, #34D399, #A3E635)"
                      : "var(--gradient-brand)",
                    borderRadius: 999,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
                {ch.current}/{ch.target}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
