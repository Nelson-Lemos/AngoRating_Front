import React, { useState } from "react";

/* =========================================================
   BrandAssets — Imagens reais de empresas angolanas.
   Usamos logótipos oficiais (Wikimedia Commons) quando
   disponíveis, com fallback elegante em gradiente + iniciais
   quando a imagem não carrega. Ícones reais p/ categorias.
   ========================================================= */

export const COMPANY_IMAGES: Record<string, string> = {
  // Transportes aéreos — logótipo oficial (fiável)
  "TAAG": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/TAAG_Angola_Airlines_Logo.svg/500px-TAAG_Angola_Airlines_Logo.svg.png?20241013204959",
  "Transportes Aéreos Angolanos": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/TAAG_Angola_Airlines_Logo.svg/500px-TAAG_Angola_Airlines_Logo.svg.png?20241013204959",
  // Telecom — logótipo oficial (SVG a partir do Wikimedia, verificado)
  "Unitel": "https://upload.wikimedia.org/wikipedia/commons/c/cc/Unitel_Logo_2005.svg",
  // Energia — logótipo oficial (SVG do Wikimedia, verificado)
  "Sonangol": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Sonangol_Logo.svg",
  // Banca — logótipo oficial (Wikimedia Commons, verificado)
  "BAI": "https://upload.wikimedia.org/wikipedia/commons/4/4f/BAI_-_.jpg",
  "Banco Angolano de Investimentos": "https://upload.wikimedia.org/wikipedia/commons/4/4f/BAI_-_.jpg",
  // Retalho — logótipo oficial Kero (CDN Logopedia, verificado)
  "Kero": "https://static.wikia.nocookie.net/logopedia/images/a/a3/Kero.png",
};

/* Paleta por empresa — usada no monograma premium (fallback) e no banner.
   Cada marca tem as suas cores para identidade credível. */
export const COMPANY_COLORS: Record<string, string> = {
  "TAAG": "#1d4ed8",
  "Unitel": "#e11d48",
  "Sonangol": "#047857",
  "BAI": "#2563eb",
  "Kero": "#ef4444",
  "BFA": "#991b1b",
  "Banco BIC": "#0e7490",
  "ENSA": "#059669",
  "Hotel Presidente": "#7c3aed",
  "Hotel Intercontinental": "#4f46e5",
  "Benguela Plaza": "#d97706",
  "Clínica Sagrada Esperança": "#0d9488",
  "Univ. Agostinho Neto": "#0284c7",
  "Universidade Agostinho Neto": "#0284c7",
  "Restaurante Belmondo": "#ea580c",
  "AfricaLink Tech": "#7c6bff",
};

const BRAND_COLORS: Record<string, string> = {
  "TAAG": "linear-gradient(135deg,#1d4ed8,#7c3aed)",
  "Unitel": "linear-gradient(135deg,#e11d48,#f59e0b)",
  "Sonangol": "linear-gradient(135deg,#047857,#10b981)",
  "BAI": "linear-gradient(135deg,#1e40af,#2563eb)",
  "BFA": "linear-gradient(135deg,#991b1b,#ef4444)",
  "ENSA": "linear-gradient(135deg,#065f46,#10b981)",
  "Kero": "linear-gradient(135deg,#b91c1c,#f97316)",
  "Banco BIC": "linear-gradient(135deg,#0e7490,#06b6d4)",
  "Hotel Presidente": "linear-gradient(135deg,#6d28d9,#a855f7)",
  "Hotel Intercontinental": "linear-gradient(135deg,#4338ca,#818cf8)",
  "Clínica Sagrada Esperança": "linear-gradient(135deg,#0d9488,#2dd4bf)",
  "Benguela Plaza": "linear-gradient(135deg,#b45309,#f59e0b)",
  "Univ. Agostinho Neto": "linear-gradient(135deg,#0369a1,#38bdf8)",
  "Universidade Agostinho Neto": "linear-gradient(135deg,#0369a1,#38bdf8)",
  "Restaurante Belmondo": "linear-gradient(135deg,#ea580c,#fbbf24)",
  "AfricaLink Tech": "linear-gradient(135deg,#573cf0,#7c6bff)",
};

