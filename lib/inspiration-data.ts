export type ModuleSlug = "handmade" | "character-ip" | "vintage-furniture";
export type ModuleSectionSlug =
  | "trends"
  | "tags"
  | "gallery"
  | "favorites"
  | "sources-notes"
  | "brainstorm";

export type InspirationModule = {
  slug: ModuleSlug;
  name: string;
  shortName: string;
  description: string;
  color: string;
  shadow: string;
  tags: string[];
};

export type TrendItem = {
  id: string;
  module: ModuleSlug;
  rank: number;
  keyword: string;
  reason: string;
  tags: string[];
};

export type InspirationImage = {
  id: string;
  module: ModuleSlug;
  title: string;
  imageUrl: string;
  sourceUrl: string;
  notes: string;
  tags: string[];
  isFavorite: boolean;
  colors: [string, string, string];
};

export type ProductIdea = {
  id: string;
  module: ModuleSlug;
  name: string;
  inspirationSource: string;
  description: string;
  materials: string;
  process: string;
  market: string;
  productFormats: string;
  difficulty: string;
  extensions: string;
  scenarios: string;
};

export type ModuleSection = {
  slug: ModuleSectionSlug;
  title: string;
  description: string;
  ctaLabel: string;
};

export const modules: InspirationModule[] = [
  {
    slug: "handmade",
    name: "Handmade Craft 手工素材",
    shortName: "手工素材",
    description: "纸艺、黏土、珍珠贝壳、复合材料、油画肌理、布料、金属、树脂等。",
    color: "#bd3f31",
    shadow: "#17324d",
    tags: ["贝壳", "珍珠", "树脂", "纸艺", "黏土", "油画肌理", "布料", "复合材料"],
  },
  {
    slug: "character-ip",
    name: "Illustration / Character IP 插画人物 IP",
    shortName: "插画人物 IP",
    description: "角色设定、表情、动作、服装、世界观、盲盒、贴纸、周边延展。",
    color: "#1f5b8f",
    shadow: "#bd3f31",
    tags: ["角色设定", "小狗 IP", "表情包", "服装", "世界观", "盲盒", "节日周边"],
  },
  {
    slug: "vintage-furniture",
    name: "Vintage Small Furniture 复古小家具",
    shortName: "复古小家具",
    description: "摆件、时钟、复古灯、小镜子、小雕塑、托盘、烛台与桌面陈列。",
    color: "#5f704c",
    shadow: "#bd3f31",
    tags: ["复古灯", "小镜子", "时钟", "雕塑", "摆件", "黄铜", "陶瓷", "桌面陈列"],
  },
];

export const moduleSections: ModuleSection[] = [
  {
    slug: "trends",
    title: "今日趋势 Top 10",
    description: "查看这个模块今日最值得关注的关键词、趋势理由和相关标签。",
    ctaLabel: "查看趋势",
  },
  {
    slug: "tags",
    title: "热门标签",
    description: "整理这个模块常用标签，后续用于搜索、筛选和 AI 输入。",
    ctaLabel: "管理标签",
  },
  {
    slug: "gallery",
    title: "灵感图片库",
    description: "集中查看这个模块下保存的图片链接、视觉占位和素材卡片。",
    ctaLabel: "打开图库",
  },
  {
    slug: "favorites",
    title: "我的收藏",
    description: "只看这个模块里已经收藏的图片和后续收藏的产品创意。",
    ctaLabel: "查看收藏",
  },
  {
    slug: "sources-notes",
    title: "来源与备注",
    description: "按图片查看来源链接、个人备注、可借鉴点和后续行动。",
    ctaLabel: "查看备注",
  },
  {
    slug: "brainstorm",
    title: "AI 头脑风暴",
    description: "把模块趋势、标签、图片描述和材料组合成可执行产品创意。",
    ctaLabel: "生成创意",
  },
];

export function getModuleSection(slug: string) {
  return moduleSections.find((section) => section.slug === slug);
}

