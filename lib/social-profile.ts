export type SocialPlatform = "TikTok" | "Instagram" | "YouTube" | "Facebook" | "";

export function detectSocialPlatform(url: string): SocialPlatform {
  const value = url.trim().toLowerCase();
  if (value.includes("tiktok.com")) return "TikTok";
  if (value.includes("instagram.com")) return "Instagram";
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "YouTube";
  if (value.includes("facebook.com")) return "Facebook";
  return "";
}

export function extractSocialHandle(url: string, platform: SocialPlatform) {
  const value = url.trim();
  const cleaned = value.replace(/[?#].*$/, "");
  const patternMap: Record<Exclude<SocialPlatform, "">, RegExp> = {
    TikTok: /tiktok\.com\/@([^/?]+)/i,
    Instagram: /instagram\.com\/([^/?]+)/i,
    YouTube: /youtube\.com\/(?:@|channel\/|c\/|user\/)?([^/?]+)/i,
    Facebook: /facebook\.com\/([^/?]+)/i,
  };
  const matcher = platform ? patternMap[platform] : undefined;
  const match =
    matcher?.exec(cleaned) ??
    /(?:@|\/)([A-Za-z0-9._-]{2,})$/.exec(cleaned.replace(/\/$/, ""));
  return match?.[1] ?? "";
}

export function handleToCreatorName(handle: string) {
  const normalized = handle.replace(/^@/, "").trim();
  if (!normalized) return "";
  return `@${normalized}`;
}

export function summarizeProfileUrl(url: string) {
  const platform = detectSocialPlatform(url);
  const handle = extractSocialHandle(url, platform);
  return {
    platform,
    handle,
    creatorName: handleToCreatorName(handle),
  };
}
