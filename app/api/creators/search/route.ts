import { NextResponse } from "next/server";
import { searchFastMossCreators } from "@/lib/integrations/fastmoss";
import {
  searchInstagramCreatorsByApify,
  searchTikTokCreatorsByApify,
} from "@/lib/integrations/apify";
import { searchYouTubeChannels } from "@/lib/integrations/youtube";
import {
  buildSearchNotice,
  hasAnySearchCriteria,
  seedCreatorRows,
  searchCreatorsInRows,
  type CreatorSearchBrief,
  type CreatorSearchResult,
  type SearchDatasetRow,
} from "@/lib/creator-search";

type SearchRequestBody = CreatorSearchBrief & {
  sourceMode?: string;
  databaseCreators?: SearchDatasetRow[];
};

function normalizeSourceMode(sourceMode?: string) {
  const allowed = new Set(["auto", "apify", "youtube", "fastmoss", "importedCsv", "demo"]);
  return allowed.has(sourceMode ?? "") ? sourceMode! : "auto";
}

function searchImportedCreators(databaseCreators: SearchDatasetRow[], brief: CreatorSearchBrief) {
  const importedRows = databaseCreators.filter((creator) =>
    ["importedCsv", "fastmoss"].includes(String(creator.source ?? "")),
  );
  return searchCreatorsInRows(importedRows, brief);
}

async function tryApify(platform: string, brief: CreatorSearchBrief) {
  if (platform === "Instagram") {
    return searchInstagramCreatorsByApify(brief);
  }
  return searchTikTokCreatorsByApify(brief);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<SearchRequestBody>;
    const brief: CreatorSearchBrief = {
      platform: body.platform?.trim() ?? "",
      market: body.market?.trim() ?? "",
      niche: body.niche?.trim() ?? "",
      keywords: body.keywords?.trim() ?? "",
      followerRangeMin: body.followerRangeMin ?? null,
      followerRangeMax: body.followerRangeMax ?? null,
      engagementRate: body.engagementRate?.trim() ?? "",
      brandNotes: body.brandNotes?.trim() ?? "",
      sourceMode: body.sourceMode ?? "auto",
    };
    const sourceMode = normalizeSourceMode(brief.sourceMode);
    const databaseCreators = Array.isArray(body.databaseCreators) ? body.databaseCreators : [];

    if (!hasAnySearchCriteria(brief)) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please add at least one search criterion.",
          sourceModeUsed: sourceMode,
          creators: [] as CreatorSearchResult[],
        },
        { status: 400 },
      );
    }

    if (sourceMode !== "demo") {
      const importedCreators = searchImportedCreators(databaseCreators, brief);
      if (importedCreators.length > 0) {
        return NextResponse.json({
          ok: true,
          sourceModeUsed: "importedCsv",
          message: "Showing imported CSV creators.",
          creators: importedCreators,
          dataNotice:
            "No real external source connected yet. Showing demo or imported creators.",
          fallbackToSeed: false,
        });
      }
    }

    const platform = brief.platform;
    const canUseApify = ["Instagram", "TikTok"].includes(platform);
    const canUseYouTube = platform === "YouTube";

    if (sourceMode === "apify" || (sourceMode === "auto" && canUseApify)) {
      try {
        const apifyResult = await tryApify(platform, brief);
        if (apifyResult.ok && apifyResult.creators.length > 0) {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: platform === "Instagram" ? "apifyInstagram" : "apifyTikTok",
            message: apifyResult.message,
            creators: apifyResult.creators,
            dataNotice: "Apify source connected.",
            fallbackToSeed: false,
          });
        }
        if (!apifyResult.ok) {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: "localSeedData",
            message: apifyResult.message,
            creators: searchCreatorsInRows(seedCreatorRows, brief),
            dataNotice:
              "External source is not connected. Showing demo or imported creators.",
            fallbackToSeed: true,
          });
        }
      } catch (error) {
        return NextResponse.json({
          ok: true,
          sourceModeUsed: "localSeedData",
          message:
            error instanceof Error
              ? error.message
              : "Apify search failed. Showing demo or imported creators.",
          creators: searchCreatorsInRows(seedCreatorRows, brief),
          dataNotice:
            "External source is not connected. Showing demo or imported creators.",
          fallbackToSeed: true,
        });
      }
    }

    if (sourceMode === "youtube" || (sourceMode === "auto" && canUseYouTube)) {
      try {
        const youtubeResult = await searchYouTubeChannels(brief);
        if (youtubeResult.ok && youtubeResult.creators.length > 0) {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: "youtubeApi",
            message: youtubeResult.message,
            creators: youtubeResult.creators,
            dataNotice: "YouTube Data API connected.",
            fallbackToSeed: false,
          });
        }
        if (!youtubeResult.ok) {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: "localSeedData",
            message: youtubeResult.message,
            creators: searchCreatorsInRows(seedCreatorRows, brief),
            dataNotice:
              "External source is not connected. Showing demo or imported creators.",
            fallbackToSeed: true,
          });
        }
      } catch (error) {
        return NextResponse.json({
          ok: true,
          sourceModeUsed: "localSeedData",
          message:
            error instanceof Error
              ? error.message
              : "YouTube search failed. Showing demo or imported creators.",
          creators: searchCreatorsInRows(seedCreatorRows, brief),
          dataNotice:
            "External source is not connected. Showing demo or imported creators.",
          fallbackToSeed: true,
        });
      }
    }

    if (sourceMode === "fastmoss" || sourceMode === "auto") {
      try {
        const fastmossResult = await searchFastMossCreators(brief);
        if (fastmossResult.ok && fastmossResult.creators.length > 0) {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: "fastmoss",
            message: fastmossResult.message,
            creators: fastmossResult.creators,
            dataNotice: "FastMoss adapter connected.",
            fallbackToSeed: false,
          });
        }
        if (!fastmossResult.ok && sourceMode === "fastmoss") {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: "localSeedData",
            message: fastmossResult.message,
            creators: searchCreatorsInRows(seedCreatorRows, brief),
            dataNotice:
              "External source is not connected. Showing demo or imported creators.",
            fallbackToSeed: true,
          });
        }
      } catch (error) {
        if (sourceMode === "fastmoss") {
          return NextResponse.json({
            ok: true,
            sourceModeUsed: "localSeedData",
            message:
              error instanceof Error
                ? error.message
                : "FastMoss search failed. Showing demo or imported creators.",
            creators: searchCreatorsInRows(seedCreatorRows, brief),
            dataNotice:
              "External source is not connected. Showing demo or imported creators.",
            fallbackToSeed: true,
          });
        }
      }
    }

    const seedResults = searchCreatorsInRows(seedCreatorRows, brief);
    return NextResponse.json({
      ok: true,
      sourceModeUsed: "localSeedData",
      message: buildSearchNotice(sourceMode, false, "External source"),
      creators: seedResults,
      dataNotice: "External source is not connected. Showing demo or imported creators.",
      fallbackToSeed: true,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Search failed.",
        creators: [] as CreatorSearchResult[],
      },
      { status: 500 },
    );
  }
}

