export type CreatorDataSourceKey =
  | 'localSeedData'
  | 'importedCsv'
  | 'apifyInstagram'
  | 'apifyTikTok'
  | 'youtubeApi'
  | 'googleSearch'
  | 'manualInput'
  | 'fastmoss';

export type CreatorSourceConfig = {
  key: CreatorDataSourceKey;
  label: string;
  ready: boolean;
  description: string;
};

export const creatorSourceConfigs: Record<CreatorDataSourceKey, CreatorSourceConfig> = {
  localSeedData: {
    key: 'localSeedData',
    label: 'Local Seed Data',
    ready: true,
    description: 'Built-in demo dataset used when no external API is connected.',
  },
  importedCsv: {
    key: 'importedCsv',
    label: 'Imported CSV',
    ready: true,
    description: 'Creators imported from CSV files such as FastMoss exports.',
  },
  apifyInstagram: {
    key: 'apifyInstagram',
    label: 'Apify Instagram',
    ready: false,
    description: 'Runs Apify Instagram actors when APIFY_TOKEN and actor ID are configured.',
  },
  apifyTikTok: {
    key: 'apifyTikTok',
    label: 'Apify TikTok',
    ready: false,
    description: 'Runs Apify TikTok actors when APIFY_TOKEN and actor ID are configured.',
  },
  youtubeApi: {
    key: 'youtubeApi',
    label: 'YouTube API',
    ready: false,
    description: 'Searches YouTube channels through the YouTube Data API.',
  },
  googleSearch: {
    key: 'googleSearch',
    label: 'Google Search',
    ready: false,
    description: 'Reserved for Google Custom Search or SerpAPI based discovery.',
  },
  manualInput: {
    key: 'manualInput',
    label: 'Manual Input',
    ready: true,
    description: 'Creators entered manually by the user.',
  },
  fastmoss: {
    key: 'fastmoss',
    label: 'FastMoss',
    ready: false,
    description: 'FastMoss enterprise API adapter placeholder.',
  },
};

export function getSourceConfig(key: CreatorDataSourceKey) {
  return creatorSourceConfigs[key];
}
