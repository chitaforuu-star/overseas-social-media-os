"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { EditableTable, type Column } from "@/components/os/editable-table";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";
import type { PerformanceRecord } from "@/lib/os-types";

export default function PerformancePage() {
  const { pick } = useLanguage();
  const os = useOS();

  const deletePerformance = (id: string) => {
    os.replaceState({
      ...os.state,
      performance: os.state.performance.filter((item) => item.id !== id),
    });
  };

  const columns: Column<PerformanceRecord>[] = [
    { key: "creatorName", label: pick(copy.creatorCrm.table.creator) },
    { key: "views", label: pick(copy.performance.fields.views) },
    { key: "likes", label: pick(copy.performance.fields.likes) },
    { key: "comments", label: pick(copy.performance.fields.comments) },
    { key: "clicks", label: pick(copy.performance.fields.clicks) },
    { key: "orders", label: pick(copy.performance.fields.orders) },
    { key: "revenue", label: pick(copy.performance.fields.revenue) },
    { key: "conversionRate", label: pick(copy.performance.fields.conversionRate) },
    { key: "roi", label: pick(copy.performance.fields.roi) },
    {
      key: "finalResult",
      label: pick(copy.performance.fields.finalResult),
      type: "select",
      options: ["Reuse", "Observe", "Stop"],
    },
    {
      key: "id",
      label: pick(copy.creatorCrm.table.actions),
      render: (row) => (
        <AppButton
          variant="text"
          iconLeft={<Trash2 className="h-4 w-4" />}
          onClick={() => deletePerformance(row.id)}
        >
          {pick(copy.actions.delete)}
        </AppButton>
      ),
    },
  ];

  return (
    <PageShell
      title={pick(copy.performance.title)}
      description={pick(copy.performance.description)}
      headerAction={
        <AppButton
          variant="primary"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={() => os.addPerformance()}
        >
          {pick(copy.actions.addRow)}
        </AppButton>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.performance) },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader title={pick(copy.performance.title)} description={pick(copy.performance.description)} />
        {os.state.performance.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={pick(copy.performance.emptyTitle)}
              description={pick(copy.performance.emptyDescription)}
              action={
                <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addPerformance()}>
                  {pick(copy.actions.addRow)}
                </AppButton>
              }
            />
          </div>
        ) : (
          <div className="mt-4">
            <EditableTable
              rows={os.state.performance}
              columns={columns}
              onChange={(id, key, value) => os.updatePerformance(id, { [key]: value } as never)}
              primaryAction={
                <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addPerformance()}>
                  {pick(copy.actions.addRow)}
                </AppButton>
              }
              secondaryActions={
                <Link href="/campaigns">
                  <AppButton variant="secondary">{pick(copy.nav.campaigns)}</AppButton>
                </Link>
              }
            />
          </div>
        )}
      </AppCard>
    </PageShell>
  );
}
