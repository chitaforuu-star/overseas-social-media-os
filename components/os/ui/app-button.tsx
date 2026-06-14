"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text";
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export function AppButton({
  variant = "secondary",
  iconLeft,
  iconRight,
  className = "",
  children,
  ...props
}: AppButtonProps) {
  const base =
    variant === "primary"
      ? "os-btn os-btn-primary"
      : variant === "text"
        ? "os-btn os-btn-text"
        : "os-btn os-btn-secondary";

  return (
    <button {...props} className={`${base} ${className}`.trim()}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}

