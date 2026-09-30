import React from "react";
import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, style, ...props }: InputProps) {
  return (
    <div style={{ width: "100%" }}>
      {label && (
        <label
          className="input-label"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          {label}
        </label>
      )}
      <input
        className={clsx(
          "input-field",
          error && "input-error",
          className
        )}
        style={{ color: "var(--foreground)", fontFamily: "Inter, system-ui, sans-serif", ...style }}
        {...props}
      />
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}
