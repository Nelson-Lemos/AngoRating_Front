import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendIndicatorProps {
  value: number | null;
  size?: "sm" | "md";
}

export default function TrendIndicator({ value, size = "sm" }: TrendIndicatorProps) {
  const fs = size === "sm" ? 11 : 13;
  const iconSize = size === "sm" ? 10 : 12;

  if (value === null || value === 0) {
    return (
      <span className="inline-flex items-center" style={{ gap: 2, fontSize: fs, color: "var(--muted-2)" }}>
        <Minus size={iconSize} /> 0%
      </span>
    );
  }

  const up = value > 0;
  return (
    <span
      className="inline-flex items-center font-semibold"
      style={{ gap: 2, fontSize: fs, color: up ? "#34D399" : "#FB7185" }}
    >
      {up ? <TrendingUp size={iconSize} /> : <TrendingDown size={iconSize} />}
      {up ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}
