"use client";

import { useLanguage } from "@/components/os/language-context";
import { copy } from "@/lib/translations";
import type { CreatorStatus } from "@/lib/os-types";

type AppBadgeProps = {
  status: CreatorStatus;
};

const statusClassMap: Record<CreatorStatus, string> = {
  new: "os-badge os-badge-new",
  to_audit: "os-badge os-badge-audit",
  approved: "os-badge os-badge-approved",
  contacted: "os-badge os-badge-contacted",
  replied: "os-badge os-badge-replied",
  sample_sent: "os-badge os-badge-sample",
  content_scheduled: "os-badge os-badge-scheduled",
  posted: "os-badge os-badge-posted",
  reviewed: "os-badge os-badge-reviewed",
};

export function AppBadge({ status }: AppBadgeProps) {
  const { pick } = useLanguage();
  return <span className={statusClassMap[status]}>{pick(copy.status[status])}</span>;
}
