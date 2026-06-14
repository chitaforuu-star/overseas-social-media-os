"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Link2, Plus, Trash2, WandSparkles } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";
import { summarizeProfileUrl } from "@/lib/social-profile";
import type { CreatorStatus } from "@/lib/os-types";

const statusOptions: CreatorStatus[] = [
  "new",
  "to_audit",
  "approved",
  "contacted",
  "replied",
  "sample_sent",
  "content_scheduled",
  "posted",
  "reviewed",
];

export default function CreatorCrmPage() {
  const { pick } = useLanguage();
  const os = useOS();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileUrl, setProfileUrl] = useState("");

  const savedCreators = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return os.state.creators.filter((creator) => {
      const matchKeyword =
        !keyword ||
        [
          creator.creatorName,
          creator.platform,
          creator.country,
          creator.niche,
          creator.followers,
          creator.email,
          creator.notes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(keyword);
      const matchStatus = statusFilter === "all" || creator.status === statusFilter;
      return matchKeyword && matchStatus;
    });
  }, [os.state.creators, search, statusFilter]);

  const handlePasteLink = () => {
    if (!profileUrl.trim()) return;

    const parsed = summarizeProfileUrl(profileUrl);
    os.addCreatorDraft({
      source: "link",
      creatorName: parsed.creatorName,
      platform: parsed.platform,
      profileLink: profileUrl,
      country: "",
      language: "",
      niche: "",
      keyword: "",
      followers: "",
      averageViews: "",
      email: "",
      whatsapp: "",
      instagram: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      status: "to_audit",
      rate: "",
      targetProduct: "",
      collaborationType: "",
      nextStep: "Complete review and save to CRM",
      lastContact: "",
      followUpDate: "",
      notes: parsed.platform
        ? `Parsed ${parsed.platform} profile${parsed.handle ? ` • ${parsed.handle}` : ""}`
        : "Profile link needs manual review",
      fitScore: "",
      audienceMatch: "",
      contentStyleMatch: "",
      engagementQuality: "",
      brandSafety: "",
      collaborationPotential: "",
      redFlags: "",
      recommendation: "Maybe",
      auditNotes: "",
    });
    setProfileUrl("");
  };

  return (
    <PageShell
      title={pick(copy.creatorCrm.title)}
      description={pick(copy.creatorCrm.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/creator-crm/new">
            <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
              {pick(copy.creatorCrm.actions.addCreatorManually)}
            </AppButton>
          </Link>
          <Link href="/creator-auditor">
            <AppButton variant="secondary" iconLeft={<WandSparkles className="h-4 w-4" />}>
              {pick(copy.creatorCrm.actions.runAudit)}
            </AppButton>
          </Link>
        </div>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorCrm) },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <AppCard className="p-5" tone="pink">
          <SectionHeader
            title={pick(copy.creatorCrm.title)}
            description={pick(copy.creatorCrm.emptyDescription)}
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/creator-crm/new">
              <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
                {pick(copy.creatorCrm.actions.addCreatorManually)}
              </AppButton>
            </Link>
            <Link href="/creator-finder">
              <AppButton variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                {pick(copy.creatorCrm.actions.importFromFinder)}
              </AppButton>
            </Link>
            <Link href="/creator-auditor">
              <AppButton variant="secondary" iconLeft={<WandSparkles className="h-4 w-4" />}>
                {pick(copy.creatorCrm.actions.runAudit)}
              </AppButton>
            </Link>
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.creatorCrm.actions.pasteProfileLink)}
            description={pick(copy.creatorFinder.emptyDescription)}
          />
          <div className="mt-4 flex gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">{pick(copy.creatorCrm.form.profileUrl)}</span>
              <AppInput
                value={profileUrl}
                onChange={(event) => setProfileUrl(event.target.value)}
                placeholder="Paste TikTok, Instagram, YouTube, or Facebook profile URL"
              />
            </label>
            <AppButton
              variant="primary"
              iconLeft={<Link2 className="h-4 w-4" />}
              onClick={handlePasteLink}
            >
              {pick(copy.actions.analyzeCreator)}
            </AppButton>
          </div>
          <p className="os-helper-text mt-3">
            If the platform or handle cannot be parsed, the draft stays in review mode and you can
            fill in the missing fields manually.
          </p>
        </AppCard>
      </section>

      {os.state.creatorDrafts.length > 0 ? (
        <AppCard className="p-5" tone="purple">
          <SectionHeader
            title={pick(copy.creatorCrm.draftsTitle)}
            description={pick(copy.creatorCrm.draftsDescription)}
          />
          <div className="mt-4 space-y-3">
            {os.state.creatorDrafts.map((draft) => (
              <div key={draft.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="os-card-title">
                        {draft.creatorName || "Draft candidate"}
                      </span>
                      <AppBadge status={draft.status} />
                    </div>
                    <p className="os-helper-text">
                      {draft.platform || "Platform pending"}{" "}
                      {draft.notes ? `• ${draft.notes}` : "• No notes yet"}
                    </p>
                    <p className="text-sm text-[#374151]">
                      {draft.country ? `${draft.country} • ` : ""}
                      {draft.niche || "Niche pending"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AppButton
                      variant="primary"
                      onClick={() => os.saveCreatorDraftToCRM(draft.id)}
                    >
                      {pick(copy.creatorCrm.actions.saveDraftToCrm)}
                    </AppButton>
                    <AppButton
                      variant="secondary"
                      iconLeft={<Trash2 className="h-4 w-4" />}
                      onClick={() => os.deleteCreatorDraft(draft.id)}
                    >
                      {pick(copy.actions.delete)}
                    </AppButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AppCard>
      ) : null}

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.creatorCrm.title)}
          description={pick(copy.creatorCrm.emptyDescription)}
          action={
            <div className="flex flex-wrap gap-2">
              <label className="min-w-[220px]">
                <span className="sr-only">{pick(copy.common.search)}</span>
                <AppInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={pick(copy.creatorCrm.toolbar.searchPlaceholder)}
                />
              </label>
              <AppSelect
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">{pick(copy.creatorCrm.toolbar.all)}</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {pick(copy.status[status])}
                  </option>
                ))}
              </AppSelect>
            </div>
          }
        />

        {savedCreators.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title={pick(copy.creatorCrm.emptyTitle)}
              description={pick(copy.creatorCrm.emptyDescription)}
              action={
                <div className="flex flex-wrap gap-2">
                  <Link href="/creator-crm/new">
                    <AppButton variant="primary">
                      {pick(copy.creatorCrm.actions.addCreatorManually)}
                    </AppButton>
                  </Link>
                  <Link href="/creator-finder">
                    <AppButton variant="secondary">
                      {pick(copy.creatorCrm.actions.importFromFinder)}
                    </AppButton>
                  </Link>
                </div>
              }
            />
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
            <table className="os-table min-w-[1200px]">
              <thead>
                <tr>
                  <th>{pick(copy.creatorCrm.table.creator)}</th>
                  <th>{pick(copy.creatorCrm.table.platform)}</th>
                  <th>{pick(copy.creatorCrm.table.country)}</th>
                  <th>{pick(copy.creatorCrm.table.niche)}</th>
                  <th>{pick(copy.creatorCrm.table.followers)}</th>
                  <th>{pick(copy.creatorCrm.table.status)}</th>
                  <th>Email</th>
                  <th>Note</th>
                  <th>{pick(copy.creatorCrm.table.actions)}</th>
                </tr>
              </thead>
              <tbody>
                {savedCreators.map((creator) => (
                  <tr key={creator.id}>
                    <td>
                      <div>
                        <p className="font-semibold text-[#111827]">
                          {creator.creatorName || "Untitled creator"}
                        </p>
                        <p className="os-helper-text">{creator.profileLink || "Profile pending"}</p>
                      </div>
                    </td>
                    <td>{creator.platform || "Pending"}</td>
                    <td>{creator.country || "Pending"}</td>
                    <td>{creator.niche || "Pending"}</td>
                    <td>{creator.followers || "Pending"}</td>
                    <td>
                      <AppBadge status={creator.status} />
                    </td>
                    <td>{creator.email || "Pending"}</td>
                    <td className="max-w-[240px]">{creator.notes || "Pending"}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/creator-crm/${creator.id}`}>
                          <AppButton variant="text">{pick(copy.actions.view)}</AppButton>
                        </Link>
                        <Link href={`/creator-crm/new?id=${creator.id}`}>
                          <AppButton variant="text">{pick(copy.actions.edit)}</AppButton>
                        </Link>
                        <Link
                          href={
                            creator.profileLink
                              ? `/creator-auditor?profile=${encodeURIComponent(creator.profileLink)}`
                              : "/creator-auditor"
                          }
                        >
                          <AppButton variant="text">{pick(copy.creatorCrm.actions.runAudit)}</AppButton>
                        </Link>
                        <Link href={`/outreach?creatorId=${creator.id}`}>
                          <AppButton variant="text">
                            {pick(copy.creatorCrm.actions.addOutreachNote)}
                          </AppButton>
                        </Link>
                        <AppButton
                          variant="text"
                          iconLeft={<Trash2 className="h-4 w-4" />}
                          onClick={() => os.deleteCreator(creator.id)}
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
