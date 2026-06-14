"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BarChart3,
  FolderKanban,
  Megaphone,
  Package,
  Plus,
  Sparkles,
  Users,
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
    top: "44%",
    left: "25%",
    accent: "#FB7185",
  },
  {
    code: "UK",
    label: "UK",
    aliases: ["uk", "united kingdom", "great britain", "britain", "england"],
    href: "/creator-crm?country=UK",
    top: "28%",
    left: "43%",
    accent: "#8B5CF6",
  },
  {
    code: "Germany",
    label: "DE",
    aliases: ["germany", "de", "deutschland"],
    href: "/creator-crm?country=Germany",
    top: "32%",
    left: "47%",
    accent: "#22C55E",
  },
  {
    code: "Korea",
    label: "KR",
    aliases: ["korea", "south korea", "republic of korea", "kr"],
    href: "/creator-crm?country=Korea",
    top: "39%",
    left: "72%",
    accent: "#F59E0B",
  },
  {
    code: "Singapore",
    label: "SG",
    aliases: ["singapore", "sg"],
    href: "/creator-crm?country=Singapore",
    top: "61%",
    left: "69%",
    accent: "#06B6D4",
  },
  {
    code: "Malaysia",
    label: "MY",
    aliases: ["malaysia", "my"],
    href: "/creator-crm?country=Malaysia",
    top: "65%",
    left: "66%",
    accent: "#A855F7",
  },
];

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
  const countryDistribution = useMemo(() => {
    const counts = new Map<string, number>();
    os.state.creators.forEach((creator) => {
      const key = creator.country?.trim() || "Unknown";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return [...counts.entries()]
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }, [os.state.creators]);

  const totalCreators = os.state.creators.length;
  const samplesSentCount = os.state.creators.filter((creator) => creator.status === "sample_sent").length;
  const globalReach = countryDistribution.length;

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
        const count = os.state.creators.filter((creator) =>
          countryMatches(creator.country ?? "", region.aliases),
        ).length;

        return {
          ...region,
          count,
        };
      }),
    [os.state.creators],
  );
  const maxRegionCount = Math.max(1, ...worldRegionStats.map((region) => region.count));

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
        <AppCard className="overflow-hidden border-[#D7E7F7] bg-[#F8FBFF] p-0 shadow-[0_28px_70px_rgba(15,23,42,0.06)]">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6B7280]">
                  Global Creator Network
                </p>
                <p className="mt-2 text-sm text-[#6B7280]">
                  Creator Coverage Across Markets
                </p>
                <p className="mt-2 text-sm text-[#6B7280]">
                  Track creator distribution, samples and market reach.
                </p>
              </div>
            </div>

            <div className="relative mt-5 min-h-[420px] overflow-hidden rounded-[40px] border border-[#D7E7F7] bg-[linear-gradient(180deg,#F6FBFF_0%,#EAF6FF_38%,#D7EBF9_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:min-h-[500px]">
              <svg
                viewBox="0 0 1200 760"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="map-atmosphere" cx="50%" cy="42%" r="66%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="55%" stopColor="#D9EEF9" stopOpacity="0.42" />
                    <stop offset="100%" stopColor="#C5E2F5" stopOpacity="0.08" />
                  </radialGradient>
                  <radialGradient id="map-ocean" cx="44%" cy="36%" r="68%">
                    <stop offset="0%" stopColor="#87D4FF" />
                    <stop offset="55%" stopColor="#4EB3F1" />
                    <stop offset="100%" stopColor="#2F8CD8" />
                  </radialGradient>
                  <radialGradient id="map-land" cx="46%" cy="38%" r="72%">
                    <stop offset="0%" stopColor="#DDF7BD" />
                    <stop offset="56%" stopColor="#BCEB93" />
                    <stop offset="100%" stopColor="#7BCC66" />
                  </radialGradient>
                  <filter id="map-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="24" stdDeviation="24" floodColor="#0F172A" floodOpacity="0.12" />
                  </filter>
                  <clipPath id="map-clip">
                    <circle cx="520" cy="350" r="275" />
                  </clipPath>
                </defs>
                <rect width="1200" height="760" fill="#EAF6FF" />
                <circle cx="520" cy="350" r="320" fill="url(#map-atmosphere)" />
                <g filter="url(#map-shadow)">
                  <circle cx="520" cy="350" r="275" fill="url(#map-ocean)" />
                </g>
                <g clipPath="url(#map-clip)">
                  <path d="M185 250L240 222L306 233L356 266L348 310L306 336L248 330L201 294L185 250Z" fill="url(#map-land)" />
                  <path d="M240 365L285 380L308 420L301 478L271 533L237 512L226 457L231 404L240 365Z" fill="url(#map-land)" />
                  <path d="M414 206L488 189L565 206L612 246L606 290L565 312L517 303L474 273L414 206Z" fill="url(#map-land)" />
                  <path d="M475 287L542 294L586 334L593 389L561 446L510 452L471 419L457 358L475 287Z" fill="#F4F2DD" />
                  <path d="M602 206L684 193L750 216L788 258L785 302L747 327L700 322L656 300L602 206Z" fill="url(#map-land)" />
                  <path d="M682 310L726 314L760 341L764 380L738 398L701 391L671 360L682 310Z" fill="#F5F0C8" />
                  <path d="M738 423L794 431L833 457L826 494L790 505L748 483L734 449L738 423Z" fill="url(#map-land)" />
                  <path d="M318 165L390 152L438 160" stroke="rgba(255,255,255,0.42)" strokeLinecap="round" strokeWidth="4" />
                  <path d="M266 215C341 192 426 179 522 181" stroke="rgba(255,255,255,0.28)" strokeLinecap="round" strokeWidth="2" fill="none" />
                  <path d="M228 321C349 292 515 287 693 307" stroke="rgba(255,255,255,0.28)" strokeLinecap="round" strokeWidth="2" fill="none" />
                  <path d="M247 409C368 384 526 384 712 412" stroke="rgba(255,255,255,0.24)" strokeLinecap="round" strokeWidth="2" fill="none" />
                  <path d="M294 495C396 473 543 471 720 493" stroke="rgba(255,255,255,0.24)" strokeLinecap="round" strokeWidth="2" fill="none" />
                </g>
                <circle cx="520" cy="350" r="275" fill="none" stroke="rgba(255,255,255,0.78)" strokeWidth="2" />
                <circle cx="520" cy="350" r="275" fill="none" stroke="rgba(15,118,190,0.14)" strokeWidth="6" />
                <g opacity="0.3" fill="none" stroke="rgba(255,255,255,0.56)">
                  <ellipse cx="520" cy="350" rx="264" ry="84" />
                  <ellipse cx="520" cy="350" rx="264" ry="146" />
                  <ellipse cx="520" cy="350" rx="264" ry="206" />
                  <path d="M256 350H784" />
                  <path d="M284 286H754" />
                  <path d="M284 414H754" />
                  <path d="M346 205C388 280 388 420 346 495" />
                  <path d="M694 205C652 280 652 420 694 495" />
                </g>
              </svg>

              {worldRegionStats.map((region) => {
                const active = region.count > 0;
                const size = active ? 42 + Math.round((region.count / maxRegionCount) * 10) : 36;
                return (
                  <Link
                    key={region.code}
                    href={region.href}
                    title={`${region.code} · ${region.count} creators`}
                    className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ top: region.top, left: region.left }}
                  >
                    <span
                      className={[
                        "flex items-center justify-center rounded-full border text-sm font-semibold transition duration-200",
                        active
                          ? "border-white/80 text-white shadow-[0_0_0_10px_rgba(255,255,255,0.22),0_0_20px_rgba(59,130,246,0.18)] group-hover:-translate-y-1"
                          : "border-white/80 bg-white/65 text-[#64748B] group-hover:-translate-y-1",
                      ].join(" ")}
                      style={{
                        width: `${size}px`,
                        height: `${size}px`,
                        background: active ? region.accent : "rgba(255,255,255,0.72)",
                      }}
                    >
                      {region.count}
                    </span>
                    <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#D7E7F7] bg-[#0F172A] px-3 py-2 text-xs font-medium text-white opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.28)] transition group-hover:opacity-100">
                      <span className="block text-[10px] uppercase tracking-[0.18em] text-white/45">{region.code}</span>
                      <span className="block">{region.label}</span>
                      <span className="block text-white/70">{region.count} creators</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-3 rounded-[24px] border border-[#D7E7F7] bg-white/90 p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-md lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
                  Countries
                </span>
                {["US", "Korea", "UK", "Germany", "Singapore", "Malaysia"].map((country) => (
                  <span
                    key={country}
                    className="rounded-full border border-[#D7E7F7] bg-[#F8FBFF] px-3 py-1 text-xs font-medium text-[#334155]"
                  >
                    {country}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: "Creators", value: totalCreators },
                  { label: "Samples", value: samplesSentCount },
                  { label: "Markets", value: globalReach },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#6B7280]">{item.label}</span>
                    <span className="text-sm font-semibold text-[#111827]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppCard>
      </section>

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
