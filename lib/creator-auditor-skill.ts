export type CreatorAuditSkillInput = {
  profileUrl: string;
  targetProduct: string;
  targetMarket: string;
  brandStyle: string;
  creatorName?: string;
  platform?: string;
  niche?: string;
  followers?: string;
  avgViews?: string;
  engagementRate?: string;
  bio?: string;
};

export type CreatorAuditSkillResult = {
  overallScore: number;
  matchLevel: 'Strong Match' | 'Maybe' | 'Not Fit';
  reasonSummary: string;
  audienceFit: string;
  contentFit: string;
  brandFit: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  redFlags: string[];
  suggestedCollaborationType: 'Gifted' | 'Paid' | 'Affiliate' | 'Seeding';
  suggestedOutreachAngle: string;
  nextStep: string;
  checklist: string[];
};

function toNumber(value?: string) {
  if (!value) return 0;
  const normalized = value.replace(/,/g, '').trim().toUpperCase();
  const match = normalized.match(/([\d.]+)\s*(K|M)?/);
  if (!match) return Number(normalized) || 0;
  const amount = Number(match[1]);
  const suffix = match[2];
  if (suffix === 'M') return amount * 1_000_000;
  if (suffix === 'K') return amount * 1_000;
  return amount;
}

function includesAny(haystack: string, needles: string[]) {
  const value = haystack.toLowerCase();
  return needles.some((needle) => value.includes(needle.toLowerCase()));
}

export function scoreCreatorAudit(input: CreatorAuditSkillInput): CreatorAuditSkillResult {
  const market = input.targetMarket.toLowerCase();
  const niche = input.niche?.toLowerCase() ?? '';
  const style = input.brandStyle.toLowerCase();
  const bio = input.bio?.toLowerCase() ?? '';
  const followerCount = toNumber(input.followers);
  const engagement = toNumber(input.engagementRate);

  const nicheFit = includesAny(niche || bio, [input.targetProduct, input.brandStyle]) ? 1 : 0.6;
  const audienceFit = includesAny(market || bio, [input.targetMarket]) ? 1 : 0.55;
  const contentStyleFit = includesAny(style || bio, ['minimal', 'premium', 'calm', 'lifestyle', 'quiet', 'luxury']) ? 1 : 0.65;
  const engagementQuality = engagement >= 2 || followerCount < 0 ? 0.85 : engagement >= 1 ? 0.7 : 0.55;
  const brandSafety = includesAny(bio, ['spam', 'fake', 'betting', 'casino', 'adult']) ? 0.15 : 0.9;
  const collaborationPotential = followerCount >= 100000 || engagement >= 2 ? 0.85 : 0.7;

  const overallScore = Math.round(
    nicheFit * 25 +
      audienceFit * 20 +
      contentStyleFit * 20 +
      engagementQuality * 15 +
      brandSafety * 10 +
      collaborationPotential * 10,
  );

  const matchLevel = overallScore >= 75 ? 'Strong Match' : overallScore >= 50 ? 'Maybe' : 'Not Fit';
  const riskLevel = brandSafety < 0.4 ? 'High' : brandSafety < 0.75 ? 'Medium' : 'Low';

  const redFlags = [
    brandSafety < 0.75 ? 'Possible brand safety review needed.' : '',
    !input.bio ? 'Missing creator bio or content context.' : '',
    !input.followers ? 'Missing follower data.' : '',
    !input.engagementRate ? 'Missing engagement rate.' : '',
  ].filter(Boolean);

  const suggestedCollaborationType =
    overallScore >= 80 ? 'Paid' : overallScore >= 65 ? 'Gifted' : overallScore >= 50 ? 'Affiliate' : 'Seeding';

  const reasonSummary =
    matchLevel === 'Strong Match'
      ? 'Strong niche, audience, and style alignment with only minor review needed.'
      : matchLevel === 'Maybe'
        ? 'Potential fit, but some data points need manual confirmation before outreach.'
        : 'Current profile signals are weak or incomplete for this target brief.';

  const audienceFitText =
    audienceFit >= 0.85
      ? 'Audience market aligns with the target brief.'
      : 'Audience market match is partial and should be reviewed manually.';
  const contentFitText =
    contentStyleFit >= 0.85
      ? 'Content style is aligned with the requested brand direction.'
      : 'Content style needs review before outreach.';
  const brandFitText =
    brandSafety >= 0.75 ? 'No major brand safety issues detected.' : 'Review brand safety and comment quality carefully.';

  const suggestedOutreachAngle =
    matchLevel === 'Strong Match'
      ? 'Lead with audience fit and a clear product-story angle.'
      : matchLevel === 'Maybe'
        ? 'Open with a light fit check and ask for recent performance examples.'
        : 'Use a soft-touch message and request more profile details.';

  const nextStep =
    matchLevel === 'Strong Match'
      ? 'Save to CRM, send outreach, and prepare a collaboration brief.'
      : matchLevel === 'Maybe'
        ? 'Save to CRM and run a manual audit before outreach.'
        : 'Keep in review or reject until more data is available.';

  const checklist = [
    input.profileUrl ? 'Profile URL captured' : 'Profile URL missing',
    input.targetProduct ? 'Target product defined' : 'Target product missing',
    input.targetMarket ? 'Target market defined' : 'Target market missing',
    input.brandStyle ? 'Brand style brief added' : 'Brand style brief missing',
    input.followers ? 'Follower data present' : 'Follower data missing',
  ];

  return {
    overallScore,
    matchLevel,
    reasonSummary,
    audienceFit: audienceFitText,
    contentFit: contentFitText,
    brandFit: brandFitText,
    riskLevel,
    redFlags,
    suggestedCollaborationType,
    suggestedOutreachAngle,
    nextStep,
    checklist,
  };
}
