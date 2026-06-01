import type { Column } from "@/components/os/editable-table";
import type {
  CollaborationRecord,
  ContentRecord,
  ContentCalendarRecord,
  ContentMaterialRecord,
  CompetitorContentRecord,
  CreatorAuditRecord,
  CreatorRecord,
  EcommerceTrackingRecord,
  OutreachRecord,
  PerformanceRecord,
  ScriptTemplateRecord,
  SampleRecord,
} from "@/lib/os-types";

export const creatorFinderColumns: Column<CreatorRecord>[] = [
  { key: "platform", label: "平台 / Platform" },
  { key: "country", label: "国家 / Country" },
  { key: "niche", label: "垂类 / Niche" },
  { key: "keyword", label: "关键词 / Keyword" },
  { key: "creatorName", label: "达人名称 / Creator Name" },
  { key: "profileLink", label: "主页链接 / Profile Link" },
  { key: "followers", label: "粉丝数 / Followers" },
  { key: "averageViews", label: "平均播放 / Average Views" },
  { key: "email", label: "邮箱 / Email" },
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "facebook", label: "Facebook" },
  { key: "notes", label: "备注 / Notes", type: "textarea" },
];

export const creatorAuditColumns: Column<CreatorAuditRecord>[] = [
  { key: "creatorName", label: "达人名称 / Creator Name" },
  { key: "contentMatchScore", label: "内容匹配分 / Content Match Score" },
  { key: "engagementScore", label: "互动分 / Engagement Score" },
  { key: "audienceMatch", label: "受众匹配 / Audience Match" },
  { key: "commentQuality", label: "评论质量 / Comment Quality" },
  { key: "brandSafety", label: "品牌安全 / Brand Safety" },
  { key: "pastSponsoredContent", label: "历史商单 / Past Sponsored Content" },
  {
    key: "finalGrade",
    label: "最终评级 / Final Grade",
    type: "select",
    options: ["A", "B", "C"],
  },
  {
    key: "decision",
    label: "决策 / Decision",
    type: "select",
    options: ["Contact", "Test", "Reject"],
  },
];

export const outreachColumns: Column<OutreachRecord>[] = [
  { key: "creatorName", label: "达人名称 / Creator Name" },
  {
    key: "contactChannel",
    label: "联系渠道 / Contact Channel",
    type: "select",
    options: ["Email", "IG DM", "TikTok DM", "WhatsApp"],
  },
  { key: "firstContactDate", label: "首次建联 / First Contact", type: "date" },
  { key: "messageTemplate", label: "话术模板 / Message Template", type: "textarea" },
  { key: "followUp1Date", label: "跟进1 / Follow-up 1", type: "date" },
  { key: "followUp2Date", label: "跟进2 / Follow-up 2", type: "date" },
  { key: "replyStatus", label: "回复状态 / Reply Status" },
  { key: "collaborationInterest", label: "合作意向 / Collaboration Interest" },
  { key: "notes", label: "备注 / Notes", type: "textarea" },
];

export const collaborationColumns: Column<CollaborationRecord>[] = [
  { key: "creatorName", label: "达人名称 / Creator Name" },
  {
    key: "collaborationType",
    label: "合作类型 / Collaboration Type",
    type: "select",
    options: ["Free Product", "Affiliate", "Paid"],
  },
  { key: "fee", label: "费用 / Fee" },
  { key: "commissionRate", label: "佣金比例 / Commission Rate" },
  { key: "deliverables", label: "交付内容 / Deliverables", type: "textarea" },
  { key: "platform", label: "平台 / Platform" },
  { key: "deadline", label: "截止日期 / Deadline", type: "date" },
  { key: "agreementStatus", label: "协议状态 / Agreement Status" },
];

export const sampleColumns: Column<SampleRecord>[] = [
  { key: "creatorName", label: "达人名称 / Creator Name" },
  { key: "productName", label: "产品名 / Product Name" },
  { key: "sku", label: "SKU" },
  { key: "color", label: "颜色 / Color" },
  { key: "shippingAddress", label: "收货地址 / Shipping Address", type: "textarea" },
  { key: "phone", label: "电话 / Phone" },
  { key: "country", label: "国家 / Country" },
  { key: "logisticsProvider", label: "物流商 / Logistics Provider" },
  { key: "trackingNumber", label: "运单号 / Tracking Number" },
  { key: "shippingStatus", label: "物流状态 / Shipping Status" },
  { key: "deliveredDate", label: "签收日期 / Delivered Date", type: "date" },
];

