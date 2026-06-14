import { normalizeCreatorLike, type CreatorSearchBrief, type CreatorSearchResult } from "@/lib/creator-search";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

function getYouTubeApiKey() {
  return process.env.YOUTUBE_API_KEY?.trim() ?? "";
}

type YouTubeSearchItem = {
  id?: {
    channelId?: string;
  };
};

type YouTubeChannelItem = {
  id?: string;
  snippet?: {
    title?: string;
    description?: string;
    country?: string;
    customUrl?: string;
  };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
};

export async function getYouTubeChannelDetails(channelIds: string[]) {
  const apiKey = getYouTubeApiKey();
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is missing.");
  }
  if (channelIds.length === 0) {
    return [] as YouTubeChannelItem[];
  }

  const response = await fetch(
    `${YOUTUBE_API_BASE}/channels?part=snippet,statistics&id=${encodeURIComponent(channelIds.join(","))}&key=${apiKey}`,
  );
  if (!response.ok) {
    throw new Error(`YouTube channels.list failed: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.items ?? []) as YouTubeChannelItem[];
}

export function normalizeYouTubeCreator(channel: YouTubeChannelItem): CreatorSearchResult {
  const channelId = channel.id ?? "";
  const title = channel.snippet?.title ?? "—";
  const customUrl = channel.snippet?.customUrl ? `@${channel.snippet.customUrl}` : `@${channelId || "youtube-channel"}`;
  const viewCount = Number(channel.statistics?.viewCount ?? 0);
  const videoCount = Number(channel.statistics?.videoCount ?? 0);
  const avgViews = videoCount > 0 ? `${Math.round(viewCount / videoCount)}` : "—";

  return normalizeCreatorLike(
    {
      creatorName: title,
      handle: customUrl,
      platform: "YouTube",
      profileUrl: channelId ? `https://www.youtube.com/channel/${channelId}` : "—",
      country: channel.snippet?.country ?? "—",
      language: "—",
      niche: "—",
      followers: channel.statistics?.subscriberCount ?? "—",
      avgViews,
      engagementRate: "—",
      email: "—",
      bio: channel.snippet?.description ?? "—",
      source: "youtube",
      lastCheckedAt: new Date().toISOString(),
    },
    "youtube",
    new Date().toISOString(),
  );
}

export async function searchYouTubeChannels(params: CreatorSearchBrief) {
  const apiKey = getYouTubeApiKey();
  if (!apiKey) {
    return {
      ok: false as const,
      message: "YOUTUBE_API_KEY is missing. Showing demo or imported creators.",
      creators: [] as CreatorSearchResult[],
    };
  }

  const queryParts = [params.keywords, params.niche, params.market].filter(Boolean).join(" ");
  const searchResponse = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&type=channel&maxResults=25&q=${encodeURIComponent(queryParts)}&key=${apiKey}`,
  );

  if (!searchResponse.ok) {
    if (searchResponse.status === 403) {
      return {
        ok: false as const,
        message: "YouTube API quota exceeded or access is restricted. Showing demo or imported creators.",
        creators: [] as CreatorSearchResult[],
      };
    }
    throw new Error(`YouTube search.list failed: ${searchResponse.status}`);
  }

  const searchPayload = (await searchResponse.json()) as { items?: YouTubeSearchItem[] };
  const channelIds = (searchPayload.items ?? [])
    .map((item) => item.id?.channelId)
    .filter((value): value is string => Boolean(value));

  if (channelIds.length === 0) {
    return {
      ok: true as const,
      message: "No YouTube creators found.",
      creators: [] as CreatorSearchResult[],
    };
  }

  const channels = await getYouTubeChannelDetails(channelIds);
  return {
    ok: true as const,
    message: `YouTube search completed with ${channels.length} creators.`,
    creators: channels.map((channel) => normalizeYouTubeCreator(channel)),
  };
}
