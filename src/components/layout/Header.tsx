import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, LogOut, User, LayoutDashboard, Shield, Sparkles, Menu, Sun, Moon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import NotificationsPanel from "./NotificationsPanel";

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <div className="header-logo-mark">
            <Sparkles size={15} color="white" />
          </div>
          <span className="header-logo-text">
            AngoRating
          </span>
        </Link>

        <nav className="nav">
          {[
            { to: "/search", label: "Explorar" },
            { to: "/rankings", label: "Rankings" },
            { to: "/dashboard", label: "Meu painel" },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="nav-link"
              style={{
                color: isActive(to) ? "var(--foreground)" : "var(--muted)",
                background: isActive(to) ? "rgba(124,107,255,0.18)" : "transparent",
                border: isActive(to) ? "1px solid rgba(124,107,255,0.3)" : "1px solid transparent",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="header-search">
          <Link to="/search" className="header-search-link">
            <Search size={14} />
            <span>Pesquisar empresas...</span>
          </Link>
        </div>

        <div className="header-actions">
          <button
            onClick={toggleTheme}
            className="header-icon-btn"
            title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            aria-label="Alternar modo claro/escuro"
            style={{
              color: "var(--muted)",
              border: "1px solid var(--border)",
              background: "var(--surface-2)",
              width: 34,
              height: 34,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 2,
              marginRight: 2,
              transition: "color 0.2s ease, background 0.2s ease, border-color 0.2s ease",
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isAuthenticated ? (
            <>
              <NotificationsPanel />
              {isAdmin && (
                <Link
                  to="/admin"
                  className="header-icon-btn"
                  title="Admin"
                  style={{
                    color: "#FBBF24",
                    background: isActive("/admin") ? "rgba(251,191,36,0.16)" : "transparent",
                    border: "1px solid rgba(251,191,36,0.25)",
                  }}
                >
                  <Shield size={16} />
                </Link>
              )}
              <Link
                to="/dashboard"
                className="header-icon-btn"
                title="Dashboard"
                style={{
                  color: isActive("/dashboard") ? "var(--foreground)" : "var(--muted)",
                  background: isActive("/dashboard") ? "rgba(124,107,255,0.18)" : "transparent",
                }}
              >
                <LayoutDashboard size={16} />
              </Link>
              <div
                className="header-auth-btn"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  marginLeft: 2,
                  background: "var(--gradient-brand)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 0 14px rgba(124,107,255,0.4)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 13,
                }}
                title={user?.name}
              >
                {(user?.name || "U")[0].toUpperCase()}
              </div>
              <button
                onClick={() => { logout(); window.location.href = "/"; }}
                className="header-icon-btn"
                title="Sair"
                style={{ color: "var(--muted)" }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link to="/login" className="header-auth-btn" style={{ color: "var(--foreground-soft)" }}>
                Entrar
              </Link>
              <Link
                to="/register"
                className="header-auth-btn"
                style={{
                  background: "var(--gradient-brand)",
                  color: "#FFFFFF",
                  padding: "9px 16px",
                  borderRadius: 10,
                  boxShadow: "0 3px 12px rgba(124,107,255,0.4)",
                }}
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