export const trends: TrendItem[] = [
  {
    id: "t-handmade-01",
    module: "handmade",
    rank: 1,
    keyword: "透明小房子挂件",
    reason: "适合结合微缩玩具、首饰和节日礼品，容易扩展成系列。",
    tags: ["树脂", "微缩", "挂件"],
  },
  {
    id: "t-handmade-02",
    module: "handmade",
    rank: 2,
    keyword: "牡蛎牌神话浮雕",
    reason: "天然贝壳形态自带收藏感，适合做项链、手牌和礼盒。",
    tags: ["贝壳", "珍珠", "神话人物"],
  },
  {
    id: "t-handmade-03",
    module: "handmade",
    rank: 3,
    keyword: "油画肌理小托盘",
    reason: "油画肌理能把普通收纳托盘变成桌面装饰品。",
    tags: ["油画肌理", "托盘", "家居"],
  },
  {
    id: "t-handmade-04",
    module: "handmade",
    rank: 4,
    keyword: "布料花朵胸针",
    reason: "材料轻、成本可控，适合小批量手作上新。",
    tags: ["布料", "花朵", "配饰"],
  },
  {
    id: "t-handmade-05",
    module: "handmade",
    rank: 5,
    keyword: "珍珠金属边框相框",
    reason: "复古金属和珍珠结合，适合婚礼、礼品和家居陈列。",
    tags: ["珍珠", "金属", "相框"],
  },
  {
    id: "t-handmade-06",
    module: "handmade",
    rank: 6,
    keyword: "纸艺立体花束",
    reason: "适合做教程、礼盒和节日限定款。",
    tags: ["纸艺", "花束", "礼盒"],
  },
  {
    id: "t-handmade-07",
    module: "handmade",
    rank: 7,
    keyword: "黏土小动物摆件",
    reason: "和 IP 化角色很容易结合，适合做盲盒或桌面小物。",
    tags: ["黏土", "小动物", "摆件"],
  },
  {
    id: "t-handmade-08",
    module: "handmade",
    rank: 8,
    keyword: "树脂海洋标本",
    reason: "透明质感和贝壳、砂砾、珍珠天然适配。",
    tags: ["树脂", "海洋", "标本"],
  },
  {
    id: "t-handmade-09",
    module: "handmade",
    rank: 9,
    keyword: "复合材料首饰盘",
    reason: "可把贝壳、布料、金属片和涂料组合成低成本系列。",
    tags: ["复合材料", "首饰盘"],
  },
  {
    id: "t-handmade-10",
    module: "handmade",
    rank: 10,
    keyword: "手作材料样本卡",
    reason: "把材料本身变成视觉资料和销售辅助物。",
    tags: ["材料库", "样本卡"],
  },
  {
    id: "t-character-01",
    module: "character-ip",
    rank: 1,
    keyword: "小狗 IP 世界观",
    reason: "容易形成角色关系、场景故事和周边矩阵。",
    tags: ["小狗 IP", "世界观", "角色设定"],
  },
  {
    id: "t-character-02",
    module: "character-ip",
    rank: 2,
    keyword: "神话少女半身像",
    reason: "适合和贝壳、月亮、海洋材料结合成艺术周边。",
    tags: ["神话人物", "半身像", "海洋"],
  },
  {
    id: "t-character-03",
    module: "character-ip",
    rank: 3,
    keyword: "复古玩具感角色",
    reason: "更适合做挂件、盲盒、贴纸和家居小摆件。",
    tags: ["复古玩具", "盲盒", "周边"],
  },
  {
    id: "t-character-04",
    module: "character-ip",
    rank: 4,
    keyword: "表情动作九宫格",
    reason: "可以快速测试角色辨识度和表情延展。",
    tags: ["表情包", "动作", "设定稿"],
  },
  {
    id: "t-character-05",
    module: "character-ip",
    rank: 5,
    keyword: "节日限定服装",
    reason: "适合圣诞、情人节、春日花园等短周期上新。",
    tags: ["服装", "节日", "限定款"],
  },
  {
    id: "t-character-06",
    module: "character-ip",
    rank: 6,
    keyword: "角色房间设定",
    reason: "可延展成插画、立体场景、贴纸和桌面摆件。",
    tags: ["房间", "场景", "世界观"],
  },
  {
    id: "t-character-07",
    module: "character-ip",
    rank: 7,
    keyword: "宠物伙伴设定",
    reason: "让主角色更有故事和系列化空间。",
    tags: ["宠物", "伙伴", "故事"],
  },
  {
    id: "t-character-08",
    module: "character-ip",
    rank: 8,
    keyword: "复古杂志封面角色",
    reason: "适合海报、装饰画和社交内容封面。",
    tags: ["杂志感", "海报", "装饰画"],
  },
  {
    id: "t-character-09",
    module: "character-ip",
    rank: 9,
    keyword: "小尺寸挂件角色",
    reason: "打样成本低，适合快速测试市场反馈。",
    tags: ["挂件", "小尺寸", "测试款"],
  },
  {
    id: "t-character-10",
    module: "character-ip",
    rank: 10,
    keyword: "角色符号系统",
    reason: "把角色元素拆成图案、徽章、吊牌和包装语言。",
    tags: ["符号", "包装", "图案"],
  },
  {
    id: "t-vintage-01",
    module: "vintage-furniture",
    rank: 1,
    keyword: "黄铜小台灯",
    reason: "复古氛围强，适合桌面、床头和拍摄布景。",
    tags: ["复古灯", "黄铜", "桌面"],
  },
  {
    id: "t-vintage-02",
    module: "vintage-furniture",
    rank: 2,
    keyword: "贝壳边框小镜子",
    reason: "和手工材料模块有交叉，可做家居小物与礼品。",
    tags: ["小镜子", "贝壳", "家居"],
  },
  {
    id: "t-vintage-03",
    module: "vintage-furniture",
    rank: 3,
    keyword: "陶瓷蘑菇钟",
    reason: "造型记忆点强，适合复古童话风系列。",
    tags: ["时钟", "陶瓷", "童话"],
  },
  {
    id: "t-vintage-04",
    module: "vintage-furniture",
    rank: 4,
    keyword: "迷你雕塑书挡",
    reason: "有实用功能，也能做艺术陈列。",
    tags: ["雕塑", "书挡", "桌面陈列"],
  },
  {
    id: "t-vintage-05",
    module: "vintage-furniture",
    rank: 5,
    keyword: "复古花边托盘",
    reason: "可承载首饰、香薰、摆件和拍摄道具。",
    tags: ["托盘", "花边", "收纳"],
  },
  {
    id: "t-vintage-06",
    module: "vintage-furniture",
    rank: 6,
    keyword: " stained glass 小夜灯",
    reason: "彩色玻璃能形成强烈氛围，适合卧室与礼品市场。",
    tags: ["小夜灯", "彩色玻璃"],
  },
  {
    id: "t-vintage-07",
    module: "vintage-furniture",
    rank: 7,
    keyword: "小鸟黄铜挂钩",
    reason: "小体积、低门槛，可做玄关和衣柜配件。",
    tags: ["黄铜", "挂钩", "动物"],
  },
  {
    id: "t-vintage-08",
    module: "vintage-furniture",
    rank: 8,
    keyword: "古董感相框摆台",
    reason: "适合和插画作品、IP 海报一起出售。",
    tags: ["相框", "摆台", "装饰画"],
  },
  {
    id: "t-vintage-09",
    module: "vintage-furniture",
    rank: 9,
    keyword: "小雕像香薰座",
    reason: "功能和装饰结合，适合做礼盒系列。",
    tags: ["香薰", "雕塑", "礼盒"],
  },
  {
    id: "t-vintage-10",
    module: "vintage-furniture",
    rank: 10,
    keyword: "复古抽屉把手",
    reason: "可以作为家具翻新配件，也能做小批量材料包。",
    tags: ["把手", "家具翻新", "配件"],
  },
];

