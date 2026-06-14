"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

export default function PerformanceDetailPage() {
  const { pick } = useLanguage();
  const os = useOS();
  const params = useParams<{ id: string }>();
  const performance = os.state.performance.find((item) => item.id === params.id);

  if (!performance) {
    return (
      <PageShell
        title={pick(copy.performance.title)}
        description={pick(copy.performance.description)}
        headerAction={
          <Link href="/performance">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.performance), href: "/performance" },
            { label: "Performance" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState title={pick(copy.performance.emptyTitle)} description={pick(copy.performance.emptyDescription)} />
        </AppCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={performance.creatorName || "Performance Review"}
      description={pick(copy.performance.description)}
      headerAction={
        <Link href="/performance">
          <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {pick(copy.actions.back)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.performance), href: "/performance" },
          { label: performance.creatorName || "Performance Review" },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader title="Performance Summary" description="Views, clicks, orders, revenue, and ROI." />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Views", performance.views],
            ["Clicks", performance.clicks],
            ["Orders", performance.orders],
            ["ROI", performance.roi],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">{label}</p>
              <p className="mt-1 text-sm text-[#111827]">{value || "—"}</p>
            </div>
          ))}
        </div>
      </AppCard>
    </PageShell>
  );
}
