import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="os-section-title">{title}</h2>
        {description ? <p className="os-helper-text mt-1">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

