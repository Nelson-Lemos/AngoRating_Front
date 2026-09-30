import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center" style={{ minHeight: "80vh", padding: "24px 16px", position: "relative" }}>
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 420, height: 420, background: "radial-gradient(circle, rgba(56,189,248,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div className="auth-card" style={{ position: "relative" }}>
        <div className="flex items-center justify-center mb-6">
          <div
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, borderRadius: 14, background: "var(--gradient-brand)", boxShadow: "0 4px 16px rgba(124,107,255,0.4)" }}
          >
            <Sparkles size={20} color="white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1" style={{ color: "var(--foreground)" }}>Criar conta</h1>
        <p className="text-sm text-center mb-7" style={{ color: "var(--muted)" }}>Junte-se à comunidade AngoRating</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Nome</label>
            <div className="relative">
              <UserIcon size={15} className="absolute" style={{ left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)" }} />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="input-field"
                style={{ paddingLeft: 38 }}
              />
            </div>
          </div>
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
                placeholder="Mínimo 6 caracteres"
                minLength={6}
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
            {loading ? "Criando..." : <>Criar conta <ArrowRight size={15} /></>}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: "var(--muted)" }}>
          Já tem conta?{" "}
          <Link to="/login" className="font-semibold" style={{ color: "var(--primary-400)" }}>Entrar</Link>
        </p>
      </div>
    </div>
  );
}
