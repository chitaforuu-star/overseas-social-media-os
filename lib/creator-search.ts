import seedCreators from "@/data/creators.seed.json";
import { detectSocialPlatform, extractSocialHandle, handleToCreatorName } from "@/lib/social-profile";

export type CreatorSearchBrief = {
  platform: string;
  market: string;
  niche: string;
  keywords: string;
  followerRangeMin?: number | null;
  followerRangeMax?: number | null;
  engagementRate?: string;
  brandNotes: string;
  sourceMode?: string;
};

export type CreatorSearchResult = {
  creatorName: string;
  handle: string;
  platform: string;
  profileUrl: string;
  country: string;
  language: string;
  niche: string;
  followers: string;
  avgViews: string;
  engagementRate: string;
  email: string;
  bio: string;
  matchScore: number;
  source: "apify" | "youtube" | "fastmoss" | "localSeedData" | "importedCsv";
  lastCheckedAt: string;
};

export type SearchDatasetRow = Partial<CreatorSearchResult> & {
  source?: string;
  followersCount?: number;
  avgViewsCount?: number;
};

export const seedCreatorRows = seedCreators as SearchDatasetRow[];

export function toNumberFromFollowerText(value?: string) {
  if (!value) return 0;
  const normalized = value.replace(/,/g, "").trim().toUpperCase();
  const match = normalized.match(/([\d.]+)\s*(K|M)?/);
  if (!match) return Number(normalized) || 0;
  const amount = Number(match[1]);
  const suffix = match[2];
  if (suffix === "M") return amount * 1_000_000;
  if (suffix === "K") return amount * 1_000;
  return amount;
}

export function toFollowerLabel(value: number | string | undefined) {
  if (value === undefined || value === null || value === "") return "—";
  if (typeof value === "string") return value;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  return `${Math.round(value)}`;
}

export function parseRangeLabel(value?: string) {
  if (!value) return { min: null as number | null, max: null as number | null };
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");
  if (normalized === "1M+") return { min: 1_000_000, max: null };
  const [minLabel, maxLabel] = normalized.split("-");
  if (!minLabel || !maxLabel) return { min: null, max: null };
  return {
    min: toNumberFromFollowerText(minLabel),
    max: toNumberFromFollowerText(maxLabel),
  };
}

export function parseEngagementRate(value?: string) {
  if (!value) return null;
  const match = value.trim().match(/([\d.]+)/);
  if (!match) return null;
  return Number(match[1]);
}

function fallbackCreatorName(handle: string) {
  const cleanHandle = handle.replace(/^@/, "").trim();
  if (!cleanHandle) return "—";
  return handleToCreatorName(cleanHandle);
}

export function normalizeCreatorLike(
  row: SearchDatasetRow,
  source: CreatorSearchResult["source"],
  fallbackCheckedAt = new Date().toISOString(),
): CreatorSearchResult {
  const profileUrl = row.profileUrl ?? "";
  const detectedPlatform = row.platform || detectSocialPlatform(profileUrl);
  const rawHandle =
    row.handle ||
    extractSocialHandle(profileUrl, detectedPlatform as ReturnType<typeof detectSocialPlatform>) ||
    "";
  const normalizedHandle = rawHandle ? (rawHandle.startsWith("@") ? rawHandle : `@${rawHandle}`) : "—";

  return {
    creatorName: row.creatorName ?? fallbackCreatorName(normalizedHandle),
    handle: normalizedHandle,
    platform: detectedPlatform || row.platform || "—",
    profileUrl: profileUrl || "—",
    country: row.country ?? "—",
    language: row.language ?? "—",
    niche: row.niche ?? "—",
    followers: row.followers ?? toFollowerLabel(row.followersCount ?? 0),
    avgViews: row.avgViews ?? toFollowerLabel(row.avgViewsCount ?? 0),
    engagementRate: row.engagementRate ?? "—",
    email: row.email ?? "—",
    bio: row.bio ?? "—",
    matchScore: row.matchScore ?? 0,
    source,
    lastCheckedAt: row.lastCheckedAt ?? fallbackCheckedAt,
  };
}

function matchText(haystack: string, needles: string[]) {
  const source = haystack.toLowerCase();
  return needles.filter((needle) => source.includes(needle.toLowerCase())).length;
}

function parseFollowerRangeFromBrief(brief: CreatorSearchBrief) {
  if (brief.followerRangeMin || brief.followerRangeMax) {
    return {
      min: brief.followerRangeMin ?? 0,
      max: brief.followerRangeMax ?? Number.POSITIVE_INFINITY,
    };
  }
  return { min: 0, max: Number.POSITIVE_INFINITY };
}

