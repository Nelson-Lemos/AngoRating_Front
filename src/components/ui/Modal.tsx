import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export default function Modal({ open, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0" style={{ zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div className="modal-backdrop" onClick={onClose} />
      <div className={`modal-panel ${size === "sm" ? "modal-sm" : size === "md" ? "modal-md" : "modal-lg"}`}>
        {title && (
          <div className="modal-header">
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)" }}>{title}</h2>
            <button onClick={onClose} className="modal-close" aria-label="Fechar">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
