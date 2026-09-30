import React from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

function scoreColor(s: number) {
  if (s >= 80) return "#34D399";
  if (s >= 60) return "#A3E635";
  if (s >= 40) return "#FBBF24";
  return "#FB7185";
}

export default function ScoreRing({ score, size = 52, strokeWidth = 4, showLabel = true }: ScoreRingProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(score / 100, 0), 1);
  const dash = circ * pct;
  const color = scoreColor(score);
  const cx = size / 2;

  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--ring-track)" strokeWidth={strokeWidth} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: "stroke-dasharray .6s ease" }}
        />
      </svg>
      {showLabel && (
        <div className="score-ring-center">
          <span
            style={{
              fontWeight: 700,
              lineHeight: 1,
              fontSize: size < 44 ? 13 : size < 60 ? 15 : 18,
              color,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {Math.round(score)}
          </span>
        </div>
      )}
    </div>
  );
}
