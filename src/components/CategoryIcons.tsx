import React from "react";
import {
  Landmark, Stethoscope, GraduationCap, Cpu, Hotel, UtensilsCrossed,
  Smartphone, Plane, Fuel, ShoppingCart, ShieldCheck, Landmark as Government,
  FolderOpen, Briefcase,
} from "lucide-react";

/* Ícones reais (lucide) para as categorias — substitui emojis */
export const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  bancario: <Landmark size={20} />,
  saude: <Stethoscope size={20} />,
  educacao: <GraduationCap size={20} />,
  tecnologia: <Cpu size={20} />,
  hotelaria: <Hotel size={20} />,
  restauracao: <UtensilsCrossed size={20} />,
  telecomunicacoes: <Smartphone size={20} />,
  transportes: <Plane size={20} />,
  energia: <Fuel size={20} />,
  retalho: <ShoppingCart size={20} />,
  seguros: <ShieldCheck size={20} />,
  "publico-governo": <Government size={20} />,
};

export const CATEGORY_COLORS: Record<string, string> = {
  bancario: "#8b7bff",
  saude: "#22d3ee",
  educacao: "#f472b6",
  tecnologia: "#60a5fa",
  hotelaria: "#fbbf24",
  restauracao: "#fb923c",
  telecomunicacoes: "#4ade80",
  transportes: "#38bdf8",
  energia: "#facc15",
  retalho: "#f472b6",
  seguros: "#a78bfa",
  "publico-governo": "#94a3b8",
};

export function categoryIcon(slug?: string | null, size = 20): React.ReactNode {
  if (slug && CATEGORY_ICONS[slug]) {
    return React.cloneElement(CATEGORY_ICONS[slug] as React.ReactElement, { size });
  }
  return <Briefcase size={size} />;
}

export function categoryColor(slug?: string | null): string {
  if (slug && CATEGORY_COLORS[slug]) return CATEGORY_COLORS[slug];
  return "#8b7bff";
}
