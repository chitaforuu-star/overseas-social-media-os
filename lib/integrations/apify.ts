import { normalizeCreatorLike, type CreatorSearchBrief, type CreatorSearchResult } from "@/lib/creator-search";

const APIFY_BASE_URL = "https://api.apify.com/v2";

function getApifyToken() {
  return process.env.APIFY_TOKEN?.trim() ?? "";
}

function getActorId(platform: "Instagram" | "TikTok") {
  return platform === "Instagram"
    ? process.env.APIFY_INSTAGRAM_ACTOR_ID?.trim() ?? ""
    : process.env.APIFY_TIKTOK_ACTOR_ID?.trim() ?? "";
}

type ApifyRunResponse = {
  data?: {
    id: string;
    status: string;
    defaultDatasetId?: string;
  };
};

async function waitForRunFinished(runId: string, token: string) {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const response = await fetch(`${APIFY_BASE_URL}/actor-runs/${runId}?token=${token}`);
    if (!response.ok) {
      throw new Error(`Apify run poll failed: ${response.status}`);
    }
    const payload = (await response.json()) as ApifyRunResponse;
    const status = payload.data?.status ?? "RUNNING";
    if (["SUCCEEDED", "FAILED", "ABORTED", "TIMED-OUT"].includes(status)) {
      return payload.data;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error("Apify run timed out before finishing.");
}

export async function runApifyActor(actorId: string, input: Record<string, unknown>) {
  const token = getApifyToken();
  if (!token) {
    throw new Error("APIFY_TOKEN is missing.");
  }
  if (!actorId) {
    throw new Error("Apify actorId is missing.");
  }

  const response = await fetch(`${APIFY_BASE_URL}/actors/${actorId}/runs?token=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Apify actor run failed: ${response.status}`);
  }

  const payload = (await response.json()) as ApifyRunResponse;
  const runId = payload.data?.id;
  if (!runId) {
    throw new Error("Apify run ID was not returned.");
  }

  const finalRun = await waitForRunFinished(runId, token);
  if (!finalRun?.defaultDatasetId) {
    throw new Error("Apify dataset ID was not returned.");
  }
  return finalRun;
}

export async function getApifyDatasetItems(datasetId: string) {
  const token = getApifyToken();
  if (!token) {
    throw new Error("APIFY_TOKEN is missing.");
  }
  const response = await fetch(
    `${APIFY_BASE_URL}/datasets/${datasetId}/items?clean=true&format=json&token=${token}`,
  );
  if (!response.ok) {
    throw new Error(`Apify dataset fetch failed: ${response.status}`);
  }
  return (await response.json()) as Record<string, unknown>[];
}

function normalizeApifyRow(row: Record<string, unknown>, platform: string): CreatorSearchResult {
  return normalizeCreatorLike(
    {
      creatorName: String(row.creatorName ?? row.fullName ?? row.name ?? row.username ?? "—"),
      handle: String(row.handle ?? row.username ?? row.usernameHandle ?? "—"),
      platform,
      profileUrl: String(row.profileUrl ?? row.url ?? row.profileLink ?? "—"),
      country: String(row.country ?? row.location ?? row.market ?? "—"),
      language: String(row.language ?? row.lang ?? "—"),
      niche: String(row.niche ?? row.category ?? row.topic ?? "—"),
      followers: String(row.followers ?? row.followerCount ?? row.subscribers ?? row.subscriberCount ?? "—"),
      avgViews: String(row.avgViews ?? row.averageViews ?? row.avgViewCount ?? row.videoViews ?? "—"),
      engagementRate: String(row.engagementRate ?? row.engagement ?? row.engagement_ratio ?? "—"),
      email: String(row.email ?? row.contactEmail ?? "—"),
      bio: String(row.bio ?? row.description ?? row.about ?? "—"),
      source: "apify",
      lastCheckedAt: new Date().toISOString(),
    },
    "apify",
    new Date().toISOString(),
  );
}

async function searchByApifyActor(platform: "Instagram" | "TikTok", params: CreatorSearchBrief) {
  const actorId = getActorId(platform);
  if (!actorId) {
    return {
      ok: false as const,
      message:
        platform === "Instagram"
          ? "APIFY_INSTAGRAM_ACTOR_ID is missing. Showing demo or imported creators."
          : "APIFY_TIKTOK_ACTOR_ID is missing. Showing demo or imported creators.",
      creators: [] as CreatorSearchResult[],
    };
  }

  const run = await runApifyActor(actorId, {
    platform,
    query: params.keywords,
    keywords: params.keywords,
    market: params.market,
    niche: params.niche,
    followerRangeMin: params.followerRangeMin,
    followerRangeMax: params.followerRangeMax,
    engagementRate: params.engagementRate,
    brandNotes: params.brandNotes,
    maxItems: 25,
  });
  const datasetItems = await getApifyDatasetItems(run.defaultDatasetId!);
  return {
    ok: true as const,
    message: `Apify search completed with ${datasetItems.length} creators.`,
    creators: datasetItems.map((row) => normalizeApifyRow(row, platform)),
  };
}

export async function searchInstagramCreatorsByApify(params: CreatorSearchBrief) {
  return searchByApifyActor("Instagram", params);
}

export async function searchTikTokCreatorsByApify(params: CreatorSearchBrief) {
  return searchByApifyActor("TikTok", params);
}
