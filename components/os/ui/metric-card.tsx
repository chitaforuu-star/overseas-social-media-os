import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  tag?: string;
  icon?: ReactNode;
  tone?: "default" | "pink" | "purple";
};

export function MetricCard({
  label,
  value,
  hint,
  tag,
  icon,
  tone = "default",
}: MetricCardProps) {
  const toneClass =
    tone === "pink"
      ? "bg-[#FFF1F6]"
      : tone === "purple"
        ? "bg-[#F5F3FF]"
        : "bg-white";

  return (
    <article className={`os-metric-card ${toneClass}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="os-helper-text">{label}</p>
          <p className="os-metric-value">{value}</p>
        </div>
        {icon}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="os-helper-text">{hint}</p>
        {tag ? <span className="os-mini-tag">{tag}</span> : null}
      </div>
    </article>
  );
}

