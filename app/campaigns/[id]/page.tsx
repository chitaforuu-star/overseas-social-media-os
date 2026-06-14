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

export default function CampaignDetailPage() {
  const { pick } = useLanguage();
  const os = useOS();
  const params = useParams<{ id: string }>();
  const campaign = os.state.campaigns.find((item) => item.id === params.id);

  if (!campaign) {
    return (
      <PageShell
        title={pick(copy.campaigns.title)}
        description={pick(copy.campaigns.description)}
        headerAction={
          <Link href="/campaigns">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
        }
      >
        <Breadcrumb
          items={[
            { label: pick(copy.nav.dashboard), href: "/" },
            { label: pick(copy.nav.campaigns), href: "/campaigns" },
            { label: "Campaign" },
          ]}
        />
        <AppCard className="p-5">
          <EmptyState title={pick(copy.campaigns.emptyTitle)} description={pick(copy.campaigns.emptyDescription)} />
        </AppCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={campaign.campaignName || "Campaign"}
      description={pick(copy.campaigns.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/campaigns">
            <AppButton variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
              {pick(copy.actions.back)}
            </AppButton>
          </Link>
          <Link href={`/campaigns/new?id=${campaign.id}`}>
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
          { label: pick(copy.nav.campaigns), href: "/campaigns" },
          { label: campaign.campaignName || "Campaign" },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <AppCard className="p-5">
          <SectionHeader title="Campaign Overview" description="Core setup and collaboration context." />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["Campaign Name", campaign.campaignName],
              ["Objective", campaign.objective],
              ["Target Market", campaign.targetMarket],
              ["Creator Name", campaign.creatorName],
              ["Platform", campaign.platform],
              ["Status", pick(copy.campaigns.status[campaign.status])],
              ["Start Date", campaign.startDate],
              ["End Date", campaign.endDate],
              ["Budget", campaign.budget],
              ["Discount Code", campaign.discountCode],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
                <p className="os-helper-text">{label}</p>
                <p className="mt-1 text-sm text-[#111827]">{value || "—"}</p>
              </div>
            ))}
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader title="Tracking & Notes" description="Links, codes, and operational notes." />
          <div className="mt-4 grid gap-3">
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Tracking Link</p>
              <p className="mt-1 text-sm text-[#111827]">{campaign.trackingLink || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4">
              <p className="os-helper-text">Notes</p>
              <p className="mt-1 text-sm text-[#111827]">{campaign.notes || "—"}</p>
            </div>
          </div>
        </AppCard>
      </section>
    </PageShell>
  );
}
