import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  rightSlot?: ReactNode;
};

export function PageHeader({ title, description, rightSlot }: PageHeaderProps) {
  return (
    <header className="os-page-header">
      <div className="min-w-0">
        <h1 className="os-page-title">{title}</h1>
        <p className="os-helper-text mt-2">{description}</p>
      </div>
      {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
    </header>
  );
}

