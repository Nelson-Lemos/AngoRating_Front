import React from "react";
import { MapPin, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import type { NeedsReviewsItem } from "../../types";
import { CompanyGraphic } from "../BrandAssets";
import { useNavigate } from "react-router-dom";

interface RisingCardProps {
  items: NeedsReviewsItem[];
}

export default function RisingCard({ items }: RisingCardProps) {
  const navigate = useNavigate();

  if (items.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.slice(0, 5).map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: i * 0.04 }}
          onClick={() => navigate(`/company/${item.id}`)}
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
          <CompanyGraphic name={item.name} size={40} radius={11} img={null} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)" }}>
              {item.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              {item.category_name && (
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{item.category_name}</span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "var(--muted)" }}>
                <MessageSquare size={10} /> {item.review_count} avaliações
              </span>
            </div>
          </div>

          <div style={{ textAlign: "right", fontSize: 11, color: "var(--muted)" }}>
            Precisa de mais opiniões
          </div>
        </motion.div>
      ))}
    </div>
  );
}
