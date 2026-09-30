import React, { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Flame, Star, MessageSquare, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import type { Notification } from "../../types";

const NOTIF_ICONS: Record<string, React.ReactNode> = {
  review_agree: <ThumbsUpIcon />,
  review_comment: <MessageSquare size={14} style={{ color: "var(--primary-400)" }} />,
  trending: <TrendingUp size={14} style={{ color: "#34D399" }} />,
  challenge: <Zap size={14} style={{ color: "#FBBF24" }} />,
};

function ThumbsUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `${diffD}d`;
  return date.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
}

export default function NotificationsPanel() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.notifications.count().then((r) => setUnread(r.count)).catch(() => {});
  }, [isAuthenticated, open]);

  useEffect(() => {
    function handleClickOut(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClickOut);
    return () => document.removeEventListener("click", handleClickOut);
  }, []);

  async function toggle() {
    if (!open) {
      setOpen(true);
      setLoading(true);
      try {
        const res = await api.notifications.list();
        setNotifications(res.items);
        setUnread(res.items.filter((n) => !n.is_read).length);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    } else {
      setOpen(false);
    }
  }

  async function markRead(id: string) {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnread((u) => Math.max(u - 1, 0));
    api.notifications.markRead(id).catch(() => {});
  }

  async function markAllRead() {
    setNotifications((ns) => ns.map((n) => ({ ...n, is_read: true })));
    setUnread(0);
    api.notifications.markAllRead().catch(() => {});
  }

  if (!isAuthenticated) return null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={toggle}
        className="header-icon-btn"
        title="Notificações"
        style={{
          color: unread > 0 ? "var(--primary-400)" : "var(--muted)",
          position: "relative",
        }}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 9,
              height: 9,
              borderRadius: "50%",
              background: "#FB7185",
              boxShadow: "0 0 0 2px var(--surface)",
            }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: 340,
              maxHeight: 420,
              overflowY: "auto",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-card-hover)",
              zIndex: 60,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                position: "sticky",
                top: 0,
                background: "var(--surface)",
                zIndex: 1,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--foreground)", display: "flex", alignItems: "center", gap: 8 }}>
                <Bell size={15} style={{ color: "var(--primary-400)" }} />
                Notificações
                {unread > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#FB7185" }}>({unread})</span>
                )}
              </span>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--primary-400)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <CheckCheck size={12} /> Marcar tudo
                </button>
              )}
            </div>

            <div style={{ padding: "6px" }}>
              {loading ? (
                <div style={{ padding: "24px 16px", textAlign: "center", fontSize: 12, color: "var(--muted)" }}>
                  A carregar...
                </div>
              ) : notifications.length === 0 ? (
                <div style={{ padding: "28px 16px", textAlign: "center", fontSize: 13, color: "var(--muted)" }}>
                  Sem notificações ainda.
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: n.is_read ? "transparent" : "rgba(124,107,255,0.08)",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background 0.15s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--glass-mid)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = n.is_read ? "transparent" : "rgba(124,107,255,0.08)")}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        flexShrink: 0,
                        borderRadius: "50%",
                        background: "var(--glass-soft)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {NOTIF_ICONS[n.type] || <Star size={14} style={{ color: "#FBBF24" }} />}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)", lineHeight: 1.35 }}>
                        {n.content}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--muted-2)", marginTop: 2 }}>
                        {timeAgo(n.created_at)}
                      </div>
                    </div>
                    {!n.is_read && (
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#7C6BFF", flexShrink: 0 }} />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}