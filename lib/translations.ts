import type {
  CampaignStatus,
  CollaborationType,
  CreatorStageKey,
  CreatorStatus,
  Locale,
} from "@/lib/os-types";

export type BilingualText = {
  zh: string;
  en: string;
};

export const localeLabel: Record<Locale, string> = {
  zh: "中文",
  en: "EN",
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

const creatorStageTitles: Record<CreatorStageKey, BilingualText> = {
  finder: { zh: "Creator Finder", en: "Creator Finder" },
  auditor: { zh: "Creator Auditor", en: "Creator Auditor" },
  outreach: { zh: "Outreach Center", en: "Outreach Center" },
  collaboration: { zh: "Collaboration Manager", en: "Collaboration Manager" },
  sample: { zh: "Sample Tracker", en: "Sample Tracker" },
  content: { zh: "Content Tracker", en: "Content Tracker" },
  performance: { zh: "Performance Review", en: "Performance Review" },
};

const creatorStageDescriptions: Record<CreatorStageKey, BilingualText> = {
  finder: {
    zh: "搜索、收集并筛选符合市场方向的达人线索。",
    en: "Find and collect creator leads that fit your target market.",
  },
  auditor: {
    zh: "在建联前快速审核创作者内容、受众和品牌安全。",
    en: "Audit creator fit, audience quality, and brand safety before outreach.",
  },
  outreach: {
    zh: "记录首联、跟进节奏和合作意向。",
    en: "Track first contact, follow-up cadence, and collaboration intent.",
  },
  collaboration: {
    zh: "管理合作类型、费用、交付和确认状态。",
    en: "Manage collaboration model, fee, deliverables, and agreement status.",
  },
  sample: {
    zh: "跟踪寄样、物流和签收状态。",
    en: "Track sample shipping, logistics, and delivery status.",
  },
  content: {
    zh: "记录内容 brief、脚本、发布时间和链接检查。",
    en: "Track brief, script direction, publish date, and link checks.",
  },
  performance: {
    zh: "复盘播放、互动、点击、订单和 ROI。",
    en: "Review views, engagement, clicks, orders, and ROI.",
  },
};

export const copy = {
  appName: {
    zh: "Overseas Social Media OS",
    en: "Overseas Social Media OS",
  },
  appIntro: {
    zh: "一个用于达人搜索、审核、建联、寄样、内容跟进和复盘的海外社媒工作台。",
    en: "A workflow system for creator sourcing, auditing, outreach, sampling, content tracking, and performance review.",
  },
  aboutTitle: {
    zh: "关于这个项目",
    en: "About This Project",
  },
  pageDescription: {
    dashboard: {
      zh: "用于总览今日任务、核心模块入口和关键运营数据。",
      en: "A clean overview of today’s work, core modules, and key operating metrics.",
    },
    creatorFinder: {
      zh: "按平台、市场、细分领域和关键词搜索潜在达人。",
      en: "Search potential creators by platform, market, niche, and keywords.",
    },
    creatorAuditor: {
      zh: "在建联前审核达人是否适合合作。",
      en: "Audit whether a creator is a fit before outreach or collaboration.",
    },
    creatorCrm: {
      zh: "保存、分组、跟进和管理已确认达人。",
      en: "Save, segment, and follow up with creators you are actively managing.",
    },
    outreach: {
      zh: "记录邮件、私信、回复和跟进动作。",
      en: "Track emails, DMs, replies, and follow-up actions.",
    },
    campaigns: {
      zh: "管理合作 Campaign 的创建、进度和结果。",
      en: "Manage campaign setup, progress, and outcomes.",
    },
    contentHub: {
      zh: "整理内容素材、竞品拆解、内容日历和脚本模板。",
      en: "Organize content materials, competitor insights, calendars, and scripts.",
    },
    samples: {
      zh: "跟踪寄样订单、物流和签收。",
      en: "Track sample orders, shipping, and delivery.",
    },
    performance: {
      zh: "复盘单个合作的数据表现与 ROI。",
      en: "Review the performance and ROI of individual collaborations.",
    },
    sopLibrary: {
      zh: "整理可重复执行的海外社媒 SOP。",
      en: "Store repeatable SOPs for overseas social media workflows.",
    },
    ecommerce: {
      zh: "跟踪达人带来的点击、订单和转化。",
      en: "Track creator-driven clicks, orders, and conversions.",
    },
  },
  nav: {
    dashboard: { zh: "Dashboard", en: "Dashboard" },
    creatorFinder: { zh: "Creator Finder", en: "Creator Finder" },
    creatorAuditor: { zh: "Creator Auditor", en: "Creator Auditor" },
    creatorCrm: { zh: "Creator CRM", en: "Creator CRM" },
    creatorDatabase: { zh: "Creator Database", en: "Creator Database" },
    outreach: { zh: "Outreach", en: "Outreach" },
    campaigns: { zh: "Campaigns", en: "Campaigns" },
    contentHub: { zh: "Content Hub", en: "Content Hub" },
    samples: { zh: "Samples", en: "Samples" },
    performance: { zh: "Performance", en: "Performance" },
    sopLibrary: { zh: "SOP Library", en: "SOP Library" },
    settings: { zh: "Settings", en: "Settings" },
  },
  actions: {
    addCreator: { zh: "添加达人", en: "Add Creator" },
    addCreatorManually: { zh: "手动添加达人", en: "Add Creator Manually" },
    pasteProfileLink: { zh: "粘贴主页链接", en: "Paste Profile Link" },
    importFromFinder: { zh: "从 Finder 导入", en: "Import from Finder" },
    runAuditor: { zh: "运行审核", en: "Run Creator Auditor" },
    searchCreators: { zh: "搜索达人", en: "Search Creators" },
    search: { zh: "搜索", en: "Search" },
    newCampaign: { zh: "新建 Campaign", en: "New Campaign" },
    addTask: { zh: "添加任务", en: "Add Task" },
    addOutreachNote: { zh: "添加跟进记录", en: "Add Outreach Note" },
    export: { zh: "导出", en: "Export" },
    exportCsv: { zh: "导出 CSV", en: "Export CSV" },
    importCsv: { zh: "导入 CSV", en: "Import CSV" },
    filter: { zh: "筛选", en: "Filter" },
    deleteSelected: { zh: "删除已选", en: "Delete Selected" },
    save: { zh: "保存", en: "Save" },
    saveToCrm: { zh: "保存到 CRM", en: "Save to CRM" },
    saveToDatabase: { zh: "保存到数据库", en: "Save to Database" },
    create: { zh: "创建", en: "Create" },
    viewDetails: { zh: "查看详情", en: "View Details" },
    moveNext: { zh: "进入下一阶段", en: "Move to Next Stage" },
    addRow: { zh: "新增记录", en: "Add Row" },
    edit: { zh: "编辑", en: "Edit" },
    delete: { zh: "删除", en: "Delete" },
    view: { zh: "查看", en: "View" },
    back: { zh: "返回", en: "Back" },
    clear: { zh: "清空", en: "Clear" },
    analyzeCreator: { zh: "分析达人", en: "Analyze Creator" },
    saveDraft: { zh: "保存草稿", en: "Save Draft" },
    newContent: { zh: "新建内容", en: "New Content" },
    addCampaign: { zh: "添加 Campaign", en: "Add Campaign" },
  },
  common: {
    language: { zh: "语言", en: "Language" },
    search: { zh: "搜索", en: "Search" },
    all: { zh: "全部", en: "All" },
    noResult: { zh: "暂无匹配结果", en: "No matching records yet." },
    noDataTitle: { zh: "还没有数据。", en: "No data yet." },
    noDataDescription: {
      zh: "先手动添加，或者粘贴社媒主页链接开始审核。",
      en: "Add a record manually or paste a social profile link to get started.",
    },
    languageHint: { zh: "当前仅显示一种语言。", en: "Only one language is shown at a time." },
    status: { zh: "状态", en: "Status" },
    recommendation: { zh: "推荐", en: "Recommendation" },
    notes: { zh: "备注", en: "Notes" },
    lastContact: { zh: "最后联系", en: "Last Contact" },
    nextStep: { zh: "下一步", en: "Next Step" },
  },
  dashboard: {
    sections: {
      todayFocus: { zh: "今日重点", en: "Today’s Focus" },
      metrics: { zh: "关键指标", en: "Key Metrics" },
      creatorPipeline: { zh: "Creator Pipeline", en: "Creator Pipeline" },
      campaignProgress: { zh: "Campaign Progress", en: "Campaign Progress" },
      contentCalendar: { zh: "Content Calendar", en: "Content Calendar" },
      performanceSnapshot: { zh: "Performance Snapshot", en: "Performance Snapshot" },
    workModules: { zh: "工作模块", en: "Work Modules" },
      creatorDatabase: { zh: "Creator Database", en: "Creator Database" },
    },
    metrics: {
      creators: { zh: "Pipeline 中的达人", en: "Creators in Pipeline" },
      awaitingReply: { zh: "待回复", en: "Awaiting Reply" },
      sampleSent: { zh: "已寄样", en: "Samples Sent" },
      postsLive: { zh: "已上线内容", en: "Posts Live" },
    },
    labels: {
      views: { zh: "播放量", en: "Views" },
      orders: { zh: "订单", en: "Orders" },
      roi: { zh: "ROI", en: "ROI" },
      avgRoi: { zh: "平均 ROI", en: "Average ROI" },
      updated: { zh: "最近更新", en: "Last Updated" },
      live: { zh: "Live", en: "Live" },
      clicks: { zh: "点击", en: "Clicks" },
      revenue: { zh: "销售额", en: "Revenue" },
      engagementRate: { zh: "互动率", en: "Engagement Rate" },
    },
    tasks: {
      followUp: { zh: "跟进已触达达人", en: "Follow up with contacted creators" },
      audit: { zh: "审核新搜集的达人", en: "Audit newly sourced creators" },
      sample: { zh: "检查寄样物流状态", en: "Check sample shipping status" },
      publish: { zh: "确认今日上线内容", en: "Confirm today’s scheduled posts" },
      report: { zh: "更新日报与复盘笔记", en: "Update the daily report and review notes" },
    },
    priority: {
      high: { zh: "高优先级", en: "High" },
      medium: { zh: "中优先级", en: "Medium" },
      low: { zh: "低优先级", en: "Low" },
    },
    status: {
      pending: { zh: "待处理", en: "Pending" },
      ongoing: { zh: "进行中", en: "In Progress" },
      done: { zh: "已完成", en: "Done" },
    },
  },
  creatorFinder: {
    title: { zh: "Creator Finder", en: "Creator Finder" },
    description: {
      zh: "按平台、市场、细分领域和关键词搜索潜在达人。",
      en: "Find potential creators by platform, niche, market, and collaboration fit.",
    },
    searchBriefTitle: { zh: "Search Brief", en: "Search Brief" },
    searchCriteriaTitle: { zh: "Search Criteria", en: "Search Criteria" },
    candidateResultsTitle: { zh: "Candidate Results", en: "Candidate Results" },
    emptyTitle: { zh: "还没有搜索结果。", en: "No search results yet." },
    emptyDescription: {
      zh: "填写目标市场、平台和关键词后点击搜索。",
      en: "Fill out the brief and click search to generate candidate drafts.",
    },
    fields: {
      platform: { zh: "平台", en: "Platform" },
      targetMarket: { zh: "目标市场", en: "Target Market" },
      niche: { zh: "细分领域", en: "Niche" },
      keywords: { zh: "关键词", en: "Keywords" },
      followerRange: { zh: "粉丝范围", en: "Follower Range" },
      engagementRequirement: { zh: "互动要求", en: "Engagement Requirement" },
      brandFitNotes: { zh: "品牌匹配备注", en: "Brand Fit Notes" },
      dataSource: { zh: "数据源", en: "Data Source" },
      resultStatus: { zh: "结果状态", en: "Result Status" },
    },
    messages: {
      loading: { zh: "正在搜索达人...", en: "Searching creators..." },
      noSource: {
        zh: "当前使用 Demo Data / CSV Data，请接入 Apify 或导入达人表后获得真实结果。",
        en: "No real external source connected yet. Showing demo or imported creators.",
      },
      noResults: {
        zh: "暂无匹配结果。",
        en: "No matching creators found.",
      },
    },
    resultStatus: {
      candidate: { zh: "Candidate", en: "Candidate" },
      needAudit: { zh: "Need Audit", en: "Need Audit" },
      rejected: { zh: "Rejected", en: "Rejected" },
      savedToCrm: { zh: "Saved to CRM", en: "Saved to CRM" },
    },
  },
  creatorAuditor: {
    title: { zh: "Creator Auditor", en: "Creator Auditor" },
    description: {
      zh: "在建联前审核达人是否适合合作。",
      en: "Audit a creator profile before outreach or collaboration.",
    },
    inputTitle: { zh: "Audit Input", en: "Audit Input" },
    outputTitle: { zh: "Audit Result", en: "Audit Result" },
    emptyTitle: { zh: "还没有审核结果。", en: "No audit result yet." },
    emptyDescription: {
      zh: "输入主页链接后点击 Run Audit。",
      en: "Paste a profile URL and click Run Audit to generate an audit draft.",
    },
    fields: {
      profileUrl: { zh: "主页链接", en: "Profile URL" },
      targetProduct: { zh: "目标产品", en: "Target Product" },
      targetMarket: { zh: "目标市场", en: "Target Market" },
      brandStyle: { zh: "品牌风格", en: "Brand Style" },
      redFlags: { zh: "风险点", en: "Red Flags" },
      brandFitNotes: { zh: "品牌匹配备注", en: "Brand Fit Notes" },
      fitScore: { zh: "匹配分数", en: "Fit Score" },
      audienceMatch: { zh: "受众匹配", en: "Audience Match" },
      contentStyleMatch: { zh: "内容风格匹配", en: "Content Style Match" },
      engagementQuality: { zh: "互动质量", en: "Engagement Quality" },
      brandSafety: { zh: "品牌安全", en: "Brand Safety" },
      collaborationPotential: { zh: "合作潜力", en: "Collaboration Potential" },
      recommendation: { zh: "建议", en: "Recommendation" },
    },
    messages: {
      loading: { zh: "正在运行审核...", en: "Running audit..." },
      basic: {
        zh: "缺少粉丝数、互动率、内容数据，当前为基础审核。",
        en: "Missing follower, engagement, or content data. Running a basic audit.",
      },
    },
    recommendation: {
      approve: { zh: "Approve", en: "Approve" },
      maybe: { zh: "Maybe", en: "Maybe" },
      reject: { zh: "Reject", en: "Reject" },
    },
  },
  creatorCrm: {
    title: { zh: "Creator CRM", en: "Creator CRM" },
    description: {
      zh: "保存、分组、跟进和管理已确认达人。",
      en: "Save, segment, and follow up with creators you are actively managing.",
    },
    emptyTitle: { zh: "还没有达人。", en: "No creators yet." },
    emptyDescription: {
      zh: "你可以手动添加达人，或粘贴社媒主页链接进行审核。",
      en: "Start by adding a creator manually or paste a social media profile link to audit.",
    },
    draftsTitle: { zh: "待审核草稿", en: "Drafts Awaiting Review" },
    draftsDescription: {
      zh: "这些条目还没有进入 CRM 列表，需要先保存。",
      en: "These records are not yet in the CRM list and still need to be saved.",
    },
    table: {
      creator: { zh: "达人", en: "Creator" },
      platform: { zh: "平台", en: "Platform" },
      country: { zh: "国家 / 地区", en: "Country / Region" },
      niche: { zh: "细分领域", en: "Niche" },
      followers: { zh: "粉丝数", en: "Followers" },
      status: { zh: "状态", en: "Status" },
      rate: { zh: "报价", en: "Rate" },
      nextStep: { zh: "下一步", en: "Next Step" },
      lastContact: { zh: "最后联系", en: "Last Contact" },
      actions: { zh: "操作", en: "Actions" },
    },
    form: {
      basicInfo: { zh: "基础信息", en: "Basic Info" },
      platformInfo: { zh: "平台信息", en: "Platform Info" },
      collaborationInfo: { zh: "合作信息", en: "Collaboration Info" },
      outreachNotes: { zh: "跟进备注", en: "Outreach Notes" },
      creatorName: { zh: "达人名称", en: "Creator Name" },
      platform: { zh: "Platform", en: "Platform" },
      profileUrl: { zh: "主页链接", en: "Profile URL" },
      country: { zh: "国家 / 地区", en: "Country / Region" },
      language: { zh: "语言", en: "Language" },
      niche: { zh: "细分领域", en: "Niche" },
      followers: { zh: "粉丝数", en: "Followers" },
      averageViews: { zh: "平均播放", en: "Average Views" },
      email: { zh: "邮箱", en: "Email" },
      whatsapp: { zh: "WhatsApp / 联系方式", en: "WhatsApp / Contact" },
      rate: { zh: "报价", en: "Rate" },
      notes: { zh: "备注", en: "Notes" },
      targetProduct: { zh: "目标产品", en: "Target Product" },
      collaborationType: { zh: "合作类型", en: "Collaboration Type" },
      currentStatus: { zh: "当前状态", en: "Current Status" },
      nextStep: { zh: "下一步", en: "Next Step" },
      followUpDate: { zh: "跟进日期", en: "Follow-up Date" },
      targetProductHint: { zh: "目标产品", en: "Target Product" },
    },
    actions: {
    addCreatorManually: { zh: "手动添加达人", en: "Add Creator Manually" },
    pasteProfileLink: { zh: "粘贴主页链接", en: "Paste Profile Link" },
    importFromFinder: { zh: "从 Creator Finder 导入", en: "Import from Creator Finder" },
    runAuditor: { zh: "运行审核", en: "Run Creator Auditor" },
    saveCreator: { zh: "保存达人", en: "Save Creator" },
      saveDraftToCrm: { zh: "保存到 CRM", en: "Save to CRM" },
      addOutreachNote: { zh: "添加跟进记录", en: "Add Outreach Note" },
      viewDetails: { zh: "查看详情", en: "View Details" },
      editCreator: { zh: "编辑达人", en: "Edit Creator" },
      deleteCreator: { zh: "删除", en: "Delete" },
      runAudit: { zh: "运行审核", en: "Run Audit" },
    },
    stageTitle: creatorStageTitles,
    stageDescription: creatorStageDescriptions,
    toolbar: {
      searchPlaceholder: {
        zh: "搜索达人、国家、细分领域或关键词",
        en: "Search by creator, country, niche, or keyword",
      },
      platform: { zh: "平台", en: "Platform" },
      status: { zh: "状态", en: "Status" },
      all: { zh: "全部", en: "All" },
    },
  },
  outreach: {
    title: { zh: "Outreach", en: "Outreach" },
    description: {
      zh: "记录邮件、私信、回复和跟进动作。",
      en: "Track emails, DMs, replies, and follow-up actions.",
    },
    emptyTitle: { zh: "还没有建联记录。", en: "No outreach records yet." },
    emptyDescription: {
      zh: "先从 CRM 里选择一个达人，再记录首联和跟进。",
      en: "Pick a creator from CRM to log first contact and follow-ups.",
    },
    fields: {
      contactChannel: { zh: "Contact Channel", en: "Contact Channel" },
      firstContactDate: { zh: "First Contact Date", en: "First Contact Date" },
      messageTemplate: { zh: "Message Template", en: "Message Template" },
      followUp1Date: { zh: "Follow-up 1 Date", en: "Follow-up 1 Date" },
      followUp2Date: { zh: "Follow-up 2 Date", en: "Follow-up 2 Date" },
      replyStatus: { zh: "Reply Status", en: "Reply Status" },
      collaborationInterest: { zh: "Collaboration Interest", en: "Collaboration Interest" },
      notes: { zh: "Notes", en: "Notes" },
    },
  },
  campaigns: {
    title: { zh: "Campaigns", en: "Campaigns" },
    description: {
      zh: "管理合作 Campaign 的创建、进度和结果。",
      en: "Manage campaign setup, progress, and outcomes.",
    },
    emptyTitle: { zh: "还没有 Campaign。", en: "No campaigns yet." },
    emptyDescription: {
      zh: "点击 New Campaign 创建一个新的合作项目。",
      en: "Click New Campaign to start a new collaboration project.",
    },
    fields: {
      campaignName: { zh: "活动名称", en: "Campaign Name" },
      objective: { zh: "目标", en: "Objective" },
      targetMarket: { zh: "目标市场", en: "Target Market" },
      creatorName: { zh: "达人名称", en: "Creator Name" },
      platform: { zh: "平台", en: "Platform" },
      status: { zh: "状态", en: "Status" },
      startDate: { zh: "开始日期", en: "Start Date" },
      endDate: { zh: "结束日期", en: "End Date" },
      budget: { zh: "预算", en: "Budget" },
      trackingLink: { zh: "追踪链接", en: "Tracking Link" },
      discountCode: { zh: "折扣码", en: "Discount Code" },
      notes: { zh: "备注", en: "Notes" },
    },
    status: {
      Planned: { zh: "Planned", en: "Planned" },
      Active: { zh: "Active", en: "Active" },
      Paused: { zh: "Paused", en: "Paused" },
      Completed: { zh: "Completed", en: "Completed" },
    } as Record<CampaignStatus, BilingualText>,
  },
  contentHub: {
    title: { zh: "Content Hub", en: "Content Hub" },
    description: {
      zh: "整理内容素材、竞品拆解、内容日历和脚本模板。",
      en: "Organize content materials, competitor insights, calendars, and scripts.",
    },
    materialBoard: {
      title: { zh: "Topic Material Board", en: "Topic Material Board" },
      description: {
        zh: "记录热点话题、内容形式和可执行洞察。",
        en: "Capture trend topics, content formats, and actionable insights.",
      },
    },
    competitorBoard: {
      title: { zh: "Competitor Content Breakdown", en: "Competitor Content Breakdown" },
      description: {
        zh: "沉淀高表现 Hook、CTA 和表达方式。",
        en: "Archive winning hooks, CTA patterns, and messaging angles.",
      },
    },
    calendarBoard: {
      title: { zh: "Content Calendar", en: "Content Calendar" },
      description: {
        zh: "规划平台发布节奏、负责人和执行状态。",
        en: "Plan publishing cadence, owner assignment, and execution status.",
      },
    },
    scriptBoard: {
      title: { zh: "Script Template Library", en: "Script Template Library" },
      description: {
        zh: "沉淀可复用脚本结构，加快内容生产。",
        en: "Store reusable script structures to speed up production.",
      },
    },
    emptyTitle: { zh: "还没有内容素材。", en: "No content materials yet." },
    emptyDescription: {
      zh: "先添加一个 topic、竞品拆解或脚本模板。",
      en: "Add a topic idea, competitor reference, or script template to begin.",
    },
  },
  samples: {
    title: { zh: "Samples", en: "Samples" },
    description: {
      zh: "跟踪寄样订单、物流和签收。",
      en: "Track sample orders, shipping, and delivery.",
    },
    emptyTitle: { zh: "还没有寄样记录。", en: "No sample records yet." },
    emptyDescription: {
      zh: "先为某个达人创建寄样信息，再更新物流状态。",
      en: "Create a sample record for a creator and update shipping status.",
    },
    fields: {
      productName: { zh: "产品名称", en: "Product Name" },
      sku: { zh: "SKU", en: "SKU" },
      color: { zh: "颜色", en: "Color" },
      shippingAddress: { zh: "收货地址", en: "Shipping Address" },
      phone: { zh: "电话", en: "Phone" },
      country: { zh: "国家", en: "Country" },
      logisticsProvider: { zh: "物流公司", en: "Logistics Provider" },
      trackingNumber: { zh: "物流单号", en: "Tracking Number" },
      shippingStatus: { zh: "物流状态", en: "Shipping Status" },
      deliveredDate: { zh: "签收日期", en: "Delivered Date" },
    },
  },
  performance: {
    title: { zh: "Performance", en: "Performance" },
    description: {
      zh: "复盘单个合作的数据表现与 ROI。",
      en: "Review the performance and ROI of individual collaborations.",
    },
    emptyTitle: { zh: "还没有复盘数据。", en: "No performance data yet." },
    emptyDescription: {
      zh: "上线后把播放、点击、订单和 ROI 记录进来。",
      en: "Log views, clicks, orders, and ROI once the content goes live.",
    },
    fields: {
      views: { zh: "播放量", en: "Views" },
      likes: { zh: "点赞", en: "Likes" },
      comments: { zh: "评论", en: "Comments" },
      clicks: { zh: "点击", en: "Clicks" },
      orders: { zh: "订单", en: "Orders" },
      revenue: { zh: "销售额", en: "Revenue" },
      conversionRate: { zh: "转化率", en: "Conversion Rate" },
      roi: { zh: "ROI", en: "ROI" },
      finalResult: { zh: "最终结果", en: "Final Result" },
    },
    finalResult: {
      reuse: { zh: "Reuse", en: "Reuse" },
      observe: { zh: "Observe", en: "Observe" },
      stop: { zh: "Stop", en: "Stop" },
    },
  },
  ecommerce: {
    boardTitle: { zh: "E-commerce Tracking", en: "E-commerce Tracking" },
    boardDescription: {
      zh: "跟踪达人带来的点击、订单、转化和备注。",
      en: "Track creator-driven clicks, orders, conversions, and notes.",
    },
  },
  sopLibrary: {
    title: { zh: "SOP Library", en: "SOP Library" },
    description: {
      zh: "整理可重复执行的海外社媒 SOP。",
      en: "Store repeatable SOPs for overseas social media workflows.",
    },
    cards: {
      finder: {
        title: { zh: "Creator Finder SOP", en: "Creator Finder SOP" },
        description: {
          zh: "目标市场、平台、关键词与筛选逻辑。",
          en: "Market, platform, keyword, and filtering logic.",
        },
      },
      auditor: {
        title: { zh: "Creator Auditor SOP", en: "Creator Auditor SOP" },
        description: {
          zh: "审核标准、红旗项和合作建议。",
          en: "Audit criteria, red flags, and collaboration recommendation.",
        },
      },
      outreach: {
        title: { zh: "Outreach SOP", en: "Outreach SOP" },
        description: {
          zh: "首联、跟进和回复管理。",
          en: "First contact, follow-up, and reply management.",
        },
      },
      content: {
        title: { zh: "Content Tracking SOP", en: "Content Tracking SOP" },
        description: {
          zh: "脚本、上线和链接检查。",
          en: "Scripts, publishing, and link checks.",
        },
      },
      review: {
        title: { zh: "Performance Review SOP", en: "Performance Review SOP" },
        description: {
          zh: "数据复盘、结论和后续动作。",
          en: "Data review, conclusions, and next actions.",
        },
      },
    },
  },
  status: {
    new: { zh: "New", en: "New" },
    to_audit: { zh: "To Audit", en: "To Audit" },
    approved: { zh: "Approved", en: "Approved" },
    contacted: { zh: "Contacted", en: "Contacted" },
    replied: { zh: "Replied", en: "Replied" },
    sample_sent: { zh: "Sample Sent", en: "Sample Sent" },
    content_scheduled: { zh: "Content Scheduled", en: "Content Scheduled" },
    posted: { zh: "Posted", en: "Posted" },
    reviewed: { zh: "Reviewed", en: "Reviewed" },
  } as Record<CreatorStatus, BilingualText>,
  collaborationType: {
    Gifted: { zh: "Gifted", en: "Gifted" },
    Paid: { zh: "Paid", en: "Paid" },
    Affiliate: { zh: "Affiliate", en: "Affiliate" },
    Seeding: { zh: "Seeding", en: "Seeding" },
  } as Record<CollaborationType, BilingualText>,
  auditRecommendation: {
    approve: { zh: "Approve", en: "Approve" },
    maybe: { zh: "Maybe", en: "Maybe" },
    reject: { zh: "Reject", en: "Reject" },
  },
  stageTitle: creatorStageTitles,
  stageDescription: creatorStageDescriptions,
};

