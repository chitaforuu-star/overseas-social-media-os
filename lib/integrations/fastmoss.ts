import { normalizeCreatorLike, type CreatorSearchBrief, type CreatorSearchResult } from "@/lib/creator-search";

function getFastMossConfig() {
  return {
    apiKey: process.env.FASTMOSS_API_KEY?.trim() ?? "",
    baseUrl: process.env.FASTMOSS_API_BASE_URL?.trim() ?? "",
  };
}

export async function searchFastMossCreators(params: CreatorSearchBrief) {
  const { apiKey, baseUrl } = getFastMossConfig();
  if (!apiKey || !baseUrl) {
    return {
      ok: false as const,
      message: "FastMoss API is not connected. Please import CSV or configure Enterprise API.",
      creators: [] as CreatorSearchResult[],
    };
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/creators/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`FastMoss API failed: ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Record<string, unknown>[];
    items?: Record<string, unknown>[];
  };
  const rows = payload.data ?? payload.items ?? [];
  return {
    ok: true as const,
    message: `FastMoss API returned ${rows.length} creators.`,
    creators: rows.map((row) =>
      normalizeCreatorLike(
        {
          creatorName: String(row.creatorName ?? row.name ?? "—"),
          handle: String(row.handle ?? row.username ?? "—"),
          platform: String(row.platform ?? "FastMoss"),
          profileUrl: String(row.profileUrl ?? row.url ?? "—"),
          country: String(row.country ?? row.market ?? "—"),
          language: String(row.language ?? "—"),
          niche: String(row.niche ?? row.category ?? "—"),
          followers: String(row.followers ?? row.followerCount ?? "—"),
          avgViews: String(row.avgViews ?? row.averageViews ?? "—"),
          engagementRate: String(row.engagementRate ?? "—"),
          email: String(row.email ?? "—"),
          bio: String(row.bio ?? row.description ?? "—"),
          source: "fastmoss",
          lastCheckedAt: new Date().toISOString(),
        },
        "fastmoss",
        new Date().toISOString(),
      ),
    ),
  };
}
