"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";
import type { CampaignRecord } from "@/lib/os-types";

function emptyCampaign(): CampaignRecord {
  return {
    id: "",
    campaignName: "",
    objective: "",
    targetMarket: "",
    creatorName: "",
    platform: "",
    status: "Planned",
    startDate: "",
    endDate: "",
    budget: "",
    trackingLink: "",
    discountCode: "",
    notes: "",
  };
}

type Props = {
  initialCampaignId: string | null;
};

export function CampaignNewClient({ initialCampaignId }: Props) {
  const { pick } = useLanguage();
  const os = useOS();
  const router = useRouter();

  const existingCampaign = useMemo(
    () => os.state.campaigns.find((item) => item.id === initialCampaignId),
    [initialCampaignId, os.state.campaigns],
  );
  const [form, setForm] = useState<CampaignRecord>(() =>
    existingCampaign ? { ...emptyCampaign(), ...existingCampaign } : emptyCampaign(),
  );

  const isEditing = Boolean(existingCampaign);

  const setField = <K extends keyof CampaignRecord>(key: K, value: CampaignRecord[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (isEditing && existingCampaign) {
      os.updateCampaign(existingCampaign.id, { ...form, id: existingCampaign.id });
      router.push(`/campaigns/${existingCampaign.id}`);
      return;
    }
    const id = os.addCampaign(form);
    router.push(`/campaigns/${id}`);
  };

  const statusOptions: CampaignRecord["status"][] = [
    "Planned",
    "Active",
    "Paused",
    "Completed",
  ];

  return (
    <PageShell
      title={isEditing ? "Edit Campaign" : pick(copy.actions.newCampaign)}
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
          { label: isEditing ? "Edit Campaign" : pick(copy.actions.newCampaign) },
        ]}
      />

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.actions.newCampaign)}
          description={pick(copy.campaigns.description)}
        />

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 sm:col-span-2">
            <span className="os-helper-text">{pick(copy.campaigns.fields.campaignName)}</span>
            <AppInput
              value={form.campaignName}
              onChange={(e) => setField("campaignName", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.objective)}</span>
            <AppInput value={form.objective} onChange={(e) => setField("objective", e.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.targetMarket)}</span>
            <AppInput
              value={form.targetMarket}
              onChange={(e) => setField("targetMarket", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.creatorName)}</span>
            <AppInput
              value={form.creatorName}
              onChange={(e) => setField("creatorName", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.platform)}</span>
            <AppInput value={form.platform} onChange={(e) => setField("platform", e.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.status)}</span>
            <AppSelect
              value={form.status}
              onChange={(e) => setField("status", e.target.value as CampaignRecord["status"])}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {pick(copy.campaigns.status[status])}
                </option>
              ))}
            </AppSelect>
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.startDate)}</span>
            <AppInput
              type="date"
              value={form.startDate}
              onChange={(e) => setField("startDate", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.endDate)}</span>
            <AppInput
              type="date"
              value={form.endDate}
              onChange={(e) => setField("endDate", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.budget)}</span>
            <AppInput value={form.budget} onChange={(e) => setField("budget", e.target.value)} />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.trackingLink)}</span>
            <AppInput
              value={form.trackingLink}
              onChange={(e) => setField("trackingLink", e.target.value)}
            />
          </label>
          <label className="space-y-1">
            <span className="os-helper-text">{pick(copy.campaigns.fields.discountCode)}</span>
            <AppInput
              value={form.discountCode}
              onChange={(e) => setField("discountCode", e.target.value)}
            />
          </label>
          <label className="space-y-1 sm:col-span-2">
            <span className="os-helper-text">{pick(copy.campaigns.fields.notes)}</span>
            <textarea
              className="os-textarea"
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <AppButton variant="primary" iconLeft={<Save className="h-4 w-4" />} onClick={handleSave}>
            {pick(copy.actions.save)}
          </AppButton>
          <Link href="/campaigns">
            <AppButton variant="secondary">{pick(copy.actions.back)}</AppButton>
          </Link>
        </div>
      </AppCard>
    </PageShell>
  );
}