export function searchCreatorsInRows(rows: SearchDatasetRow[], brief: CreatorSearchBrief) {
  const targetMarket = brief.market.trim().toLowerCase();
  const targetNiche = brief.niche.trim().toLowerCase();
  const keywords = brief.keywords
    .split(",")
    .flatMap((item) => item.split(" "))
    .map((item) => item.trim())
    .filter(Boolean);
  const brandNotes = brief.brandNotes.trim();
  const platformFilter = brief.platform.trim().toLowerCase();
  const { min, max } = parseFollowerRangeFromBrief(brief);
  const engagementMin = parseEngagementRate(brief.engagementRate) ?? 0;

  const scored = rows
    .map((row) => {
      const followersCount = row.followersCount ?? toNumberFromFollowerText(row.followers);
      const avgViewsCount = row.avgViewsCount ?? toNumberFromFollowerText(row.avgViews);
      const engagement = parseEngagementRate(row.engagementRate) ?? 0;
      const profileText = [
        row.creatorName,
        row.handle,
        row.platform,
        row.country,
        row.language,
        row.niche,
        row.bio,
      ]
        .filter(Boolean)
        .join(" ");

      let score = 0;
      if (!platformFilter || row.platform?.toLowerCase() === platformFilter) score += 24;
      if (!targetMarket || profileText.toLowerCase().includes(targetMarket)) score += 20;
      if (!targetNiche || profileText.toLowerCase().includes(targetNiche)) score += 18;
      if (keywords.length === 0 || matchText(profileText, keywords) > 0) score += 16;
      if (followersCount >= min && followersCount <= max) score += 10;
      if (engagementMin === 0 || engagement >= engagementMin) score += 8;
      if (!brandNotes || matchText(profileText, brandNotes.split(" ")) > 0) score += 4;

      const matchScore = Math.min(100, score);

      return {
        ...row,
        followersCount,
        avgViewsCount,
        matchScore,
      } as SearchDatasetRow & { matchScore: number; followersCount: number; avgViewsCount: number };
    })
    .filter((row) => {
      const followersCount = row.followersCount ?? 0;
      const engagement = parseEngagementRate(row.engagementRate) ?? 0;
      const platformMatches = !platformFilter || row.platform?.toLowerCase() === platformFilter;
      const marketMatches =
        !targetMarket || `${row.country ?? ""} ${row.bio ?? ""}`.toLowerCase().includes(targetMarket);
      const nicheMatches =
        !targetNiche || `${row.niche ?? ""} ${row.bio ?? ""}`.toLowerCase().includes(targetNiche);
      const keywordMatches =
        keywords.length === 0 ||
        matchText(
          [row.creatorName, row.handle, row.bio, row.niche, row.country].filter(Boolean).join(" "),
          keywords,
        ) > 0;
      const rangeMatches = followersCount >= min && followersCount <= max;
      const engagementMatches = engagementMin === 0 || engagement >= engagementMin;
      const brandMatches =
        !brandNotes ||
        matchText([row.bio, row.niche, row.creatorName].filter(Boolean).join(" "), brandNotes.split(" ")) > 0;

      return (
        platformMatches &&
        marketMatches &&
        nicheMatches &&
        keywordMatches &&
        rangeMatches &&
        engagementMatches &&
        brandMatches
      );
    })
    .sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  return scored.map((row) =>
    normalizeCreatorLike(
      {
        ...row,
        followers: row.followers ?? toFollowerLabel(row.followersCount ?? 0),
        avgViews: row.avgViews ?? toFollowerLabel(row.avgViewsCount ?? 0),
        engagementRate: row.engagementRate ?? "—",
        source: (row.source as CreatorSearchResult["source"]) ?? "localSeedData",
      },
      (row.source as CreatorSearchResult["source"]) ?? "localSeedData",
      new Date().toISOString(),
    ),
  );
}

export function buildSearchNotice(sourceMode: string, hasRealSource: boolean, externalLabel = "External source") {
  if (!hasRealSource) {
    return `${externalLabel} is not connected. Showing demo or imported creators.`;
  }
  if (sourceMode === "importedCsv") {
    return "Showing imported CSV creators.";
  }
  return "Search completed.";
}

export function hasAnySearchCriteria(brief: CreatorSearchBrief) {
  return Boolean(
    brief.platform ||
      brief.market ||
      brief.niche ||
      brief.keywords ||
      brief.followerRangeMin ||
      brief.followerRangeMax ||
      brief.engagementRate ||
      brief.brandNotes,
  );
}
