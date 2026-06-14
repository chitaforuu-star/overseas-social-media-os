"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, PencilLine } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

export default function ContentHubDetailPage() {
  const { pick } = useLanguage();
  const os = useOS();
  const params = useParams<{ id: string }>();
  const item = os.state.contentMaterials.find((record) => record.id === params.id);

  if (!item) {
    return (
      <PageShell
        title={pick(copy.contentHub.title)}
        description={pick(copy.contentHub.description)}
        headerAction={
          <Link href="/content-hub">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.contentHub), href: "/content-hub" },
            { label: "Content" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState title={pick(copy.contentHub.emptyTitle)} description={pick(copy.contentHub.emptyDescription)} />
        </AppCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={item.topic || "Content Item"}
      description={pick(copy.contentHub.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/content-hub">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
          <Link href={`/content-hub/new?id=${item.id}`}>
            <AppButton variant="secondary" iconLeft={<PencilLine className="h-4 w-4" />}>
              {pick(copy.actions.edit)}
            </AppButton>
          </Link>
        </div>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.contentHub), href: "/content-hub" },
          { label: item.topic || "Content" },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5">
          <SectionHeader title="Content Details" description="Topic, format, insight, and status." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Platform", item.platform],
              ["Topic", item.topic],
              ["Format", item.format],
              ["Status", item.status],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <p className="os-helper-text">{label}</p>
                <p className="mt-1 text-sm text-[#111827]">{value || "—"}</p>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader title="Insight" description="Notes for content production." />
          <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
            <p className="os-helper-text">Insight</p>
            <p className="mt-1 text-sm text-[#111827]">{item.insight || "—"}</p>
          </div>
        </AppCard>
      </section>
    </PageShell>
  );
}
