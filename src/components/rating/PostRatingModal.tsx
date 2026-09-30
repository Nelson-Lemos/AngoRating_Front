import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Star, X, TrendingUp } from "lucide-react";

interface PostRatingModalProps {
  open: boolean;
  companyName: string;
  userVote: number;
  average: number;
  communityAgreement: number | null;
  percentile: number | null;
  onClose: () => void;
  onWhyThisNote?: () => void;
}

function scoreColor(s: number) {
  if (s >= 4.5) return "#34D399";
  if (s >= 3.5) return "#A3E635";
  if (s >= 2.5) return "#FBBF24";
  return "#FB7185";
}

export default function PostRatingModal({
  open,
  companyName,
  userVote,
  average,
  communityAgreement,
  percentile,
  onClose,
}: PostRatingModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-backdrop"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            className="modal-panel modal-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Crown size={18} style={{ color: "#FBBF24" }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--foreground)" }}>
                  Sua opinião está registrada!
                </span>
              </div>
              <button className="modal-close" onClick={onClose}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ paddingTop: 20 }}>
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 4 }}>
                  Você avaliou {companyName} com
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 6 }}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      size={30}
                      fill={j < userVote ? "#FBBF24" : "var(--star-empty)"}
                      color={j < userVote ? "#FBBF24" : "var(--star-empty)"}
                    />
                  ))}
                </div>
              </div>

              {/* Community comparison */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  background: "var(--primary-50)",
                  border: "1px solid rgba(124,107,255,0.3)",
                  borderRadius: "var(--radius-lg)",
                  padding: "18px",
                  marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <TrendingUp size={14} style={{ color: "var(--primary-400)" }} />
                  Você × Comunidade
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {/* User */}
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 34, fontWeight: 800, color: "#FBBF24", lineHeight: 1 }}>
                      {userVote.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                      Você
                    </div>
                  </div>

                  {/* VS */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "var(--gradient-brand)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 900,
                      color: "#fff",
                      flexShrink: 0,
                      boxShadow: "0 3px 10px rgba(124,107,255,0.4)",
                    }}
                  >
                    VS
                  </div>

                  {/* Community */}
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 34, fontWeight: 800, color: scoreColor(average), lineHeight: 1 }}>
                      {average.toFixed(1)}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: 1 }}>
                      Comunidade
                    </div>
                  </div>
                </div>

                {/* Divider */}
                {communityAgreement !== null && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed rgba(124,107,255,0.25)", textAlign: "center" }}>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: communityAgreement >= 50 ? "#34D399" : "#FBBF24",
                    }}>
                      {communityAgreement >= 50 ? "🎯 " : "💭 "}
                      {communityAgreement}% da comunidade concorda consigo.
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  textAlign: "center",
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--glass-soft)",
                  border: "1px solid var(--border)",
                  fontSize: 13,
                  color: "var(--muted)",
                  marginBottom: 20,
                }}
              >
                {percentile !== null ? (
                  <>Você está no <b style={{ color: "var(--foreground)" }}>top {percentile}%</b> dos avaliadores desta categoria.</>
                ) : (
                  <>A sua opinião muda o resultado. Continue avaliando!</>
                )}
              </motion.div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={onClose}
                  className="btn btn-primary"
                  style={{ padding: "10px 24px", fontSize: 13 }}
                >
                  Continuar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}