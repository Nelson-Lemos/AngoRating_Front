import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import type { ReviewComment } from "../../types";

interface ReviewVoteBarProps {
  reviewId: string;
  initialAgree: number;
  initialDisagree: number;
  initialComments: number;
  onVote?: (agree: number, disagree: number) => void;
}

export default function ReviewVoteBar({
  reviewId,
  initialAgree,
  initialDisagree,
  initialComments,
  onVote,
}: ReviewVoteBarProps) {
  const { isAuthenticated } = useAuth();
  const [agree, setAgree] = useState(initialAgree);
  const [disagree, setDisagree] = useState(initialDisagree);
  const [userVote, setUserVote] = useState<boolean | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<ReviewComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  async function handleVote(isAgree: boolean) {
    if (!isAuthenticated) return;
    if (userVote === isAgree) return;

    try {
      if (isAgree) {
        const res = await api.reviews.agree(reviewId);
        setAgree(res.agree_count);
        setDisagree(res.disagree_count);
      } else {
        const res = await api.reviews.disagree(reviewId);
        setAgree(res.agree_count);
        setDisagree(res.disagree_count);
      }
      setUserVote(isAgree);
      onVote?.(agree, disagree);
    } catch {
      // silent
    }
  }

  async function toggleComments() {
    setShowComments((s) => !s);
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      try {
        const res = await api.reviews.comments.list(reviewId);
        setComments(res.items);
      } catch {
        // silent
      } finally {
        setLoadingComments(false);
      }
    }
  }

  async function handleComment() {
    const text = newComment.trim();
    if (!text) return;
    setSendingComment(true);
    try {
      const created = await api.reviews.comments.add(reviewId, text);
      setComments((c) => [created, ...c]);
      setNewComment("");
    } catch {
      // silent
    } finally {
      setSendingComment(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        <button
          onClick={() => handleVote(true)}
          disabled={!isAuthenticated}
          title={isAuthenticated ? "Concordo" : "Entre para votar"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: userVote === true ? "rgba(52,211,153,0.14)" : "var(--glass-soft)",
            color: userVote === true ? "#34D399" : "var(--muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: isAuthenticated ? "pointer" : "not-allowed",
            transition: "all 0.15s ease",
          }}
        >
          <ThumbsUp size={12} /> {agree}
        </button>

        <button
          onClick={() => handleVote(false)}
          disabled={!isAuthenticated}
          title={isAuthenticated ? "Discordo" : "Entre para votar"}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: userVote === false ? "rgba(251,113,133,0.14)" : "var(--glass-soft)",
            color: userVote === false ? "#FB7185" : "var(--muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: isAuthenticated ? "pointer" : "not-allowed",
            transition: "all 0.15s ease",
          }}
        >
          <ThumbsDown size={12} /> {disagree}
        </button>

        <button
          onClick={toggleComments}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 999,
            border: "1px solid var(--border)",
            background: showComments ? "rgba(124,107,255,0.14)" : "var(--glass-soft)",
            color: showComments ? "var(--primary-400)" : "var(--muted)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <MessageSquare size={12} /> {showComments ? "Ocultar" : comments.length || initialComments}
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
          {isAuthenticated && (
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                placeholder="O que achas desta avaliação?"
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: "var(--surface-2)",
                  color: "var(--foreground)",
                  fontSize: 12,
                }}
              />
              <button
                onClick={handleComment}
                disabled={sendingComment || !newComment.trim()}
                className="btn btn-primary"
                style={{ padding: "8px 14px", fontSize: 12, whiteSpace: "nowrap" }}
              >
                {sendingComment ? "..." : "Comentar"}
              </button>
            </div>
          )}

          {loadingComments ? (
            <div style={{ fontSize: 12, color: "var(--muted)" }}>A carregar comentários...</div>
          ) : comments.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--muted-2)" }}>Sem comentários ainda.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {comments.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--foreground-soft)" }}>
                    {c.user_name}
                  </div>
                  <div style={{ color: "var(--foreground)", marginTop: 2 }}>{c.content}</div>
                  <div style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 4 }}>
                    {new Date(c.created_at).toLocaleDateString("pt-PT")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}