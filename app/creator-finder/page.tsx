"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ListFilter, Plus, Save, Search, Sparkles } from "lucide-react";
import { useOS } from "@/components/os/os-context";
import { useLanguage } from "@/components/os/language-context";
import { PageShell } from "@/components/os/page-shell";
import { Breadcrumb } from "@/components/os/ui/breadcrumb";
import { EmptyState } from "@/components/os/ui/empty-state";
import { AppBadge } from "@/components/os/ui/app-badge";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { AppInput } from "@/components/os/ui/app-input";
import { AppSelect } from "@/components/os/ui/app-select";
import { SectionHeader } from "@/components/os/ui/section-header";
import type { CreatorRecord } from "@/lib/os-types";
import { copy } from "@/lib/translations";
import type { CreatorSearchResult } from "@/lib/creator-search";
import {
  dataSourceOptions,
  followerRangeOptions,
  marketOptions,
  nicheOptions,
  platformOptions,
} from "@/lib/creator-options";

type BriefState = {
  platform: string;
  market: string;
  niche: string;
  keywords: string;
  followerRange: string;
  followerRangeMin: string;
  followerRangeMax: string;
  engagementRate: string;
  brandNotes: string;
  dataSource: string;
};

const initialBrief: BriefState = {
  platform: "",
  market: "",
  niche: "",
  keywords: "",
  followerRange: "",
  followerRangeMin: "",
  followerRangeMax: "",
  engagementRate: "",
  brandNotes: "",
  dataSource: "auto",
};

function followerRangeToBounds(value: string) {
  if (!value) return { min: "", max: "" };
  if (value === "1M+") return { min: "1000000", max: "" };
  const [minLabel, maxLabel] = value.split("-");
  const normalize = (item: string) =>
    item.replace(/,/g, "").replace(/K/i, "000").replace(/M/i, "000000").replace(/\s+/g, "");
  return {
    min: normalize(minLabel),
    max: normalize(maxLabel),
  };
}

function matchesCreator(existing: { profileLink: string; handle?: string }, candidate: CreatorSearchResult) {
  const profile = existing.profileLink.trim().toLowerCase();
  const handle = existing.handle?.trim().toLowerCase() ?? "";
  return (
    profile === candidate.profileUrl.toLowerCase() ||
    candidate.profileUrl.toLowerCase().includes(profile) ||
    (handle && candidate.handle.toLowerCase().includes(handle))
  );
}

