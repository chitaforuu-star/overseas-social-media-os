"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Filter,
  FolderKanban,
  Megaphone,
  Package,
  Plus,
  RotateCcw,
  Sparkles,
  Users,
  ZoomOut,
  WandSparkles,
} from "lucide-react";
import { useLanguage } from "@/components/os/language-context";
import { useOS } from "@/components/os/os-context";
import { PageShell } from "@/components/os/page-shell";
import { AppButton } from "@/components/os/ui/app-button";
import { AppCard } from "@/components/os/ui/app-card";
import { MetricCard } from "@/components/os/ui/metric-card";
import { SectionHeader } from "@/components/os/ui/section-header";
import { copy } from "@/lib/translations";

type FocusTask = {
  title: string;
  description: string;
  href: string;
  tone: "default" | "pink" | "purple";
};

const modules = [
  {
    href: "/creator-finder",
    title: "Creator Finder",
    description: "Search creators by market, niche, and collaboration fit.",
    icon: Sparkles,
  },
  {
    href: "/creator-auditor",
    title: "Creator Auditor",
    description: "Audit profiles before outreach or sampling.",
    icon: WandSparkles,
  },
  {
    href: "/creator-crm",
    title: "Creator CRM",
    description: "Save, segment, and manage creators in one place.",
    icon: Users,
  },
  {
    href: "/campaigns",
    title: "Campaigns",
    description: "Track campaign setup, status, and outcomes.",
    icon: FolderKanban,
  },
  {
    href: "/content-hub",
    title: "Content Hub",
    description: "Store content ideas, competitors, calendars, and scripts.",
    icon: Plus,
  },
  {
    href: "/performance",
    title: "Performance",
    description: "Review views, clicks, orders, and ROI.",
    icon: BarChart3,
  },
] as const;

type WorldRegion = {
  code: "US" | "UK" | "Korea" | "Singapore" | "Malaysia" | "Germany";
  label: string;
  aliases: string[];
  href: string;
  top: string;
  left: string;
  accent: string;
};

const worldRegions: WorldRegion[] = [
  {
    code: "US",
    label: "US",
    aliases: ["us", "usa", "united states", "united states of america"],
    href: "/creator-crm?country=US",
    top: "47%",
    left: "22%",
    accent: "#FB7185",
  },
  {
    code: "UK",
    label: "UK",
    aliases: ["uk", "united kingdom", "great britain", "britain", "england"],
    href: "/creator-crm?country=UK",
    top: "30%",
    left: "49%",
    accent: "#8B5CF6",
  },
  {
    code: "Germany",
    label: "DE",
    aliases: ["germany", "de", "deutschland"],
    href: "/creator-crm?country=Germany",
    top: "33%",
    left: "52%",
    accent: "#22C55E",
  },
  {
    code: "Korea",
    label: "KR",
    aliases: ["korea", "south korea", "republic of korea", "kr"],
    href: "/creator-crm?country=Korea",
    top: "37%",
    left: "79%",
    accent: "#F59E0B",
  },
  {
    code: "Singapore",
    label: "SG",
    aliases: ["singapore", "sg"],
    href: "/creator-crm?country=Singapore",
    top: "61%",
    left: "74%",
    accent: "#06B6D4",
  },
  {
    code: "Malaysia",
    label: "MY",
    aliases: ["malaysia", "my"],
    href: "/creator-crm?country=Malaysia",
    top: "64%",
    left: "71%",
    accent: "#A855F7",
  },
];

const mapStatusStyles: Record<string, { label: string; color: string; tint: string }> = {
  new: { label: "New", color: "#3B82F6", tint: "rgba(59,130,246,0.18)" },
  contacted: { label: "Contacted", color: "#8B5CF6", tint: "rgba(139,92,246,0.18)" },
  replied: { label: "Replied", color: "#22C55E", tint: "rgba(34,197,94,0.18)" },
  sample_sent: { label: "Sample Sent", color: "#F59E0B", tint: "rgba(245,158,11,0.18)" },
  posted: { label: "Posted", color: "#EC4899", tint: "rgba(236,72,153,0.18)" },
};

const mapPlatformOptions = ["All", "TikTok", "Instagram", "YouTube"] as const;
const mapMarketOptions = ["All", "US", "UK", "Korea", "Germany", "Singapore", "Malaysia"] as const;
const mapStatusOptions = ["All", "New", "Contacted", "Replied", "Sample Sent", "Posted"] as const;