export const inspirationImages: InspirationImage[] = [
  {
    id: "img-001",
    module: "handmade",
    title: "透明小房子挂件",
    imageUrl: "待保存图片链接",
    sourceUrl: "待粘贴来源链接",
    notes: "内部可以放微缩玩具、珍珠或小动物摆件，外部用复古金属边框。",
    tags: ["树脂", "微缩", "复古风"],
    isFavorite: true,
    colors: ["#2f5f5b", "#f2e8d7", "#bd3f31"],
  },
  {
    id: "img-002",
    module: "handmade",
    title: "牡蛎牌神话半身像",
    imageUrl: "待保存图片链接",
    sourceUrl: "待粘贴来源链接",
    notes: "保留贝壳自然形态，浮雕可做阿芙罗狄忒、月亮女神、海洋女神。",
    tags: ["贝壳", "珍珠", "神话人物"],
    isFavorite: true,
    colors: ["#edf0df", "#b38a52", "#17324d"],
  },
  {
    id: "img-003",
    module: "character-ip",
    title: "小狗 IP 表情动作",
    imageUrl: "待保存图片链接",
    sourceUrl: "待粘贴来源链接",
    notes: "九宫格测试喜怒哀乐、跳跃、抱礼物和睡觉姿态。",
    tags: ["小狗 IP", "表情", "动作"],
    isFavorite: true,
    colors: ["#1f5b8f", "#f8efdc", "#bd3f31"],
  },
  {
    id: "img-004",
    module: "character-ip",
    title: "复古玩具感少女角色",
    imageUrl: "待保存图片链接",
    sourceUrl: "待粘贴来源链接",
    notes: "适合做盲盒、贴纸、立牌和小尺寸挂件。",
    tags: ["复古玩具", "角色设定", "周边"],
    isFavorite: false,
    colors: ["#bd3f31", "#e5d6bd", "#1f5b8f"],
  },
  {
    id: "img-005",
    module: "vintage-furniture",
    title: "黄铜小台灯",
    imageUrl: "待保存图片链接",
    sourceUrl: "待粘贴来源链接",
    notes: "灯罩可以改成贝壳、布料褶皱或彩色玻璃质感。",
    tags: ["复古灯", "黄铜", "桌面"],
    isFavorite: true,
    colors: ["#17324d", "#c09758", "#5f704c"],
  },
  {
    id: "img-006",
    module: "vintage-furniture",
    title: "贝壳边框小镜子",
    imageUrl: "待保存图片链接",
    sourceUrl: "待粘贴来源链接",
    notes: "可以结合海洋女神、珍珠、黄铜脚架做系列。",
    tags: ["小镜子", "贝壳", "家居"],
    isFavorite: false,
    colors: ["#eef2e6", "#6d8a7c", "#bd3f31"],
  },
];