export default function CreatorFinderPage() {
  const { pick } = useLanguage();
  const os = useOS();

  const [brief, setBrief] = useState<BriefState>(initialBrief);
  const [results, setResults] = useState<CreatorSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const selectedRange = useMemo(() => {
    if (brief.followerRangeMin || brief.followerRangeMax) {
      return `${brief.followerRangeMin || "min"}-${brief.followerRangeMax || "max"}`;
    }
    return brief.followerRange || "—";
  }, [brief.followerRange, brief.followerRangeMax, brief.followerRangeMin]);

  const criteriaPreview = useMemo(
    () =>
      [brief.platform, brief.market, brief.niche, brief.keywords, selectedRange]
        .filter(Boolean)
        .join(" | "),
    [brief.keywords, brief.market, brief.niche, brief.platform, selectedRange],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const runSearch = async () => {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const followerBounds = followerRangeToBounds(brief.followerRange);
      const response = await fetch("/api/creators/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform: brief.platform,
          market: brief.market,
          niche: brief.niche,
          keywords: brief.keywords,
          followerRangeMin: brief.followerRangeMin || followerBounds.min || null,
          followerRangeMax: brief.followerRangeMax || followerBounds.max || null,
          engagementRate: brief.engagementRate,
          brandNotes: brief.brandNotes,
          sourceMode: brief.dataSource,
          databaseCreators: os.state.creators,
        }),
      });

      const payload = (await response.json()) as {
        ok: boolean;
        message?: string;
        dataNotice?: string;
        creators?: CreatorSearchResult[];
      };

      if (!response.ok) {
        setError(payload.message || "Search failed.");
        setResults([]);
        return;
      }

      setResults(payload.creators ?? []);
      setNotice(payload.dataNotice || payload.message || "");
    } catch (searchError) {
      setError(
        searchError instanceof Error ? searchError.message : "Search failed. Please try again.",
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = (result: CreatorSearchResult) => {
    const parsedHandle = result.handle && result.handle !== "—" ? result.handle : "";
    const existing = os.state.creators.find((creator) => matchesCreator(creator, result));
    const payload: Partial<CreatorRecord> = {
      creatorName: result.creatorName === "—" ? "" : result.creatorName,
      handle: parsedHandle,
      platform: result.platform === "—" ? "" : result.platform,
      profileLink: result.profileUrl === "—" ? "" : result.profileUrl,
      country: result.country === "—" ? "" : result.country,
      language: result.language === "—" ? "" : result.language,
      niche: result.niche === "—" ? "" : result.niche,
      keyword: brief.keywords,
      followers: result.followers === "—" ? "" : result.followers,
      averageViews: result.avgViews === "—" ? "" : result.avgViews,
      email: result.email === "—" ? "" : result.email,
      whatsapp: "",
      instagram: result.platform === "Instagram" ? result.profileUrl : "",
      tiktok: result.platform === "TikTok" ? result.profileUrl : "",
      youtube: result.platform === "YouTube" ? result.profileUrl : "",
      facebook: result.platform === "Facebook" ? result.profileUrl : "",
      status: "to_audit",
      rate: "",
      targetProduct: "",
      collaborationType: "",
      nextStep: "Run audit and decide outreach",
      lastContact: "",
      followUpDate: "",
      notes: [
        `Source: ${result.source}`,
        `Match score: ${result.matchScore}`,
        brief.brandNotes ? `Brand notes: ${brief.brandNotes}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
      source: result.source,
    };

    if (existing) {
      os.updateCreator(existing.id, payload);
    } else {
      os.addCreator(payload);
    }
    showToast("Saved to Creator Database.");
  };

  const hasResults = results.length > 0;

  return (
    <PageShell
      title={pick(copy.creatorFinder.title)}
      description={pick(copy.creatorFinder.description)}
      headerAction={
        <Link href="/creator-crm/new">
          <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
            {pick(copy.actions.addCreatorManually)}
          </AppButton>
        </Link>
      }
    >
      <Breadcrumb
        items={[
          { label: pick(copy.nav.dashboard), href: "/" },
          { label: pick(copy.nav.creatorFinder) },
        ]}
      />

      {toast ? (
        <div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111827] shadow-lg">
          {toast}
        </div>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.creatorFinder.searchBriefTitle)}
            description={pick(copy.creatorFinder.description)}
            action={
              <AppButton
                variant="primary"
                iconLeft={<Search className="h-4 w-4" />}
                onClick={runSearch}
                disabled={loading}
              >
                {loading ? "Searching creators..." : pick(copy.actions.searchCreators)}
              </AppButton>
            }
          />

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.platform)}</span>
              <AppSelect
                value={brief.platform}
                onChange={(event) => setBrief((prev) => ({ ...prev, platform: event.target.value }))}
              >
                <option value="">{pick(copy.common.all)}</option>
                {platformOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {pick(item.label)}
                  </option>
                ))}
              </AppSelect>
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.targetMarket)}</span>
              <AppSelect
                value={brief.market}
                onChange={(event) => setBrief((prev) => ({ ...prev, market: event.target.value }))}
              >
                <option value="">{pick(copy.common.all)}</option>
                {marketOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {pick(item.label)}
                  </option>
                ))}
              </AppSelect>
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.niche)}</span>
              <AppSelect
                value={brief.niche}
                onChange={(event) => setBrief((prev) => ({ ...prev, niche: event.target.value }))}
              >
                <option value="">{pick(copy.common.all)}</option>
                {nicheOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {pick(item.label)}
                  </option>
                ))}
              </AppSelect>
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.keywords)}</span>
              <AppInput
                value={brief.keywords}
                onChange={(event) => setBrief((prev) => ({ ...prev, keywords: event.target.value }))}
                placeholder="quiet luxury, apartment setup"
              />
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.followerRange)}</span>
              <AppSelect
                value={brief.followerRange}
                onChange={(event) => {
                  const next = event.target.value;
                  const range = followerRangeToBounds(next);
                  setBrief((prev) => ({
                    ...prev,
                    followerRange: next,
                    followerRangeMin: range.min,
                    followerRangeMax: range.max,
                  }));
                }}
              >
                <option value="">{pick(copy.common.all)}</option>
                {followerRangeOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {pick(item.label)}
                  </option>
                ))}
              </AppSelect>
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.engagementRequirement)}</span>
              <AppInput
                value={brief.engagementRate}
                onChange={(event) =>
                  setBrief((prev) => ({
                    ...prev,
                    engagementRate: event.target.value,
                  }))
                }
                placeholder="2%"
              />
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.brandFitNotes)}</span>
              <textarea
                value={brief.brandNotes}
                onChange={(event) => setBrief((prev) => ({ ...prev, brandNotes: event.target.value }))}
                className="os-textarea"
                placeholder="Premium visual style, clear product placement, low-risk brand image"
              />
            </label>

            <label className="space-y-1">
              <span className="os-helper-text">{pick(copy.creatorFinder.fields.dataSource)}</span>
              <AppSelect
                value={brief.dataSource}
                onChange={(event) => setBrief((prev) => ({ ...prev, dataSource: event.target.value }))}
              >
                {dataSourceOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {pick(item.label)}
                  </option>
                ))}
              </AppSelect>
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="os-helper-text">Follower min</span>
              <AppInput
                value={brief.followerRangeMin}
                onChange={(event) =>
                  setBrief((prev) => ({ ...prev, followerRangeMin: event.target.value }))
                }
                placeholder="1000"
              />
            </label>
            <label className="space-y-1">
              <span className="os-helper-text">Follower max</span>
              <AppInput
                value={brief.followerRangeMax}
                onChange={(event) =>
                  setBrief((prev) => ({ ...prev, followerRangeMax: event.target.value }))
                }
                placeholder="100000"
              />
            </label>
          </div>
        </AppCard>

        <div className="space-y-4">
          <AppCard className="p-5" tone="purple">
            <SectionHeader
              title={pick(copy.creatorFinder.searchCriteriaTitle)}
              description={criteriaPreview || pick(copy.common.noDataDescription)}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {brief.platform ? <span className="os-mini-tag">{brief.platform}</span> : null}
              {brief.market ? <span className="os-mini-tag">{brief.market}</span> : null}
              {brief.niche ? <span className="os-mini-tag">{brief.niche}</span> : null}
              {brief.followerRange ? <span className="os-mini-tag">{brief.followerRange}</span> : null}
              {brief.dataSource ? <span className="os-mini-tag">{brief.dataSource}</span> : null}
            </div>
          </AppCard>

          <AppCard className="p-5">
            <SectionHeader
              title={pick(copy.creatorFinder.candidateResultsTitle)}
              description={
                notice ||
                (error
                  ? error
                  : "No real external source connected yet. Showing demo or imported creators.")
              }
              action={
                <div className="flex flex-wrap gap-2">
                  <AppButton
                    variant={viewMode === "cards" ? "primary" : "secondary"}
                    iconLeft={<Sparkles className="h-4 w-4" />}
                    onClick={() => setViewMode("cards")}
                  >
                    Cards
                  </AppButton>
                  <AppButton
                    variant={viewMode === "table" ? "primary" : "secondary"}
                    iconLeft={<ListFilter className="h-4 w-4" />}
                    onClick={() => setViewMode("table")}
                  >
                    Table
                  </AppButton>
                </div>
              }
            />

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {!hasResults ? (
              <div className="mt-4">
                <EmptyState
                  title={pick(copy.creatorFinder.emptyTitle)}
                  description={pick(copy.creatorFinder.emptyDescription)}
                />
              </div>
            ) : viewMode === "cards" ? (
              <div className="mt-4 grid gap-3">
                {results.map((result) => (
                  <div
                    key={`${result.source}-${result.profileUrl}-${result.handle}`}
                    className="rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="os-card-title">
                            {result.creatorName}
                            {result.handle && result.handle !== "—" ? ` | ${result.handle}` : ""}
                          </span>
                          <AppBadge status="new" />
                          <span className="os-mini-tag">{result.source}</span>
                        </div>
                        <p className="os-helper-text">
                          {result.platform} | {result.country} | {result.niche}
                        </p>
                        <p className="text-sm text-[#374151]">{result.bio}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-[#6B7280]">
                          <span>Followers: {result.followers}</span>
                          <span>Avg Views: {result.avgViews}</span>
                          <span>Engagement: {result.engagementRate}</span>
                          <span>Score: {result.matchScore}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <AppButton
                          variant="primary"
                          iconLeft={<Save className="h-4 w-4" />}
                          onClick={() => saveResult(result)}
                        >
                          {pick(copy.actions.saveToCrm)}
                        </AppButton>
                        <Link href="/creator-auditor">
                          <AppButton variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
                            {pick(copy.actions.runAuditor)}
                          </AppButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E5E7EB] bg-white">
                <table className="os-table min-w-[1200px]">
                  <thead>
                    <tr>
                      <th>Creator</th>
                      <th>Platform</th>
                      <th>Country</th>
                      <th>Niche</th>
                      <th>Followers</th>
                      <th>Avg Views</th>
                      <th>Engagement</th>
                      <th>Source</th>
                      <th>Match Score</th>
                      <th>Last Checked</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={`${result.source}-${result.profileUrl}-${result.handle}`}>
                        <td>
                          <div>
                            <p className="font-semibold text-[#111827]">{result.creatorName}</p>
                            <p className="os-helper-text">{result.handle === "—" ? "" : result.handle}</p>
                          </div>
                        </td>
                        <td>{result.platform}</td>
                        <td>{result.country}</td>
                        <td>{result.niche}</td>
                        <td>{result.followers}</td>
                        <td>{result.avgViews}</td>
                        <td>{result.engagementRate}</td>
                        <td>{result.source}</td>
                        <td>{result.matchScore}</td>
                        <td>{result.lastCheckedAt}</td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            <AppButton
                              variant="text"
                              iconLeft={<Check className="h-4 w-4" />}
                              onClick={() => saveResult(result)}
                            >
                              {pick(copy.actions.saveToCrm)}
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
        </div>
      </section>
    </PageShell>
  );
}
