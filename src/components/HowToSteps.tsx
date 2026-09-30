import React from "react";
import { Search, Star, Send } from "lucide-react";

interface Step {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  {
    icon: <Search size={22} />,
    title: "1. Procure",
    text: "Encontre a empresa pelo nome na pesquisa.",
  },
  {
    icon: <Star size={22} />,
    title: "2. Veja o score",
    text: "Veja a pontuação e as avaliações de outros.",
  },
  {
    icon: <Send size={22} />,
    title: "3. Avalie",
    text: "Dê a sua opinião com 1 a 5 estrelas.",
  },
];

export default function HowToSteps() {
  return (
    <div
      className="card"
      style={{ padding: "26px 20px", overflow: "hidden", position: "relative" }}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <span className="font-bold" style={{ fontSize: 18, color: "var(--foreground)", letterSpacing: "-0.01em" }}>
          Como avaliar uma empresa
        </span>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          É fácil — três passos simples.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
        }}
        className="howto-grid"
      >
        {STEPS.map((s, i) => (
          <div
            key={s.title}
            className="howto-step"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              background: "linear-gradient(160deg, var(--surface-2), var(--surface))",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 13,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--gradient-brand)",
                color: "#fff",
                boxShadow: "0 4px 14px rgba(124,107,255,0.4)",
              }}
            >
              {s.icon}
            </div>
            <div>
              <div className="font-bold flex items-center" style={{ gap: 8, fontSize: 14, color: "var(--foreground)" }}>
                {s.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.text}</div>
            </div>
            {i < STEPS.length - 1 && (
              <span className="howto-arrow" style={{ marginLeft: "auto", color: "var(--muted-3)", display: "none" }}>
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
