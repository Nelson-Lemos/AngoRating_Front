import React from "react";
import { Trophy, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Reviewer {
  user_id: string;
  user_name: string;
  total_xp: number;
  level: string;
  total_reviews: number;
  rank: number;
}

interface TopReviewersProps {
  reviewers: Reviewer[];
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function TopReviewers({ reviewers }: TopReviewersProps) {
  if (reviewers.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {reviewers.slice(0, 5).map((r, i) => (
        <motion.div
          key={r.user_id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: i < 3 ? "rgba(251,191,36,0.06)" : "var(--glass-soft)",
            border: i < 3 ? "1px solid rgba(251,191,36,0.2)" : "1px solid var(--border)",
          }}
        >
          <div style={{ width: 28, textAlign: "center", flexShrink: 0 }}>
            {i < 3 ? (
              <span style={{ fontSize: 18 }}>{MEDALS[i]}</span>
            ) : (
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted-3)" }}>#{r.rank}</span>
            )}
          </div>

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {(r.user_name || "U")[0].toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
              {r.user_name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 1 }}>
              <span style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}>
                <Star size={10} fill="#FBBF24" color="#FBBF24" /> {r.total_reviews} reviews
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 3 }}>
                <Zap size={10} style={{ color: "#FBBF24" }} /> {r.total_xp} XP
              </span>
            </div>
          </div>

          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 999,
              background: "rgba(124,107,255,0.14)",
              color: "var(--primary-400)",
              border: "1px solid rgba(124,107,255,0.25)",
            }}
          >
            {r.level}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