function normalizeCountry(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function countryMatches(country: string, aliases: string[]) {
  const value = normalizeCountry(country);
  return aliases.some((alias) => {
    const normalizedAlias = normalizeCountry(alias);
    return (
      value === normalizedAlias ||
      value.includes(normalizedAlias) ||
      normalizedAlias.includes(value)
    );
  });
}

export function HomePage() {
  const { pick } = useLanguage();
  const os = useOS();
  const [platformFilter, setPlatformFilter] = useState<(typeof mapPlatformOptions)[number]>("All");
  const [marketFilter, setMarketFilter] = useState<(typeof mapMarketOptions)[number]>("All");
  const [statusFilter, setStatusFilter] = useState<(typeof mapStatusOptions)[number]>("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedRegionCode, setSelectedRegionCode] = useState<
    (typeof worldRegions)[number]["code"] | null
  >(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredRegion, setHoveredRegion] = useState<(typeof worldRegions)[number]["code"] | null>(
    null,
  );

  const samplesSentCount = os.state.creators.filter((creator) => creator.status === "sample_sent").length;

  const creatorsInPipeline = os.state.creators.filter(
    (creator) => creator.status !== "reviewed",
  ).length;
  const awaitingReply = os.state.outreach.filter(
    (item) => !item.replyStatus.toLowerCase().includes("replied"),
  ).length;
  const postsLive = os.state.creators.filter((creator) => creator.status === "posted").length;
  const worldRegionStats = useMemo(
    () =>
      worldRegions.map((region) => {
        const creatorsInCountry = os.state.creators.filter((creator) =>
          countryMatches(creator.country ?? "", region.aliases),
        );
        const filteredCreators = creatorsInCountry.filter((creator) => {
          const platformMatch =
            platformFilter === "All" || matchText(creator.platform, platformFilter);
          const marketMatch = marketFilter === "All" || region.code === marketFilter;
          const statusMatch = matchesStatusFilter(creator.status, statusFilter);
          return platformMatch && marketMatch && statusMatch;
        });
        const visibleCount = filteredCreators.length;
        const statusTotals = filteredCreators.reduce(
          (acc, creator) => {
            const status = creator.status;
            if (status === "new") acc.new += 1;
            if (status === "contacted") acc.contacted += 1;
            if (status === "replied") acc.replied += 1;
            if (status === "sample_sent") acc.sample_sent += 1;
            if (status === "posted") acc.posted += 1;
            return acc;
          },
          { new: 0, contacted: 0, replied: 0, sample_sent: 0, posted: 0 },
        );
        const platformTotals = filteredCreators.reduce(
          (acc, creator) => {
            const platform = creator.platform.trim() || "Unknown";
            acc.set(platform, (acc.get(platform) ?? 0) + 1);
            return acc;
          },
          new Map<string, number>(),
        );
        const topPlatform =
          [...platformTotals.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
        const topStatusKey =
          Object.entries(statusTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "new";

        return {
          ...region,
          count: visibleCount,
          statusTotals,
          topPlatform,
          topStatusKey,
          filteredCreators,
        };
      }),
    [marketFilter, os.state.creators, platformFilter, statusFilter],
  );
  const selectedRegion = selectedRegionCode
    ? ((worldRegionStats.find((region) => region.code === selectedRegionCode) ??
        worldRegionStats[0] ??
        worldRegions[0]) as (typeof worldRegionStats)[number])
    : null;
  const tasks: FocusTask[] = [
    {
      title: pick(copy.dashboard.tasks.audit),
      description: "Open the auditor and review the next creator link.",
      href: "/creator-auditor",
      tone: "pink",
    },
    {
      title: pick(copy.dashboard.tasks.followUp),
      description: "Check the latest outreach replies and follow-up dates.",
      href: "/outreach",
      tone: "default",
    },
    {
      title: pick(copy.dashboard.tasks.sample),
      description: "Check sample shipping and update delivery status.",
      href: "/samples",
      tone: "purple",
    },
    {
      title: pick(copy.dashboard.tasks.publish),
      description: "Review the next scheduled post and content QA.",
      href: "/content-hub",
      tone: "default",
    },
    {
      title: pick(copy.dashboard.tasks.report),
      description: "Open the performance page and log the latest results.",
      href: "/performance",
      tone: "pink",
    },
  ];

  return (
    <PageShell
      title={pick(copy.appName)}
      description={pick(copy.pageDescription.dashboard)}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Link href="/creator-crm/new">
            <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
              {pick(copy.actions.addCreator)}
            </AppButton>
          </Link>
          <Link href="/campaigns/new">
            <AppButton variant="secondary" iconLeft={<FolderKanban className="h-4 w-4" />}>
              {pick(copy.actions.newCampaign)}
            </AppButton>
          </Link>
        </div>
      }
    >

      <section className="space-y-4">
        <AppCard className="overflow-hidden border border-white/8 bg-[#071426] p-0 shadow-[0_36px_100px_rgba(0,0,0,0.34)]">
          <div
            className="relative h-[720px] overflow-hidden bg-[radial-gradient(circle_at_50%_42%,rgba(150,223,255,0.18),transparent_30%),radial-gradient(circle_at_50%_48%,rgba(62,130,255,0.12),transparent_42%),linear-gradient(180deg,#0B1B33_0%,#071426_54%,#06101F_100%)]"
            onClick={() => {
              setFiltersOpen(false);
              setSelectedRegionCode(null);
              setHoveredRegion(null);
            }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,255,255,0.10),transparent_18%),radial-gradient(circle_at_50%_48%,rgba(135,197,255,0.14),transparent_36%),radial-gradient(circle_at_50%_52%,rgba(10,76,163,0.24),transparent_54%)] opacity-85" />
            <div className="pointer-events-none map-sheen absolute inset-0 opacity-50 mix-blend-screen bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.06),transparent_32%),linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_48%,transparent_54%),linear-gradient(300deg,transparent_0%,rgba(64,164,255,0.10)_44%,transparent_60%)]" />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setFiltersOpen((value) => !value);
                setSelectedRegionCode(null);
                setHoveredRegion(null);
              }}
              className="absolute left-6 top-6 z-40 inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#111720]/92 px-3 text-xs font-semibold text-white/82 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl transition hover:bg-white/10"
            >
              <Filter className="h-4 w-4" />
              {pick({ zh: "筛选", en: "Filter" })}
            </button>

            {filtersOpen && (
              <aside
                onClick={(event) => event.stopPropagation()}
                className="absolute left-6 top-20 z-40 w-[250px] rounded-[20px] border border-white/10 bg-[#111720]/94 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Filters
                  </p>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/55 transition hover:bg-white/10"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Platform</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {mapPlatformOptions.map((option) => {
                        const selected = platformFilter === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setPlatformFilter(option)}
                            className={[
                              "rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
                              selected
                                ? "border-white/15 bg-white text-[#0E131A]"
                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                            ].join(" ")}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Market</p>
                    <div className="mt-2 grid grid-cols-2 gap-1.5">
                      {mapMarketOptions.map((option) => {
                        const selected = marketFilter === option;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setMarketFilter(option)}
                            className={[
                              "rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
                              selected
                                ? "border-white/15 bg-white text-[#0E131A]"
                                : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10",
                            ].join(" ")}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Status</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {mapStatusOptions.map((option) => {
                        const selected = statusFilter === option;
                        const statusKey =
                          option === "All"
                            ? "new"
                            : option === "Sample Sent"
                              ? "sample_sent"
                              : option === "Posted"
                                ? "posted"
                                : normalizeText(option);
                        const tint = mapStatusStyles[statusKey]?.tint ?? "rgba(255,255,255,0.08)";
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setStatusFilter(option)}
                            className={[
                              "rounded-full border px-2.5 py-1 text-[10px] font-medium transition",
                              selected ? "text-white" : "text-white/70 hover:bg-white/10",
                            ].join(" ")}
                            style={{
                              borderColor: selected ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.10)",
                              background: selected ? tint : "rgba(255,255,255,0.05)",
                            }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPlatformFilter("All");
                      setMarketFilter("All");
                      setStatusFilter("All");
                      setZoomLevel(1);
                      setHoveredRegion(null);
                      setSelectedRegionCode(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {pick({ zh: "重置", en: "Reset" })}
                  </button>
                </div>
              </aside>
            )}

            <div className="absolute right-6 top-1/2 z-40 -translate-y-1/2">
              <div className="flex flex-col gap-2 rounded-full border border-white/10 bg-[#111720]/92 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setZoomLevel((value) => Math.min(1.3, Number((value + 0.1).toFixed(2))));
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/85 transition hover:bg-white/10"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setZoomLevel((value) => Math.max(0.85, Number((value - 0.1).toFixed(2))));
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/85 transition hover:bg-white/10"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setZoomLevel(1);
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/5 text-white/85 transition hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {selectedRegion && (
              <div
                onClick={(event) => event.stopPropagation()}
                className="absolute right-6 top-16 z-40 w-[300px] rounded-[24px] border border-white/10 bg-[#111720]/94 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">Country</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{selectedRegion.label}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRegionCode(null)}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-white/55 transition hover:bg-white/10"
                  >
                    ?
                  </button>
                </div>

                <div className="mt-4 grid gap-2">
                  {[
                    { label: "Creators", value: selectedRegion.count },
                    { label: "Contacted", value: selectedRegion.statusTotals.contacted },
                    { label: "Replied", value: selectedRegion.statusTotals.replied },
                    { label: "Samples", value: selectedRegion.statusTotals.sample_sent },
                    { label: "Posted", value: selectedRegion.statusTotals.posted },
                    { label: "Top Platform", value: selectedRegion.topPlatform },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="text-white/50">{item.label}</span>
                      <span className="font-medium text-white">{item.value}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={selectedRegion.href}
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-[#0E131A] transition hover:bg-[#F3F4F6]"
                >
                  {pick({ zh: "查看达人", en: "View Creators" })}
                </Link>
              </div>
            )}

            <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
              {Object.values(mapStatusStyles).map((config) => (
                <span
                  key={config.label}
                  className="flex items-center gap-2 rounded-full px-2 py-1 text-[11px] font-medium text-white/82"
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: config.color }} />
                  {config.label}
                </span>
              ))}
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div
                className="relative h-[min(680px,calc(100%-3rem))] w-[min(1400px,calc(100%-1rem))] map-float"
              >
                <div
                  className="absolute inset-0 origin-center transition-transform duration-300"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                <svg
                  viewBox="0 0 1400 700"
                  className="absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <defs>
                    <radialGradient id="ops-map-glow" cx="50%" cy="40%" r="65%">
                      <stop offset="0%" stopColor="#C9F5FF" stopOpacity="0.40" />
                      <stop offset="32%" stopColor="#7CD8FF" stopOpacity="0.24" />
                      <stop offset="68%" stopColor="#0E62B4" stopOpacity="0.78" />
                      <stop offset="100%" stopColor="#081223" stopOpacity="1" />
                    </radialGradient>
                    <radialGradient id="ops-ocean-sheen" cx="40%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#E6FBFF" stopOpacity="0.72" />
                      <stop offset="18%" stopColor="#89D8FF" stopOpacity="0.20" />
                      <stop offset="54%" stopColor="#2E86EA" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#0B1A33" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="ops-land" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#DDF9CB" stopOpacity="0.72" />
                      <stop offset="44%" stopColor="#ACEAA1" stopOpacity="0.70" />
                      <stop offset="100%" stopColor="#6CCB7E" stopOpacity="0.78" />
                    </linearGradient>
                    <clipPath id="ops-globe-clip">
                      <circle cx="700" cy="350" r="314" />
                    </clipPath>
                    <filter id="ops-globe-shadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceAlpha" stdDeviation="16" result="blur" />
                      <feOffset in="blur" dy="16" result="offsetBlur" />
                      <feColorMatrix
                        in="offsetBlur"
                        type="matrix"
                        values="0 0 0 0 0.02 0 0 0 0 0.06 0 0 0 0 0.12 0 0 0 0.5 0"
                        result="shadow"
                      />
                      <feMerge>
                        <feMergeNode in="shadow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <g filter="url(#ops-globe-shadow)">
                    <circle cx="700" cy="350" r="314" fill="url(#ops-map-glow)" />
                    <circle cx="700" cy="350" r="314" fill="url(#ops-ocean-sheen)" opacity="0.85" />
                    <circle cx="700" cy="350" r="314" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                  </g>
                  <g clipPath="url(#ops-globe-clip)">
                    <g opacity="0.24" stroke="rgba(255,255,255,0.22)" strokeWidth="1">
                      <path d="M356 174C476 114 626 92 764 104" />
                      <path d="M306 262C424 212 622 198 814 218" />
                      <path d="M270 358C412 322 600 312 832 332" />
                      <path d="M302 452C442 420 620 418 842 446" />
                      <path d="M364 546C496 522 644 520 786 540" />
                      <path d="M396 112V588" />
                      <path d="M520 92V604" />
                      <path d="M676 78V616" />
                      <path d="M832 92V604" />
                      <path d="M944 114V588" />
                    </g>
                    <g fill="url(#ops-land)" stroke="rgba(255,255,255,0.20)" strokeWidth="1.1">
                      <path d="M118 214L172 176L254 184L326 216L318 276L258 302L178 295L130 262L118 214Z" />
                      <path d="M205 332L271 346L307 394L295 466L244 540L210 505L198 444L200 385L205 332Z" />
                      <path d="M496 150L565 136L643 152L672 197L647 235L589 228L534 200L496 150Z" />
                      <path d="M541 250L620 255L678 294L692 353L659 416L601 431L555 390L537 324L541 250Z" />
                      <path d="M760 164L868 144L990 167L1080 214L1068 275L1007 303L915 292L828 261L760 164Z" />
                      <path d="M818 316L947 320L1090 356L1158 420L1118 488L1005 502L885 465L815 403L818 316Z" />
                      <path d="M1165 432L1240 438L1278 476L1268 523L1210 530L1172 495L1165 432Z" />
                    </g>
                    <g opacity="0.18" fill="none" stroke="rgba(160,220,255,0.28)" strokeWidth="1.1">
                      <path d="M230 256C334 220 454 212 578 224" />
                      <path d="M274 365C388 338 521 334 682 350" />
                      <path d="M620 214C742 188 886 188 1048 210" />
                      <path d="M603 364C734 344 888 346 1058 372" />
                    </g>
                  </g>
                </svg>

                {worldRegionStats.map((region) => {
                  const active = region.count > 0;
                  const statusKey = active ? region.topStatusKey : "new";
                  const statusColor = active ? mapStatusStyles[statusKey]?.color : "#64748B";
                  const statusTint = active ? mapStatusStyles[statusKey]?.tint : "rgba(100,116,139,0.18)";
                  const selected = hoveredRegion === region.code || selectedRegionCode === region.code;
                  const tooltipOnRight = Number.parseFloat(region.left) < 68;

                  return (
                    <div key={region.code}>
                      <button
                        type="button"
                        onMouseEnter={() => setHoveredRegion(region.code)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onFocus={() => setHoveredRegion(region.code)}
                        onBlur={() => setHoveredRegion(null)}
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedRegionCode(region.code);
                        }}
                        className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 outline-none"
                        style={{ top: region.top, left: region.left }}
                      >
                        <span
                          className={[
                            "flex items-center gap-2 rounded-full border px-2 py-1 transition duration-200",
                            selected ? "-translate-y-0.5 scale-[1.04]" : "",
                          ].join(" ")}
                          style={{
                            borderColor: selected ? "rgba(255,255,255,0.24)" : "rgba(255,255,255,0.10)",
                            background: "rgba(12,16,22,0.88)",
                            boxShadow: selected
                              ? `0 0 0 1px rgba(255,255,255,0.05), 0 0 22px ${statusColor}40`
                              : "0 0 0 1px rgba(255,255,255,0.04)",
                          }}
                        >
                          <span
                            className="h-3.5 w-3.5 rounded-full"
                            style={{
                              background: statusColor,
                              boxShadow: active
                                ? `0 0 0 6px ${statusTint}, 0 0 24px ${statusColor}55`
                                : `0 0 0 5px ${statusTint}`,
                              opacity: active ? 1 : 0.28,
                            }}
                          />
                          <span
                            className="min-w-8 rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[11px] font-semibold text-white/90"
                            style={{ opacity: active ? 1 : 0.4 }}
                          >
                            {region.count}
                          </span>
                        </span>
                      </button>

                      {hoveredRegion === region.code && (
                        <div
                          className="pointer-events-none absolute z-30 w-[180px] rounded-[18px] border border-white/12 bg-white/10 p-3 text-white shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
                          style={{
                            top: `calc(${region.top} - 58px)`,
                            left: tooltipOnRight ? `calc(${region.left} + 14px)` : `calc(${region.left} - 198px)`,
                          }}
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/38">
                            Country
                          </p>
                          <p className="mt-1 text-sm font-semibold text-white">{region.label}</p>
                          <p className="mt-2 text-xs text-white/55">Creators {region.count}</p>
                          <p className="mt-1 text-[11px] text-white/50">
                            {region.statusTotals.contacted} Contacted · {region.statusTotals.replied} Replied · {region.statusTotals.sample_sent} Samples
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </section>

      <style jsx global>{`
        @keyframes mapFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes mapSheen {
          0%,
          100% {
            transform: translateX(-2%) translateY(0);
          }
          50% {
            transform: translateX(2%) translateY(-1%);
          }
        }

        .map-float {
          animation: mapFloat 18s ease-in-out infinite;
          will-change: transform;
        }

        .map-sheen {
          animation: mapSheen 24s ease-in-out infinite;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .map-float,
          .map-sheen {
            animation: none;
          }
        }
      `}</style>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          label={pick(copy.dashboard.metrics.creators)}
          value={creatorsInPipeline}
          hint={pick(copy.nav.creatorCrm)}
          tag={pick(copy.nav.creatorFinder)}
          icon={<Users className="h-4 w-4 text-[#6B7280]" />}
          tone="pink"
        />
        <MetricCard
          label={pick(copy.dashboard.metrics.awaitingReply)}
          value={awaitingReply}
          hint={pick(copy.nav.outreach)}
          tag={pick(copy.nav.outreach)}
          icon={<Megaphone className="h-4 w-4 text-[#6B7280]" />}
        />
        <MetricCard
          label={pick(copy.dashboard.metrics.sampleSent)}
          value={samplesSentCount}
          hint={pick(copy.nav.samples)}
          tag={pick(copy.nav.samples)}
          icon={<Package className="h-4 w-4 text-[#6B7280]" />}
          tone="purple"
        />
        <MetricCard
          label={pick(copy.dashboard.metrics.postsLive)}
          value={postsLive}
          hint={pick(copy.nav.performance)}
          tag={pick(copy.nav.performance)}
          icon={<BarChart3 className="h-4 w-4 text-[#6B7280]" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AppCard className="p-5" tone="pink">
          <SectionHeader
            title={pick(copy.dashboard.sections.todayFocus)}
            description={pick(copy.appIntro)}
            action={
              <Link href="/creator-crm/new">
                <AppButton variant="primary" iconLeft={<Plus className="h-4 w-4" />}>
                  {pick(copy.actions.addTask)}
                </AppButton>
              </Link>
            }
          />
          <div className="mt-4 space-y-2">
            {tasks.map((task) => (
              <Link
                key={task.title}
                href={task.href}
                className="flex items-start justify-between gap-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 transition hover:-translate-y-0.5 hover:border-[#F9D5E5]"
              >
                <div className="min-w-0 space-y-1">
                  <p className="os-card-title">{task.title}</p>
                  <p className="os-helper-text">{task.description}</p>
                </div>
                <span className="mt-0.5 rounded-full border border-[#E5E7EB] bg-[#FAFAFA] px-3 py-1 text-xs font-medium text-[#4B5563]">
                  {pick(copy.actions.viewDetails)}
                </span>
              </Link>
            ))}
          </div>
        </AppCard>

        <AppCard className="p-5">
          <SectionHeader
            title={pick(copy.dashboard.sections.workModules)}
            description={pick(copy.pageDescription.dashboard)}
          />
          <div className="mt-4 grid gap-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:border-[#F9D5E5] hover:bg-[#FFF9FB]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1F6] text-[#BE185D]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="os-card-title">{module.title}</p>
                        <p className="os-helper-text mt-1">{module.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 text-[#9CA3AF] transition group-hover:translate-x-0.5 group-hover:text-[#E1306C]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </AppCard>
      </section>

      <AppCard className="p-5">
        <SectionHeader
          title={pick(copy.aboutTitle)}
          description={pick(copy.appIntro)}
        />
        <p className="os-body-text mt-3 max-w-4xl text-[#374151]">
          This prototype is built for overseas social media, influencer marketing, and creator
          operations teams. It focuses on a practical workflow: discover creators, audit fit,
          save to CRM, manage outreach, track content, and review performance.
        </p>
      </AppCard>

    </PageShell>
  );
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function matchText(value: string, filter: string) {
  if (filter === "All") return true;
  return normalizeText(value).includes(normalizeText(filter));
}

function matchesStatusFilter(status: string, filter: string) {
  if (filter === "All") return true;
  const normalized = status.trim().toLowerCase();
  switch (filter) {
    case "New":
      return normalized === "new";
    case "Contacted":
      return normalized === "contacted";
    case "Replied":
      return normalized === "replied";
    case "Sample Sent":
      return normalized === "sample_sent";
    case "Posted":
      return normalized === "posted";
    default:
      return true;
  }
}