export const productIdeas: ProductIdea[] = [
  {
    id: "idea-001",
    module: "handmade",
    name: "透明守护小屋挂件",
    inspirationSource: "房子挂件、微缩玩具、复古风",
    description: "透明树脂小房子内置一只微缩玩具、首饰或小动物摆件，外部加复古金属边框和小吊环。",
    materials: "透明树脂、黄铜边框、微缩玩具、珍珠、小贝壳、丝带。",
    process: "树脂灌注成型，金属边框包边，内部微缩物固定，最后加吊环和包装卡。",
    market: "圣诞礼品、家居挂饰、IP 周边、手作礼盒。",
    productFormats: "挂件、钥匙扣、圣诞树装饰、车载挂饰、桌面小摆件。",
    difficulty: "中等，需要解决气泡、透明度和内部固定。",
    extensions: "小狗的家、海边小屋、月亮温室、珍珠收藏室。",
    scenarios: "挂在圣诞树、书桌灯架、礼盒外包装或包包上。",
  },
  {
    id: "idea-002",
    module: "handmade",
    name: "牡蛎女神收藏牌",
    inspirationSource: "牡蛎牌、神话人物、珍珠质感",
    description: "在牡蛎牌上雕刻或绘制阿芙罗狄忒、月亮女神、海洋女神半身像，保留贝壳自然边缘。",
    materials: "牡蛎壳、珍珠粉涂料、轻黏土、金色描边漆、透明保护胶。",
    process: "贝壳清洁打磨，轻黏土塑形半身像，手绘细节，珍珠粉上光，背面加挂件或支架。",
    market: "艺术首饰、收藏礼盒、海洋风家居、神话主题 IP 周边。",
    productFormats: "项链、手牌、摆件、礼盒收藏牌、装饰画局部组件。",
    difficulty: "中高，重点在贝壳处理和人物浮雕精度。",
    extensions: "月亮女神、海洋女神、花园女神、星座守护神。",
    scenarios: "作为首饰佩戴、放入礼盒、摆在梳妆台或用于品牌拍摄。",
  },
  {
    id: "idea-003",
    module: "vintage-furniture",
    name: "贝壳边框复古小镜",
    inspirationSource: "小镜子、贝壳、黄铜脚架",
    description: "一面桌面小镜子，边框由贝壳纹理和黄铜线条组成，背后加入可折叠支架。",
    materials: "小镜片、黄铜线、树脂贝壳片、珍珠点缀、复古绿背板。",
    process: "镜片裁切，边框树脂片成型，黄铜线包边，背板安装支架。",
    market: "家居装饰、梳妆台摆件、礼品店、复古风摄影道具。",
    productFormats: "小镜子、挂墙镜、首饰盘套装、桌面陈列组合。",
    difficulty: "中等，需控制镜片安全和边框牢固度。",
    extensions: "海洋款、花园款、星月款、宠物头像款。",
    scenarios: "梳妆台、玄关、拍摄布景、礼盒套装。",
  },
];

export const dataSourcePlan = [
  {
    name: "Manual 手动录入",
    status: "第一版",
    use: "手动输入关键词、保存图片链接、填写来源、备注和标签。",
  },
  {
    name: "Pinterest API",
    status: "预留",
    use: "未来按关键词查询 pin、board、图片与来源链接。",
  },
  {
    name: "Instagram Graph API",
    status: "预留",
    use: "未来读取授权账号可访问的标签、媒体和互动数据。",
  },
  {
    name: "Apify",
    status: "预留",
    use: "未来用 Actor 获取公开网页、社媒趋势或图片搜索结果。",
  },
  {
    name: "AgentReach MCP",
    status: "预留",
    use: "未来作为本地 agent 搜索和读取公开网页的统一入口。",
  },
  {
    name: "GitHub scraper / gallery 项目",
    status: "预留",
    use: "未来接入合适的开源 scraper、moodboard 或 image gallery 逻辑。",
  },
];

export function getModule(slug: string) {
  return modules.find((module) => module.slug === slug);
}

export function getModuleTrends(slug: ModuleSlug) {
  return trends.filter((trend) => trend.module === slug).sort((a, b) => a.rank - b.rank);
}

export function getModuleImages(slug: ModuleSlug) {
  return inspirationImages.filter((image) => image.module === slug);
}

export function getAllTags() {
  return Array.from(
    new Set([
      ...modules.flatMap((module) => module.tags),
      ...trends.flatMap((trend) => trend.tags),
      ...inspirationImages.flatMap((image) => image.tags),
    ]),
  );
}
