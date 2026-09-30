import React from "react";
import { TrendingUp, MapPin, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { RankingItem } from "../../types";
import { CompanyGraphic } from "../BrandAssets";
import TrendIndicator from "../TrendIndicator";
import { useNavigate } from "react-router-dom";

interface RisingCardProps {
  items: RankingItem[];
}

export default function RisingCard({ items }: RisingCardProps) {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.slice(0, 5).map((item, i) => (
        <motion.div
          key={item.company_id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          onClick={() => navigate(`/company/${item.company_id}`)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: "var(--radius-md)",
            background: "var(--glass-soft)",
            border: "1px solid var(--border)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--glass-mid)";
            e.currentTarget.style.borderColor = "var(--border-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--glass-soft)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <CompanyGraphic name={item.company_name} size={40} radius={11} img={null} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
              {item.company_name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              {item.category_name && (
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{item.category_name}</span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--muted)" }}>
                <MessageSquare size={10} /> {item.total_reviews}
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#34D399" }}>
              {item.score.toFixed(1)}
            </div>
            <TrendIndicator value={item.trend} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
