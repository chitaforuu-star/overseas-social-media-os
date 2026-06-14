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

export default function SampleDetailPage() {
  const { pick } = useLanguage();
  const os = useOS();
  const params = useParams<{ id: string }>();
  const sample = os.state.samples.find((item) => item.id === params.id);

  if (!sample) {
    return (
      <PageShell
        title={pick(copy.samples.title)}
        description={pick(copy.samples.description)}
        headerAction={
          <Link href="/samples">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.samples), href: "/samples" },
            { label: "Sample" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState title={pick(copy.samples.emptyTitle)} description={pick(copy.samples.emptyDescription)} />
        </AppCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={sample.productName || "Sample"}
      description={pick(copy.samples.description)}
      headerAction={
        <Link href="/samples">
          <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {pick(copy.actions.back)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.samples), href: "/samples" },
          { label: sample.productName || "Sample" },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader title="Sample Details" description="Shipping and delivery information." />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Creator Name", sample.creatorName],
            ["Product Name", sample.productName],
            ["SKU", sample.sku],
            ["Color", sample.color],
            ["Country", sample.country],
            ["Logistics Provider", sample.logisticsProvider],
            ["Tracking Number", sample.trackingNumber],
            ["Shipping Status", sample.shippingStatus],
            ["Delivered Date", sample.deliveredDate],
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
