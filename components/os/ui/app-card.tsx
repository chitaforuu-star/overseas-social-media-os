import type { ReactNode } from "react";

type AppCardProps = {
  children: ReactNode;
  className?: string;
  tone?: "default" | "pink" | "purple" | "muted";
};

export function AppCard({ children, className = "", tone = "default" }: AppCardProps) {
  const toneClass =
    tone === "pink"
      ? "bg-[#FFF1F6]"
      : tone === "purple"
        ? "bg-[#F5F3FF]"
        : tone === "muted"
          ? "bg-[#FAFAFA]"
          : "bg-white";

  return <section className={`os-card ${toneClass} ${className}`.trim()}>{children}</section>;
}

