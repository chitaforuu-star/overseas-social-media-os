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
import type { SampleRecord } from "@/lib/os-types";

export default function SamplesPage() {
  const { pick } = useLanguage();
  const os = useOS();

  const deleteSample = (id: string) => {
    os.replaceState({
      ...os.state,
      samples: os.state.samples.filter((item) => item.id !== id),
    });
  };

  const columns: Column<SampleRecord>[] = [
    { key: "creatorName", label: pick(copy.creatorCrm.table.creator) },
    { key: "productName", label: pick(copy.samples.fields.productName) },
    { key: "sku", label: pick(copy.samples.fields.sku) },
    { key: "color", label: pick(copy.samples.fields.color) },
    { key: "shippingAddress", label: pick(copy.samples.fields.shippingAddress), type: "textarea" },
    { key: "phone", label: pick(copy.samples.fields.phone) },
    { key: "country", label: pick(copy.samples.fields.country) },
    { key: "logisticsProvider", label: pick(copy.samples.fields.logisticsProvider) },
    { key: "trackingNumber", label: pick(copy.samples.fields.trackingNumber) },
    { key: "shippingStatus", label: pick(copy.samples.fields.shippingStatus) },
    { key: "deliveredDate", label: pick(copy.samples.fields.deliveredDate), type: "date" },
    {
      key: "id",
      label: pick(copy.creatorCrm.table.actions),
      render: (row) => (
        <AppButton
          variant="text"
          iconLeft={<Trash2 className="h-4 w-4" />}
          onClick={() => deleteSample(row.id)}
        >
          {pick(copy.actions.delete)}
        </AppButton>
      ),
    },
  ];

  return (
    <PageShell
      title={pick(copy.samples.title)}
      description={pick(copy.samples.description)}
      headerAction={
        <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addSample()}>
          {pick(copy.actions.addRow)}
        </AppButton>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.samples) },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader title={pick(copy.samples.title)} description={pick(copy.samples.description)} />
        {os.state.samples.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={pick(copy.samples.emptyTitle)}
              description={pick(copy.samples.emptyDescription)}
              action={
                <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addSample()}>
                  {pick(copy.actions.addRow)}
                </AppButton>
              }
            />
          </div>
        ) : (
          <div className="mt-4">
            <EditableTable
              rows={os.state.samples}
              columns={columns}
              onChange={(id, key, value) => os.updateSample(id, { [key]: value } as never)}
              primaryAction={
                <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />} onClick={() => os.addSample()}>
                  {pick(copy.actions.addRow)}
                </AppButton>
              }
              secondaryActions={
                <Link href="/creator-crm">
                  <AppButton variant="secondary">{pick(copy.nav.creatorCrm)}</AppButton>
                </Link>
              }
            />
          </div>
        )}
      </AppCard>
    </PageShell>
  );
}
