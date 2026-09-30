import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Sparkles, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from as string | undefined;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from || "/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "80vh", padding: "24px 16px", position: "relative" }}>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(124,107,255,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div className="auth-card" style={{ position: "relative" }}>
        <div className="flex items-center justify-center mb-6">
          <div
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, borderRadius: 14, background: "var(--gradient-brand)", boxShadow: "0 4px 16px rgba(124,107,255,0.4)" }}
          >
            <Sparkles size={20} color="white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--foreground)" }}>Entrar</h1>
        <p className="text-sm text-center mb-7" style={{ color: "var(--muted)" }}>Acesse a sua conta AngoRating</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute" style={{ left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="input-field"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute" style={{ left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
          {error && (
            <p style={{ fontSize: 12, padding: "8px 12px", borderRadius: 8, color: "var(--danger)", background: "var(--danger-light)", border: "1px solid rgba(251,113,133,0.3)" }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-block btn-md"
            style={{ boxShadow: loading ? "none" : "0 2px 12px rgba(124,107,255,0.4)" }}
          >
            {loading ? "Entrando..." : <>Entrar <ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: "var(--muted)" }}>
          Não tem conta?{" "}
          <Link to="/register" className="font-semibold" style={{ color: "var(--primary-400)" }}>Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
