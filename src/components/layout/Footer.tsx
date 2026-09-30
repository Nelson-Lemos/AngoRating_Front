import React from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="flex items-center flex-wrap" style={{ gap: 18 }}>
          <div className="footer-brand">
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--gradient-brand)",
                boxShadow: "0 0 16px rgba(124,107,255,0.4)",
              }}
            >
              <Sparkles size={13} color="white" />
            </div>
            <span>AngoRating</span>
          </div>
          <span className="footer-tagline">Reputação empresarial angolana</span>
          <nav className="footer-nav">
            <Link to="/search">Explorar</Link>
            <Link to="/rankings">Rankings</Link>
            <Link to="/register">Junta-te</Link>
          </nav>
        </div>
        <span className="footer-copy">© 2026 AngoRating · Todos os direitos reservados</span>
      </div>
    </footer>
  );
}
