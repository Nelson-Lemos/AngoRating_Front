import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { FeedReview } from "../../types";

interface LiveActivityProps {
  reviews: FeedReview[];
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d`;
}

export default function LiveActivity({ reviews }: LiveActivityProps) {
  if (reviews.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {reviews.slice(0, 6).map((review, i) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: "var(--radius-md)",
            background: "var(--glass-soft)",
            border: "1px solid var(--border)",
            transition: "background 0.15s ease",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--gradient-brand)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 11,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {(review.user?.name || "A")[0].toUpperCase()}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: "var(--foreground-soft)" }}>
              <b style={{ fontWeight: 700, color: "var(--foreground)" }}>{review.user?.name || "Anónimo"}</b>
              {" "}avaliou{" "}
              <b style={{ fontWeight: 700, color: "var(--foreground)" }}>{review.company?.name || "uma empresa"}</b>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
              <div style={{ display: "flex", gap: 1 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    size={10}
                    fill={j < Math.round(review.rating) ? "#FBBF24" : "var(--star-empty)"}
                    color={j < Math.round(review.rating) ? "#FBBF24" : "var(--star-empty)"}
                  />
                ))}
              </div>
              <span style={{ fontSize: 10, color: "var(--muted-2)" }}>
                {timeAgo(review.created_at)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
