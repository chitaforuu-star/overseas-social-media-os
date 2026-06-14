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
  Locale,
  OutreachRecord,
  PerformanceRecord,
  ScriptTemplateRecord,
  SampleRecord,
} from "@/lib/os-types";

function t(locale: Locale, zh: string, en: string) {
  return locale === "zh" ? zh : en;
}

export function getCreatorFinderColumns(locale: Locale): Column<CreatorRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    { key: "platform", label: t(locale, "平台", "Platform") },
    { key: "country", label: t(locale, "国家", "Country") },
    { key: "niche", label: t(locale, "垂类", "Niche") },
    { key: "keyword", label: t(locale, "关键词", "Keyword") },
    { key: "followers", label: t(locale, "粉丝数", "Followers") },
    { key: "averageViews", label: t(locale, "平均播放量", "Average Views") },
    { key: "email", label: t(locale, "邮箱", "Email") },
    { key: "profileLink", label: t(locale, "主页链接", "Profile Link") },
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "youtube", label: "YouTube" },
    { key: "facebook", label: "Facebook" },
    { key: "rate", label: t(locale, "合作报价", "Rate") },
    { key: "nextStep", label: t(locale, "下一步", "Next Step") },
    {
      key: "status",
      label: t(locale, "状态", "Status"),
      type: "select",
      options: ["new", "contacted", "replied", "sample_sent", "posted", "reviewed"],
    },
    { key: "notes", label: t(locale, "备注", "Notes"), type: "textarea" },
  ];
}

export function getCreatorAuditColumns(locale: Locale): Column<CreatorAuditRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    { key: "contentMatchScore", label: t(locale, "内容匹配", "Content Match Score") },
    { key: "engagementScore", label: t(locale, "互动质量", "Engagement Score") },
    { key: "audienceMatch", label: t(locale, "受众匹配", "Audience Match") },
    { key: "commentQuality", label: t(locale, "评论质量", "Comment Quality") },
    { key: "brandSafety", label: t(locale, "品牌安全", "Brand Safety") },
    { key: "pastSponsoredContent", label: t(locale, "历史商单", "Past Sponsored Content") },
    { key: "finalGrade", label: t(locale, "最终评级", "Final Grade"), type: "select", options: ["A", "B", "C"] },
    { key: "decision", label: t(locale, "决策", "Decision"), type: "select", options: ["Contact", "Test", "Reject"] },
  ];
}

export function getOutreachColumns(locale: Locale): Column<OutreachRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    {
      key: "contactChannel",
      label: t(locale, "建联渠道", "Contact Channel"),
      type: "select",
      options: ["Email", "IG DM", "TikTok DM", "WhatsApp"],
    },
    { key: "firstContactDate", label: t(locale, "首次建联", "First Contact Date"), type: "date" },
    { key: "messageTemplate", label: t(locale, "话术模板", "Message Template"), type: "textarea" },
    { key: "followUp1Date", label: t(locale, "跟进 1", "Follow-up 1"), type: "date" },
    { key: "followUp2Date", label: t(locale, "跟进 2", "Follow-up 2"), type: "date" },
    { key: "replyStatus", label: t(locale, "回复状态", "Reply Status") },
    { key: "collaborationInterest", label: t(locale, "合作意向", "Collaboration Interest") },
    { key: "notes", label: t(locale, "备注", "Notes"), type: "textarea" },
  ];
}

export function getCollaborationColumns(locale: Locale): Column<CollaborationRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    {
      key: "collaborationType",
      label: t(locale, "合作类型", "Collaboration Type"),
      type: "select",
      options: ["Free Product", "Affiliate", "Paid"],
    },
    { key: "fee", label: t(locale, "费用", "Fee") },
    { key: "commissionRate", label: t(locale, "佣金比例", "Commission Rate") },
    { key: "deliverables", label: t(locale, "交付内容", "Deliverables"), type: "textarea" },
    { key: "platform", label: t(locale, "平台", "Platform") },
    { key: "deadline", label: t(locale, "截止日期", "Deadline"), type: "date" },
    { key: "agreementStatus", label: t(locale, "协议状态", "Agreement Status") },
  ];
}

export function getSampleColumns(locale: Locale): Column<SampleRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    { key: "productName", label: t(locale, "产品名称", "Product Name") },
    { key: "sku", label: "SKU" },
    { key: "color", label: t(locale, "颜色", "Color") },
    { key: "shippingAddress", label: t(locale, "收货地址", "Shipping Address"), type: "textarea" },
    { key: "phone", label: t(locale, "电话", "Phone") },
    { key: "country", label: t(locale, "国家", "Country") },
    { key: "logisticsProvider", label: t(locale, "物流服务商", "Logistics Provider") },
    { key: "trackingNumber", label: t(locale, "物流单号", "Tracking Number") },
    { key: "shippingStatus", label: t(locale, "物流状态", "Shipping Status") },
    { key: "deliveredDate", label: t(locale, "签收日期", "Delivered Date"), type: "date" },
  ];
}

