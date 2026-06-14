import { NextResponse } from "next/server";
import { scoreCreatorAudit } from "@/lib/creator-auditor-skill";
import { normalizeCreatorLike, seedCreatorRows, type SearchDatasetRow } from "@/lib/creator-search";
import { summarizeProfileUrl } from "@/lib/social-profile";

type AuditRequestBody = {
  profileUrl: string;
  targetProduct: string;
  targetMarket: string;
  brandStyle: string;
  creatorRecord?: SearchDatasetRow;
};

function findSeedMatch(profileUrl: string) {
  const parsed = summarizeProfileUrl(profileUrl);
  const normalizedUrl = profileUrl.trim().toLowerCase();
  return seedCreatorRows.find((row) => {
    const profile = String(row.profileUrl ?? "").toLowerCase();
    const handle = String(row.handle ?? "").toLowerCase();
    const creatorName = String(row.creatorName ?? "").toLowerCase();
    return (
      profile === normalizedUrl ||
      profile.includes(normalizedUrl) ||
      normalizedUrl.includes(profile) ||
      (parsed.handle && handle.includes(parsed.handle.toLowerCase())) ||
      (parsed.handle && creatorName.includes(parsed.handle.toLowerCase().replace(/^@/, "")))
    );
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AuditRequestBody>;
    const profileUrl = body.profileUrl?.trim() ?? "";
    if (!profileUrl) {
      return NextResponse.json(
        {
          ok: false,
          message: "Profile URL is required.",
        },
        { status: 400 },
      );
    }

    const parsed = summarizeProfileUrl(profileUrl);
    const matchedCreator = body.creatorRecord ?? findSeedMatch(profileUrl);
    const normalizedCreator = matchedCreator
      ? normalizeCreatorLike(
          {
            ...matchedCreator,
            creatorName: matchedCreator.creatorName ?? parsed.creatorName,
            handle: matchedCreator.handle ?? parsed.handle,
            platform: matchedCreator.platform ?? parsed.platform,
            profileUrl: matchedCreator.profileUrl ?? profileUrl,
            bio: matchedCreator.bio ?? "",
            followers: matchedCreator.followers ?? "",
            avgViews: matchedCreator.avgViews ?? "",
            engagementRate: matchedCreator.engagementRate ?? "",
            country: matchedCreator.country ?? "",
            language: matchedCreator.language ?? "",
            niche: matchedCreator.niche ?? "",
          },
          "localSeedData",
          new Date().toISOString(),
        )
      : null;

    const hasRealData = Boolean(
      normalizedCreator?.followers !== "—" ||
        normalizedCreator?.avgViews !== "—" ||
        normalizedCreator?.engagementRate !== "—" ||
        normalizedCreator?.bio !== "—",
    );

    const skillResult = scoreCreatorAudit({
      profileUrl,
      targetProduct: body.targetProduct?.trim() ?? "",
      targetMarket: body.targetMarket?.trim() ?? "",
      brandStyle: body.brandStyle?.trim() ?? "",
      creatorName: normalizedCreator?.creatorName,
      platform: normalizedCreator?.platform || parsed.platform,
      niche: normalizedCreator?.niche,
      followers: normalizedCreator?.followers,
      avgViews: normalizedCreator?.avgViews,
      engagementRate: normalizedCreator?.engagementRate,
      bio: normalizedCreator?.bio,
    });

    const overallScore = skillResult.overallScore;
    const matchLevel = skillResult.matchLevel;
    const riskLevel = skillResult.riskLevel;
    const dataNotice = hasRealData
      ? "Existing creator data found and included in the audit."
      : "Missing follower, engagement, or content data. Running a basic audit.";

    const recommendation =
      matchLevel === "Strong Match" ? "Approve" : matchLevel === "Maybe" ? "Maybe" : "Reject";

    return NextResponse.json({
      ok: true,
      platform: normalizedCreator?.platform || parsed.platform || "Unknown",
      handle: normalizedCreator?.handle || parsed.handle || "—",
      creatorName: normalizedCreator?.creatorName || parsed.creatorName || "—",
      overallScore,
      matchLevel,
      reasonSummary: skillResult.reasonSummary,
      audienceFit: skillResult.audienceFit,
      contentFit: skillResult.contentFit,
      brandFit: skillResult.brandFit,
      riskLevel,
      redFlags: skillResult.redFlags,
      suggestedCollaborationType: skillResult.suggestedCollaborationType,
      suggestedOutreachAngle: skillResult.suggestedOutreachAngle,
      nextStep: skillResult.nextStep,
      checklist: skillResult.checklist,
      recommendation,
      dataNotice,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Audit failed.",
      },
      { status: 500 },
    );
  }
}
