"use client"

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Plus, WandSparkles, Link2, Trash2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { useSupabaseAuth } from "@/components/os/supabase-auth-context";
import { useCreatorCrmSupabase } from "@/components/os/use-creator-crm-supabase";
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
  const auth = useSupabaseAuth();
  const crm = useCreatorCrmSupabase();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [profileUrl, setProfileUrl] = useState("");
  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setQueryString(window.location.search || "");
    });
  }, []);

  const countryFilter = useMemo(() => {
    return new URLSearchParams(queryString).get("country")?.trim().toLowerCase() ?? "";
  }, [queryString]);

  const savedCreators = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return crm.creators.filter((creator) => {
      const creatorCountry = creator.country.trim().toLowerCase();
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
      const matchCountry =
        !countryFilter ||
        creatorCountry === countryFilter ||
        creatorCountry.includes(countryFilter) ||
        countryFilter.includes(creatorCountry);
      return matchKeyword && matchStatus && matchCountry;
    });
  }, [crm.creators, search, statusFilter, countryFilter]);

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
        ? `Parsed ${parsed.platform} profile${parsed.handle ? ` 鈥?${parsed.handle}` : ""}`
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

  const handleSaveDraftToCrm = async (draft: (typeof os.state.creatorDrafts)[number]) => {
    if (!auth.session?.user?.id) {
      return;
    }

    const saved = await crm.saveCreator({
      id: draft.id,
      creatorName: draft.creatorName,
      handle: draft.handle,
      platform: draft.platform,
      profileLink: draft.profileLink,
      country: draft.country,
      language: draft.language,
      niche: draft.niche,
      keyword: draft.keyword,
      followers: draft.followers,
      averageViews: draft.averageViews,
      email: draft.email,
      whatsapp: draft.whatsapp,
      instagram: draft.instagram,
      tiktok: draft.tiktok,
      youtube: draft.youtube,
      facebook: draft.facebook,
      status: draft.status,
      rate: draft.rate,
      targetProduct: draft.targetProduct,
      collaborationType: draft.collaborationType,
      nextStep: draft.nextStep,
      lastContact: draft.lastContact,
      followUpDate: draft.followUpDate,
      notes: draft.notes,
      source: draft.source,
    });

    if (saved) {
      os.deleteCreatorDraft(draft.id);
    }
  };
  const loginHref = `/auth?next=${encodeURIComponent(`/creator-crm${queryString}`)}`;
  const ready = auth.ready;
  const loggedIn = Boolean(auth.session?.user?.id);

  return (
    <PageShell
      title={pick(copy.creatorCrm.title)}
      description={pick(copy.creatorCrm.description)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          {loggedIn ? (
            <>
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
              <AppButton
                variant="secondary"
                iconLeft={<LogOut className="h-4 w-4" />}
                onClick={async () => {
                  await auth.signOut();
                }}
              >
                {pick({ zh: "退出登录", en: "Sign out" })}
              </AppButton>
            </>
          ) : (
            <Link href={loginHref}>
              <AppButton variant="primary">{pick({ zh: "登录", en: "Sign in" })}</AppButton>
            </Link>
          )}
        </div>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorCrm) },
        ]}
      />
      {!ready ? (
        <AppCard className="p-5">
          <EmptyState title="Loading" description="Preparing your Creator CRM session." />
        </AppCard>
      ) : !loggedIn ? (
        <AppCard className="p-5">
          <EmptyState
            title="Sign in required"
            description="Please sign in with email and password to view your Creator CRM data."
            action={
              <div className="flex flex-wrap gap-2">
                <Link href={loginHref}>
                  <AppButton variant="primary">{pick({ zh: "登录", en: "Sign in" })}</AppButton>
                </Link>
                <Link href="/auth">
                  <AppButton variant="secondary">{pick({ zh: "注册", en: "Create account" })}</AppButton>
                </Link>
              </div>
            }
          />
        </AppCard>
      ) : (
        <>
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
                      {draft.notes ? `鈥?${draft.notes}` : "鈥?No notes yet"}
                    </p>
                    <p className="text-sm text-[#374151]">
                      {draft.country ? `${draft.country} 鈥?` : ""}
                      {draft.niche || "Niche pending"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AppButton
                      variant="primary"
                      onClick={() => handleSaveDraftToCrm(draft)}
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

        {crm.loading ? (
          <div className="mt-4">
            <EmptyState title="Loading creators" description="Reading your Supabase workspace." />
          </div>
        ) : crm.error ? (
          <div className="mt-4">
            <EmptyState title="Failed to load" description={crm.error} />
          </div>
        ) : savedCreators.length === 0 ? (
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
        </>
      )}
    </PageShell>
  );
}