export function getContentTrackerColumns(locale: Locale): Column<ContentRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    { key: "contentBrief", label: t(locale, "内容 Brief", "Content Brief"), type: "textarea" },
    { key: "scriptDirection", label: t(locale, "脚本方向", "Script Direction"), type: "textarea" },
    { key: "keySellingPoints", label: t(locale, "核心卖点", "Key Selling Points"), type: "textarea" },
    { key: "discountCode", label: t(locale, "折扣码", "Discount Code") },
    { key: "trackingLink", label: t(locale, "追踪链接", "Tracking Link") },
    { key: "plannedPostDate", label: t(locale, "计划发布日期", "Planned Post Date"), type: "date" },
    { key: "actualPostDate", label: t(locale, "实际发布日期", "Actual Post Date"), type: "date" },
    { key: "postLink", label: t(locale, "内容链接", "Post Link") },
    { key: "tagChecked", label: t(locale, "Tag 检查", "Tag Checked") },
    { key: "linkChecked", label: t(locale, "链接检查", "Link Checked") },
  ];
}

export function getPerformanceColumns(locale: Locale): Column<PerformanceRecord>[] {
  return [
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    { key: "views", label: t(locale, "播放量", "Views") },
    { key: "likes", label: t(locale, "点赞", "Likes") },
    { key: "comments", label: t(locale, "评论", "Comments") },
    { key: "clicks", label: t(locale, "点击", "Clicks") },
    { key: "orders", label: t(locale, "订单", "Orders") },
    { key: "revenue", label: t(locale, "收入", "Revenue") },
    { key: "conversionRate", label: t(locale, "转化率", "Conversion Rate") },
    { key: "roi", label: "ROI" },
    { key: "finalResult", label: t(locale, "最终结论", "Final Result"), type: "select", options: ["Reuse", "Observe", "Stop"] },
  ];
}

export function getMaterialColumns(locale: Locale): Column<ContentMaterialRecord>[] {
  return [
    { key: "platform", label: t(locale, "平台", "Platform") },
    { key: "topic", label: t(locale, "话题", "Topic") },
    { key: "format", label: t(locale, "内容形式", "Format") },
    { key: "insight", label: t(locale, "拆解洞察", "Breakdown Insight"), type: "textarea" },
    { key: "status", label: t(locale, "状态", "Status") },
  ];
}

export function getCompetitorColumns(locale: Locale): Column<CompetitorContentRecord>[] {
  return [
    { key: "brand", label: t(locale, "竞品品牌", "Competitor Brand") },
    { key: "platform", label: t(locale, "平台", "Platform") },
    { key: "contentType", label: t(locale, "内容类型", "Content Type") },
    { key: "hook", label: t(locale, "Hook 拆解", "Hook") },
    { key: "cta", label: t(locale, "CTA 拆解", "CTA") },
    { key: "notes", label: t(locale, "备注", "Notes"), type: "textarea" },
  ];
}

export function getCalendarColumns(locale: Locale): Column<ContentCalendarRecord>[] {
  return [
    { key: "date", label: t(locale, "日期", "Date"), type: "date" },
    { key: "platform", label: t(locale, "平台", "Platform") },
    { key: "campaign", label: t(locale, "活动", "Campaign") },
    { key: "scriptTemplate", label: t(locale, "脚本模板", "Script Template") },
    { key: "owner", label: t(locale, "负责人", "Owner") },
    { key: "status", label: t(locale, "状态", "Status") },
  ];
}

export function getScriptColumns(locale: Locale): Column<ScriptTemplateRecord>[] {
  return [
    { key: "templateName", label: t(locale, "模板名称", "Template Name") },
    { key: "scenario", label: t(locale, "使用场景", "Scenario") },
    { key: "structure", label: t(locale, "结构", "Structure") },
    { key: "keyPrompt", label: t(locale, "核心提示词", "Key Prompt"), type: "textarea" },
    { key: "notes", label: t(locale, "备注", "Notes"), type: "textarea" },
  ];
}

export function getEcommerceColumns(locale: Locale): Column<EcommerceTrackingRecord>[] {
  return [
    { key: "productName", label: t(locale, "产品名称", "Product Name") },
    { key: "productPageUrl", label: t(locale, "产品页链接", "Product Page URL") },
    { key: "creatorName", label: t(locale, "达人名称", "Creator Name") },
    { key: "trackingLink", label: t(locale, "追踪链接", "Tracking Link") },
    { key: "discountCode", label: t(locale, "折扣码", "Discount Code") },
    { key: "utmSource", label: "UTM Source" },
    { key: "clicks", label: t(locale, "点击", "Clicks") },
    { key: "orders", label: t(locale, "订单", "Orders") },
    { key: "revenue", label: t(locale, "收入", "Revenue") },
    { key: "conversionRate", label: t(locale, "转化率", "Conversion Rate") },
  ];
}
