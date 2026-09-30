import React from "react";
import { Star } from "lucide-react";

interface RatingInputProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  max?: number;
}

export default function RatingInput({ value, onChange, label, max = 5 }: RatingInputProps) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ gap: "6px 12px", padding: "6px 0", flexWrap: "wrap" }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, minWidth: 96, color: "var(--foreground-soft)" }}>{label}</span>
      <div className="flex items-center" style={{ gap: 10, marginLeft: "auto" }}>
        <div className="flex" style={{ gap: 3 }}>
          {Array.from({ length: max }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${label} ${i + 1} estrela${i + 1 > 1 ? "s" : ""}`}
              onClick={() => onChange(i + 1)}
              style={{
                padding: 3,
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.15s ease",
                lineHeight: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Star
                size={28}
                fill={i < value ? "#FBBF24" : "transparent"}
                color={i < value ? "#FBBF24" : "var(--star-empty)"}
                strokeWidth={i < value ? 0 : 1.5}
              />
            </button>
          ))}
        </div>
        <span
          className="font-bold text-center"
          style={{
            fontSize: 13,
            minWidth: 34,
            color: "var(--foreground)",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "5px 8px",
          }}
        >
          {value}/5
        </span>
      </div>
    </div>
  );
}