/* Uma fórmula estável: não precisa de chave certa — usa a primeira letra */
export function companyImageUrl(name: string | null | undefined): string | undefined {
  if (!name) return undefined;
  const nm = name.trim();
  for (const key of Object.keys(COMPANY_IMAGES)) {
    if (nm.toUpperCase() === key.toUpperCase()) return COMPANY_IMAGES[key];
    if (nm.toUpperCase().includes(key.toUpperCase()) || key.toUpperCase().includes(nm.toUpperCase())) {
      return COMPANY_IMAGES[key];
    }
  }
  return undefined;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function brandGradient(name: string): string {
  const nm = name.toUpperCase();
  for (const key of Object.keys(BRAND_COLORS)) {
    if (nm.includes(key.toUpperCase()) || key.toUpperCase().includes(nm)) {
      return BRAND_COLORS[key];
    }
  }
  return "linear-gradient(135deg,#7c6bff,#8b7bff)";
}

/* Cor principal da marca (para banners/suportes) */
export function companyBrandColor(name: string | null | undefined): string {
  if (!name) return "#7c6bff";
  const nm = name.toUpperCase().trim();
  for (const key of Object.keys(COMPANY_COLORS)) {
    const k = key.toUpperCase();
    if (nm === k || nm.includes(k) || k.includes(nm)) return COMPANY_COLORS[key];
  }
  return "#7c6bff";
}

interface CompanyGraphicProps {
  name: string | null | undefined;
  size?: number;
  radius?: number;
  img?: string | null;
}

/* Logo/avatar de empresa com fallback em gradiente + inicial */
export function CompanyGraphic({ name, size = 48, radius, img }: CompanyGraphicProps) {
  const url = img || companyImageUrl(name);
  const [failed, setFailed] = useState(false);
  const rad = radius ?? Math.round(size * 0.24);
  const nm = name || "";

  if (!url || failed) {
    return (
      <div
        aria-label={nm}
        style={{
          width: size,
          height: size,
          borderRadius: rad,
          background: brandGradient(nm),
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          fontSize: Math.round(size * 0.4),
          letterSpacing: "-0.02em",
          flexShrink: 0,
          boxShadow: "0 6px 18px rgba(15,23,42,0.35)",
          border: "1px solid rgba(255,255,255,0.14)",
          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        {initials(nm) || "?"}
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: rad,
        overflow: "hidden",
        background: "radial-gradient(circle at 30% 25%, #ffffff, #dbe1ee)",
        border: "1px solid rgba(255,255,255,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 6px 18px rgba(15,23,42,0.35)",
      }}
    >
      <img
        src={url}
        alt={nm}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "contain", padding: Math.round(size * 0.06) }}
      />
    </div>
  );
}

interface BrandCoverProps {
  name: string | null | undefined;
  img?: string | null;
  height?: number;
}

/* Capa grande de card — imagem real da empresa bem visível, ou arte de marca
   colorida com monograma grande. Usada para tornar os cards visuais e claros. */
export function BrandCover({ name, img, height = 160 }: BrandCoverProps) {
  const nm = name || "";
  const url = img || companyImageUrl(nm);
  const [failed, setFailed] = useState(false);
  const color = companyBrandColor(nm);
  const grad = brandGradient(nm);

  if (!url || failed) {
    return (
      <div
        aria-label={nm}
        style={{
          height,
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background: grad,
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.16,
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: "70%",
            height: "120%",
            background: "radial-gradient(circle, rgba(255,255,255,0.28) 0%, transparent 60%)",
          }}
        />
        <span
          style={{
            position: "relative",
            color: "#fff",
            fontWeight: 800,
            fontSize: Math.round(height * 0.42),
            letterSpacing: "-0.03em",
            textShadow: "0 2px 10px rgba(0,0,0,0.25)",
          }}
        >
          {initials(nm) || "?"}
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        height,
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle at 30% 20%, #ffffff, #dbe1ee)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={url}
        alt={nm}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{
          maxWidth: "62%",
          maxHeight: "62%",
          objectFit: "contain",
          filter: `drop-shadow(0 6px 16px ${color}44)`,
        }}
      />
    </div>
  );
}

interface CompanyBannerProps {
  name: string | null | undefined;
  img?: string | null;
}

/* Banner hero no topo da página de empresa — fundo com a cor/logo da marca.
   Mostra o logótipo real em destaque; se falhar, usa monograma premium. */
export function CompanyBanner({ name, img }: CompanyBannerProps) {
  const nm = name || "";
  const url = img || companyImageUrl(nm);
  const color = companyBrandColor(nm);
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="company-banner"
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "var(--radius-xl)",
        background: `radial-gradient(900px 360px at 20% -20%, ${color}55 0%, transparent 60%),
                     radial-gradient(700px 320px at 100% 120%, ${color}40 0%, transparent 55%),
                     var(--surface)`,
        border: "1px solid var(--border)",
        height: 64,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "0 20px",
          opacity: 0.9,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.7)",
            flexShrink: 0,
          }}
        >
          {!url || failed ? (
            <span
              style={{
                background: brandGradient(nm),
                color: "#fff",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 17,
                borderRadius: 12,
              }}
            >
              {initials(nm) || "?"}
            </span>
          ) : (
            <img
              src={url}
              alt={nm}
              loading="lazy"
              onError={() => setFailed(true)}
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: 6 }}
            />
          )}
        </div>
        <span
          style={{
            marginLeft: 14,
            fontSize: 13,
            fontWeight: 700,
            color: "var(--foreground-soft)",
            letterSpacing: "0.01em",
          }}
        >
          {nm}
        </span>
      </div>
    </div>
  );
}
