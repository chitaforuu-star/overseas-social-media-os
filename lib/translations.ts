import type { CreatorStageKey, Locale } from "@/lib/os-types";

export type BilingualText = {
  zh: string;
  en: string;
};

export type AppCopy = {
  appName: BilingualText;
  appTagline: BilingualText;
  homeTitle: BilingualText;
  homeDescription: BilingualText;
  homeModules: {
    creatorCrm: BilingualText;
    contentHub: BilingualText;
    ecommerce: BilingualText;
  };
  aboutTitle: BilingualText;
  aboutDescription: BilingualText;
  languageLabel: BilingualText;
  creatorCrmTitle: BilingualText;
  creatorCrmDescription: BilingualText;
  contentHubTitle: BilingualText;
  contentHubDescription: BilingualText;
  ecommerceTitle: BilingualText;
  ecommerceDescription: BilingualText;
  sectionLabel: BilingualText;
  addRowButton: BilingualText;
  flowButton: BilingualText;
  stageTitles: Record<CreatorStageKey, BilingualText>;
  stageDescriptions: Record<CreatorStageKey, BilingualText>;
};

export const copy: AppCopy = {
  appName: {
    zh: "Overseas Social Media OS",
    en: "Overseas Social Media OS",
  },
  appTagline: {
    zh: "海外社媒运营工作流系统：用于管理达人搜索、达人审核、建联、寄样、内容上线和数据复盘。",
    en: "A practical Overseas Social Media / Influencer Marketing workflow system for creator sourcing, auditing, outreach, sampling, content tracking, and performance review.",
  },
  homeTitle: {
    zh: "实战型海外社媒运营与达人营销系统",
    en: "A Practical Operations System for Overseas Social Media & Influencer Marketing",
  },
  homeDescription: {
    zh: "这个原型聚焦真实执行流程，核心是 Creator CRM，而不是泛内容展示页面。",
    en: "This prototype is built for real execution. It prioritizes Creator CRM over generic content showcase pages.",
  },
  homeModules: {
    creatorCrm: {
      zh: "Creator CRM（核心）",
      en: "Creator CRM (Core)",
    },
    contentHub: {
      zh: "Content Hub",
      en: "Content Hub",
    },
    ecommerce: {
      zh: "E-commerce Tracking",
      en: "E-commerce Tracking",
    },
  },
  aboutTitle: {
    zh: "关于这个项目",
    en: "About This Project",
  },
  aboutDescription: {
    zh: "这是我为海外社媒运营 / KOL Marketing 岗位搭建的实战型工作流原型，用于学习、实操和求职作品展示。",
    en: "This is a practical workflow prototype I built for overseas social media operations and KOL marketing roles, designed for learning, execution, and portfolio presentation.",
  },
  languageLabel: {
    zh: "语言切换",
    en: "Language",
  },
  creatorCrmTitle: {
    zh: "Creator CRM",
    en: "Creator CRM",
  },
  creatorCrmDescription: {
    zh: "管理达人从搜索到复盘的完整闭环：Finder → Auditor → Outreach → Collaboration → Sample → Content → Performance。",
    en: "Manage the full creator lifecycle from sourcing to review: Finder → Auditor → Outreach → Collaboration → Sample → Content → Performance.",
  },
  contentHubTitle: {
    zh: "Content Hub",
    en: "Content Hub",
  },
  contentHubDescription: {
    zh: "用于管理内容素材、竞品内容、内容日历和脚本模板，支持实战内容生产。",
    en: "Manage content materials, competitor references, calendars, and script templates for practical content production.",
  },
  ecommerceTitle: {
    zh: "E-commerce Tracking",
    en: "E-commerce Tracking",
  },
  ecommerceDescription: {
    zh: "用于追踪达人营销转化，不做完整独立站后台，只聚焦 KOL 转化链路。",
    en: "Track creator-driven e-commerce conversion. This is not a full store backend, but a focused KOL conversion tracker.",
  },
  sectionLabel: {
    zh: "当前模块",
    en: "Current Module",
  },
  addRowButton: {
    zh: "新增一行 / Add Row",
    en: "Add Row / 新增一行",
  },
  flowButton: {
    zh: "流转到下一环节 / Move to Next Stage",
    en: "Move to Next Stage / 流转到下一环节",
  },
  stageTitles: {
    finder: { zh: "1. 达人搜索与录入", en: "1. Creator Finder" },
    auditor: { zh: "2. 达人审核评估", en: "2. Creator Auditor" },
    outreach: { zh: "3. 建联管理", en: "3. Outreach Center" },
    collaboration: { zh: "4. 合作方案管理", en: "4. Collaboration Manager" },
    sample: { zh: "5. 寄样追踪", en: "5. Sample Tracker" },
    content: { zh: "6. 内容上线跟进", en: "6. Content Tracker" },
    performance: { zh: "7. 数据复盘", en: "7. Performance Review" },
  },
  stageDescriptions: {
    finder: {
      zh: "搜索并录入达人基础资料，作为 CRM 主档案。",
      en: "Search and register creator profiles as the CRM source of truth.",
    },
    auditor: {
      zh: "评估达人内容匹配度、互动质量和商业安全性。",
      en: "Audit creator fit, engagement quality, and commercial safety.",
    },
    outreach: {
      zh: "统一管理建联节奏、模板和跟进状态。",
      en: "Manage outreach cadence, templates, and follow-up status in one place.",
    },
    collaboration: {
      zh: "确定合作模式、报价、佣金与交付要求。",
      en: "Define collaboration model, fees, commission, and deliverables.",
    },
    sample: {
      zh: "跟踪寄样信息与物流状态，降低执行遗漏。",
      en: "Track sample shipment details and logistics status to avoid execution gaps.",
    },
    content: {
      zh: "跟进脚本方向、发布时间、链接与标记检查。",
      en: "Track brief, script direction, publish dates, links, and quality checks.",
    },
    performance: {
      zh: "复盘每位达人的转化结果，支持复用决策。",
      en: "Review creator performance and support reuse decisions.",
    },
  },
};

export const stageOrder: CreatorStageKey[] = [
  "finder",
  "auditor",
  "outreach",
  "collaboration",
  "sample",
  "content",
  "performance",
];

export const localeLabel: Record<Locale, string> = {
  zh: "中文",
  en: "English",
};