export const contentTrackerColumns: Column<ContentRecord>[] = [
  { key: "creatorName", label: "达人名称 / Creator Name" },
  { key: "contentBrief", label: "内容简报 / Content Brief", type: "textarea" },
  { key: "scriptDirection", label: "脚本方向 / Script Direction", type: "textarea" },
  { key: "keySellingPoints", label: "核心卖点 / Key Selling Points", type: "textarea" },
  { key: "discountCode", label: "折扣码 / Discount Code" },
  { key: "trackingLink", label: "追踪链接 / Tracking Link" },
  { key: "plannedPostDate", label: "计划发布时间 / Planned Post Date", type: "date" },
  { key: "actualPostDate", label: "实际发布时间 / Actual Post Date", type: "date" },
  { key: "postLink", label: "内容链接 / Post Link" },
  { key: "tagChecked", label: "Tag 检查 / Tag Checked" },
  { key: "linkChecked", label: "链接检查 / Link Checked" },
];

export const performanceColumns: Column<PerformanceRecord>[] = [
  { key: "creatorName", label: "达人名称 / Creator Name" },
  { key: "views", label: "播放 / Views" },
  { key: "likes", label: "点赞 / Likes" },
  { key: "comments", label: "评论 / Comments" },
  { key: "clicks", label: "点击 / Clicks" },
  { key: "orders", label: "订单 / Orders" },
  { key: "revenue", label: "收入 / Revenue" },
  { key: "conversionRate", label: "转化率 / Conversion Rate" },
  { key: "roi", label: "ROI" },
  {
    key: "finalResult",
    label: "最终结论 / Final Result",
    type: "select",
    options: ["Reuse", "Observe", "Stop"],
  },
];

export const materialColumns: Column<ContentMaterialRecord>[] = [
  { key: "platform", label: "平台 / Platform" },
  { key: "topic", label: "话题 / Topic" },
  { key: "format", label: "内容形式 / Format" },
  { key: "insight", label: "拆解洞察 / Breakdown Insight", type: "textarea" },
  { key: "status", label: "状态 / Status" },
];

export const competitorColumns: Column<CompetitorContentRecord>[] = [
  { key: "brand", label: "竞品品牌 / Competitor Brand" },
  { key: "platform", label: "平台 / Platform" },
  { key: "contentType", label: "内容类型 / Content Type" },
  { key: "hook", label: "Hook 拆解 / Hook" },
  { key: "cta", label: "CTA 拆解 / CTA" },
  { key: "notes", label: "备注 / Notes", type: "textarea" },
];

export const calendarColumns: Column<ContentCalendarRecord>[] = [
  { key: "date", label: "日期 / Date", type: "date" },
  { key: "platform", label: "平台 / Platform" },
  { key: "campaign", label: "活动 / Campaign" },
  { key: "scriptTemplate", label: "脚本模板 / Script Template" },
  { key: "owner", label: "负责人 / Owner" },
  { key: "status", label: "状态 / Status" },
];

export const scriptColumns: Column<ScriptTemplateRecord>[] = [
  { key: "templateName", label: "模板名 / Template Name" },
  { key: "scenario", label: "场景 / Scenario" },
  { key: "structure", label: "结构 / Structure" },
  { key: "keyPrompt", label: "关键提示词 / Key Prompt", type: "textarea" },
  { key: "notes", label: "备注 / Notes", type: "textarea" },
];

export const ecommerceColumns: Column<EcommerceTrackingRecord>[] = [
  { key: "productName", label: "产品名 / Product Name" },
  { key: "productPageUrl", label: "产品页链接 / Product Page URL" },
  { key: "creatorName", label: "达人名称 / Creator Name" },
  { key: "trackingLink", label: "追踪链接 / Tracking Link" },
  { key: "discountCode", label: "折扣码 / Discount Code" },
  { key: "utmSource", label: "UTM Source" },
  { key: "clicks", label: "点击 / Clicks" },
  { key: "orders", label: "订单 / Orders" },
  { key: "revenue", label: "收入 / Revenue" },
  { key: "conversionRate", label: "转化率 / Conversion Rate" },
];
