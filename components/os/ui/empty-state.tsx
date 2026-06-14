import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="os-empty-state">
      <div className="space-y-1">
        <h3 className="os-card-title">{title}</h3>
        <p className="os-helper-text">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
