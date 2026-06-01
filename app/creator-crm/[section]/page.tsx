import { notFound } from "next/navigation";
import { CreatorCrmPage } from "@/components/os/creator-crm-page";
import type { CreatorStageKey } from "@/lib/os-types";

const sections: CreatorStageKey[] = [
  "finder",
  "auditor",
  "outreach",
  "collaboration",
  "sample",
  "content",
  "performance",
];

export default async function CreatorCrmSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (!sections.includes(section as CreatorStageKey)) {
    notFound();
  }

  return <CreatorCrmPage stage={section as CreatorStageKey} />;
}
