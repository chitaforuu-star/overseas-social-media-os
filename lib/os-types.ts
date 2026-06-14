export type Locale = "zh" | "en";

export type CreatorStageKey =
  | "finder"
  | "auditor"
  | "outreach"
  | "collaboration"
  | "sample"
  | "content"
  | "performance";

export type CreatorStatus =
  | "new"
  | "to_audit"
  | "approved"
  | "contacted"
  | "replied"
  | "sample_sent"
  | "content_scheduled"
  | "posted"
  | "reviewed";

export type CollaborationType = "Gifted" | "Paid" | "Affiliate" | "Seeding";

export type CampaignStatus = "Planned" | "Active" | "Paused" | "Completed";

export type DraftSource =
  | "manual"
  | "link"
  | "finder"
  | "auditor"
  | "localSeedData"
  | "importedCsv"
  | "apify"
  | "youtube"
  | "fastmoss";

export interface CreatorRecord {
  id: string;
  creatorName: string;
  handle?: string;
  platform: string;
  profileLink: string;
  country: string;
  language?: string;
  niche: string;
  keyword: string;
  followers: string;
  averageViews: string;
  email: string;
  whatsapp?: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  status: CreatorStatus;
  rate: string;
  targetProduct?: string;
  collaborationType?: CollaborationType | "";
  nextStep: string;
  lastContact?: string;
  followUpDate?: string;
  notes: string;
  source?: DraftSource;
}

export interface CreatorDraftRecord extends CreatorRecord {
  source: DraftSource;
  fitScore?: string;
  audienceMatch?: string;
  contentStyleMatch?: string;
  engagementQuality?: string;
  brandSafety?: string;
  collaborationPotential?: string;
  redFlags?: string;
  recommendation?: "Approve" | "Maybe" | "Reject";
  auditNotes?: string;
}

export interface CreatorAuditRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  contentMatchScore: string;
  engagementScore: string;
  audienceMatch: string;
  commentQuality: string;
  brandSafety: string;
  pastSponsoredContent: string;
  finalGrade: "A" | "B" | "C";
  decision: "Contact" | "Test" | "Reject";
}

export interface OutreachRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  contactChannel: "Email" | "IG DM" | "TikTok DM" | "WhatsApp";
  firstContactDate: string;
  messageTemplate: string;
  followUp1Date: string;
  followUp2Date: string;
  replyStatus: string;
  collaborationInterest: string;
  notes: string;
  platform?: string;
  email?: string;
  dateContacted?: string;
  followUpDate?: string;
  templateUsed?: string;
  status?: "Draft" | "Sent" | "Follow-up 1" | "Follow-up 2" | "Replied" | "No Response" | "Closed";
  reply?: string;
}

export interface CollaborationRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  collaborationType: "Free Product" | "Affiliate" | "Paid";
  fee: string;
  commissionRate: string;
  deliverables: string;
  platform: string;
  deadline: string;
  agreementStatus: string;
}

export interface SampleRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  productName: string;
  sku: string;
  color: string;
  shippingAddress: string;
  phone: string;
  country: string;
  logisticsProvider: string;
  trackingNumber: string;
  shippingStatus: string;
  deliveredDate: string;
}

export interface ContentRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  contentBrief: string;
  scriptDirection: string;
  keySellingPoints: string;
  discountCode: string;
  trackingLink: string;
  plannedPostDate: string;
  actualPostDate: string;
  postLink: string;
  tagChecked: string;
  linkChecked: string;
}

export interface PerformanceRecord {
  id: string;
  creatorId: string;
  creatorName: string;
  views: string;
  likes: string;
  comments: string;
  clicks: string;
  orders: string;
  revenue: string;
  conversionRate: string;
  roi: string;
  finalResult: "Reuse" | "Observe" | "Stop";
}

export interface CampaignRecord {
  id: string;
  campaignName: string;
  objective: string;
  targetMarket: string;
  creatorName: string;
  platform: string;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: string;
  trackingLink: string;
  discountCode: string;
  notes: string;
}

export interface ContentMaterialRecord {
  id: string;
  platform: string;
  topic: string;
  format: string;
  insight: string;
  status: string;
}

export interface CompetitorContentRecord {
  id: string;
  brand: string;
  platform: string;
  contentType: string;
  hook: string;
  cta: string;
  notes: string;
}

export interface ContentCalendarRecord {
  id: string;
  date: string;
  platform: string;
  campaign: string;
  scriptTemplate: string;
  owner: string;
  status: string;
}

export interface ScriptTemplateRecord {
  id: string;
  templateName: string;
  scenario: string;
  structure: string;
  keyPrompt: string;
  notes: string;
}

export interface EcommerceTrackingRecord {
  id: string;
  productName: string;
  productPageUrl: string;
  creatorName: string;
  trackingLink: string;
  discountCode: string;
  utmSource: string;
  clicks: string;
  orders: string;
  revenue: string;
  conversionRate: string;
}

export interface OSDataState {
  creators: CreatorRecord[];
  creatorDrafts: CreatorDraftRecord[];
  audits: CreatorAuditRecord[];
  outreach: OutreachRecord[];
  collaborations: CollaborationRecord[];
  campaigns: CampaignRecord[];
  samples: SampleRecord[];
  contentTracking: ContentRecord[];
  performance: PerformanceRecord[];
  contentMaterials: ContentMaterialRecord[];
  competitorContent: CompetitorContentRecord[];
  contentCalendar: ContentCalendarRecord[];
  scriptTemplates: ScriptTemplateRecord[];
  ecommerceTracking: EcommerceTrackingRecord[];
}
