"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

export default function CampaignsPage() {
  const { pick } = useLanguage();
  const os = useOS();

  return (
    <PageShell
      title={pick(copy.campaigns.title)}
      description={pick(copy.campaigns.description)}
      headerAction={
        <Link href="/campaigns/new">
          <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
            {pick(copy.actions.newCampaign)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.campaigns) },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.campaigns.title)}
          description={pick(copy.campaigns.description)}
        />

        {os.state.campaigns.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={pick(copy.campaigns.emptyTitle)}
              description={pick(copy.campaigns.emptyDescription)}
              action={
                <Link href="/campaigns/new">
                  <AppButton variant="primary">{pick(copy.actions.newCampaign)}</AppButton>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
            <table className="os-table min-w-[1100px]">
              <thead>
                <tr>
                  <th>{pick(copy.campaigns.fields.campaignName)}</th>
                  <th>{pick(copy.campaigns.fields.objective)}</th>
                  <th>{pick(copy.campaigns.fields.targetMarket)}</th>
                  <th>{pick(copy.campaigns.fields.creatorName)}</th>
                  <th>{pick(copy.campaigns.fields.platform)}</th>
                  <th>{pick(copy.campaigns.fields.status)}</th>
                  <th>{pick(copy.campaigns.fields.startDate)}</th>
                  <th>{pick(copy.campaigns.fields.endDate)}</th>
                  <th>{pick(copy.campaigns.fields.budget)}</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {os.state.campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-[#111827]">{campaign.campaignName || "—"}</p>
                        <p className="os-helper-text">{campaign.notes || "No notes yet"}</p>
                      </div>
                    </td>
                    <td>{campaign.objective || "—"}</td>
                    <td>{campaign.targetMarket || "—"}</td>
                    <td>{campaign.creatorName || "—"}</td>
                    <td>{campaign.platform || "—"}</td>
                    <td>
                      <span className="os-mini-tag">{pick(copy.campaigns.status[campaign.status])}</span>
                    </td>
                    <td>{campaign.startDate || "—"}</td>
                    <td>{campaign.endDate || "—"}</td>
                    <td>{campaign.budget || "—"}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/campaigns/${campaign.id}`}>
                          <AppButton variant="text">{pick(copy.actions.view)}</AppButton>
                        </Link>
                        <Link href={`/campaigns/new?id=${campaign.id}`}>
                          <AppButton variant="text">{pick(copy.actions.edit)}</AppButton>
                        </Link>
                        <AppButton
                          variant="text"
                          iconLeft={<Trash2 className="h-4 w-4" />}
                          onClick={() => os.deleteCampaign(campaign.id)}
                        >
                          {pick(copy.actions.delete)}
                        </AppButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AppCard>
    </PageShell>
  );
}
