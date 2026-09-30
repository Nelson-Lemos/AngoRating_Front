import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "primary";
  size?: "sm" | "md";
}

export default function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "badge",
        size === "sm" ? "badge-sm" : "badge-md",
        variant === "default" && "badge-default",
        variant === "success" && "badge-success",
        variant === "warning" && "badge-warning",
        variant === "danger" && "badge-danger",
        variant === "info" && "badge-info",
        variant === "primary" && "badge-primary"
      )}
    >
      {children}
    </span>
  );
}
