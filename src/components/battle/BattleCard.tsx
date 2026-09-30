import React, { useState } from "react";
import { Swords, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import type { BattleData } from "../../types";
import { CompanyGraphic } from "../BrandAssets";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface BattleCardProps {
  battle: BattleData;
  onVote?: (updated: BattleData) => void;
}

export default function BattleCard({ battle, onVote }: BattleCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [votesA, setVotesA] = useState(battle.votes_a);
  const [votesB, setVotesB] = useState(battle.votes_b);
  const [userVote, setUserVote] = useState<string | null>(battle.user_vote ?? null);
  const [voting, setVoting] = useState<string | null>(null);
  const [justVoted, setJustVoted] = useState(false);

  const totalVotes = votesA + votesB;
  const pctA = totalVotes > 0 ? Math.round((votesA / totalVotes) * 100) : 50;
  const pctB = 100 - pctA;

  async function handleVote(companyId: string) {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (voting) return;
    setVoting(companyId);
    try {
      const res = await api.battles.vote(battle.company_a_id, battle.company_b_id, companyId);
      setVotesA(res.votes_a);
      setVotesB(res.votes_b);
      setUserVote(res.user_vote);
      setJustVoted(true);
      onVote?.({
        ...battle,
        votes_a: res.votes_a,
        votes_b: res.votes_b,
        total_votes: res.total_votes,
        user_vote: res.user_vote,
      });
    } catch {
      // silent
    } finally {
      setVoting(null);
    }
  }

  return (
    <div
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid rgba(251,191,36,0.3)",
        background: "linear-gradient(160deg, rgba(251,191,36,0.08), var(--surface))",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Swords size={16} style={{ color: "#FBBF24" }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#FBBF24", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Rating Battle
          </span>
        </div>
        {justVoted && (
          <span style={{ fontSize: 11, fontWeight: 700, color: "#34D399" }}>✓ Voto registrado</span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", padding: "18px 16px", gap: 12 }}>
        {/* Company A */}
        <div
          style={{ flex: 1, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate(`/company/${battle.company_a_id}`)}
        >
          <CompanyGraphic name={battle.company_a_name} size={52} radius={14} img={null} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginTop: 8 }}>
            {battle.company_a_name}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--primary-400)", marginTop: 2 }}>
            {battle.company_a_score.toFixed(1)}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handleVote(battle.company_a_id); }}
            disabled={voting !== null}
            style={{
              marginTop: 10,
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(124,107,255,0.4)",
              background: userVote === battle.company_a_id ? "var(--gradient-brand)" : "transparent",
              color: userVote === battle.company_a_id ? "#fff" : "var(--primary-400)",
              fontSize: 12,
              fontWeight: 700,
              cursor: voting !== null ? "wait" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {userVote === battle.company_a_id ? "✓ Seu voto" : "Votar"}
          </motion.button>
        </div>

        {/* VS */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #FBBF24, #F59E0B)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#000",
              boxShadow: "0 4px 14px rgba(251,191,36,0.4)",
            }}
          >
            VS
          </div>
          <span style={{ fontSize: 10, color: "var(--muted-2)" }}>
            {totalVotes.toLocaleString("pt")} votos
          </span>
        </div>

        {/* Company B */}
        <div
          style={{ flex: 1, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate(`/company/${battle.company_b_id}`)}
        >
          <CompanyGraphic name={battle.company_b_name} size={52} radius={14} img={null} />
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--foreground)", marginTop: 8 }}>
            {battle.company_b_name}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#38bdf8", marginTop: 2 }}>
            {battle.company_b_score.toFixed(1)}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); handleVote(battle.company_b_id); }}
            disabled={voting !== null}
            style={{
              marginTop: 10,
              padding: "6px 14px",
              borderRadius: 999,
              border: "1px solid rgba(56,189,248,0.4)",
              background: userVote === battle.company_b_id ? "#38bdf8" : "transparent",
              color: userVote === battle.company_b_id ? "#fff" : "#38bdf8",
              fontSize: 12,
              fontWeight: 700,
              cursor: voting !== null ? "wait" : "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {userVote === battle.company_b_id ? "✓ Seu voto" : "Votar"}
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "8px 16px 16px" }}>
        <div style={{ display: "flex", height: 8, borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div
            style={{
              width: `${pctA}%`,
              background: "linear-gradient(90deg, #7c6bff, #a99bff)",
              transition: "width 0.5s ease",
            }}
          />
          <div
            style={{
              width: `${pctB}%`,
              background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-400)" }}>{pctA}%</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#38bdf8" }}>{pctB}%</span>
        </div>

        {!isAuthenticated && (
          <div
            style={{
              marginTop: 10,
              textAlign: "center",
              fontSize: 11,
              color: "var(--muted)",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            Entre para votar ⚡
          </div>
        )}
      </div>
    </div>
  );
}