export type BilingualText = { zh: string; en: string };

export type OptionItem<T extends string = string> = {
  value: T;
  label: BilingualText;
};

export const platformOptions: OptionItem[] = [
  { value: 'Instagram', label: { zh: 'Instagram', en: 'Instagram' } },
  { value: 'TikTok', label: { zh: 'TikTok', en: 'TikTok' } },
  { value: 'YouTube', label: { zh: 'YouTube', en: 'YouTube' } },
  { value: 'Facebook', label: { zh: 'Facebook', en: 'Facebook' } },
  { value: 'Pinterest', label: { zh: 'Pinterest', en: 'Pinterest' } },
  { value: 'Lemon8', label: { zh: 'Lemon8', en: 'Lemon8' } },
  { value: 'Xiaohongshu', label: { zh: '小红书', en: 'Xiaohongshu' } },
  { value: 'Blog / Website', label: { zh: '博客 / 网站', en: 'Blog / Website' } },
];

export const marketOptions: OptionItem[] = [
  { value: 'US', label: { zh: '美国', en: 'US' } },
  { value: 'UK', label: { zh: '英国', en: 'UK' } },
  { value: 'Canada', label: { zh: '加拿大', en: 'Canada' } },
  { value: 'Australia', label: { zh: '澳大利亚', en: 'Australia' } },
  { value: 'New Zealand', label: { zh: '新西兰', en: 'New Zealand' } },
  { value: 'UAE', label: { zh: '阿联酋', en: 'UAE' } },
  { value: 'Saudi Arabia', label: { zh: '沙特阿拉伯', en: 'Saudi Arabia' } },
  { value: 'Qatar', label: { zh: '卡塔尔', en: 'Qatar' } },
  { value: 'Kuwait', label: { zh: '科威特', en: 'Kuwait' } },
  { value: 'Bahrain', label: { zh: '巴林', en: 'Bahrain' } },
  { value: 'Oman', label: { zh: '阿曼', en: 'Oman' } },
  { value: 'Singapore', label: { zh: '新加坡', en: 'Singapore' } },
  { value: 'Malaysia', label: { zh: '马来西亚', en: 'Malaysia' } },
  { value: 'Philippines', label: { zh: '菲律宾', en: 'Philippines' } },
  { value: 'Thailand', label: { zh: '泰国', en: 'Thailand' } },
  { value: 'Indonesia', label: { zh: '印尼', en: 'Indonesia' } },
  { value: 'Vietnam', label: { zh: '越南', en: 'Vietnam' } },
  { value: 'Japan', label: { zh: '日本', en: 'Japan' } },
  { value: 'Korea', label: { zh: '韩国', en: 'Korea' } },
  { value: 'Germany', label: { zh: '德国', en: 'Germany' } },
  { value: 'France', label: { zh: '法国', en: 'France' } },
  { value: 'Italy', label: { zh: '意大利', en: 'Italy' } },
  { value: 'Spain', label: { zh: '西班牙', en: 'Spain' } },
  { value: 'Netherlands', label: { zh: '荷兰', en: 'Netherlands' } },
  { value: 'Sweden', label: { zh: '瑞典', en: 'Sweden' } },
  { value: 'Norway', label: { zh: '挪威', en: 'Norway' } },
  { value: 'Denmark', label: { zh: '丹麦', en: 'Denmark' } },
  { value: 'Global', label: { zh: '全球', en: 'Global' } },
];

export const nicheOptions: OptionItem[] = [
  { value: 'Home Decor', label: { zh: '家居装饰', en: 'Home Decor' } },
  { value: 'Interior Design', label: { zh: '室内设计', en: 'Interior Design' } },
  { value: 'Home Styling', label: { zh: '家居搭配', en: 'Home Styling' } },
  { value: 'Furniture', label: { zh: '家具', en: 'Furniture' } },
  { value: 'Small Apartment', label: { zh: '小户型', en: 'Small Apartment' } },
  { value: 'Room Makeover', label: { zh: '房间改造', en: 'Room Makeover' } },
  { value: 'Desk Setup', label: { zh: '桌面布置', en: 'Desk Setup' } },
  { value: 'Minimal Home', label: { zh: '极简家居', en: 'Minimal Home' } },
  { value: 'Quiet Luxury', label: { zh: '静奢风', en: 'Quiet Luxury' } },
  { value: 'Japandi', label: { zh: '侘寂日式', en: 'Japandi' } },
  { value: 'Vintage Home', label: { zh: '复古家居', en: 'Vintage Home' } },
  { value: 'Mid-century Modern', label: { zh: '中古现代', en: 'Mid-century Modern' } },
  { value: 'Scandinavian Home', label: { zh: '北欧风', en: 'Scandinavian Home' } },
  { value: 'DIY Home', label: { zh: 'DIY 家居', en: 'DIY Home' } },
  { value: 'Rental Friendly Decor', label: { zh: '租房友好装饰', en: 'Rental Friendly Decor' } },
  { value: 'Lifestyle', label: { zh: '生活方式', en: 'Lifestyle' } },
  { value: 'Beauty', label: { zh: '美妆', en: 'Beauty' } },
  { value: 'Fashion', label: { zh: '时尚', en: 'Fashion' } },
  { value: 'Mom / Family', label: { zh: '母婴 / 家庭', en: 'Mom / Family' } },
  { value: 'Tech', label: { zh: '科技', en: 'Tech' } },
  { value: 'Gadgets', label: { zh: '数码', en: 'Gadgets' } },
  { value: 'Gaming Setup', label: { zh: '游戏桌搭', en: 'Gaming Setup' } },
  { value: 'Productivity', label: { zh: '效率提升', en: 'Productivity' } },
  { value: 'Studygram', label: { zh: '学习博主', en: 'Studygram' } },
  { value: 'Art', label: { zh: '艺术', en: 'Art' } },
  { value: 'Handmade', label: { zh: '手作', en: 'Handmade' } },
  { value: 'Travel', label: { zh: '旅行', en: 'Travel' } },
  { value: 'Food', label: { zh: '美食', en: 'Food' } },
  { value: 'Wellness', label: { zh: '健康生活', en: 'Wellness' } },
  { value: 'Fitness', label: { zh: '健身', en: 'Fitness' } },
  { value: 'Pet', label: { zh: '宠物', en: 'Pet' } },
  { value: 'Luxury Lifestyle', label: { zh: '轻奢生活方式', en: 'Luxury Lifestyle' } },
];

export const followerRangeOptions: OptionItem[] = [
  { value: '1K-5K', label: { zh: '1K - 5K', en: '1K - 5K' } },
  { value: '5K-10K', label: { zh: '5K - 10K', en: '5K - 10K' } },
  { value: '10K-50K', label: { zh: '10K - 50K', en: '10K - 50K' } },
  { value: '50K-100K', label: { zh: '50K - 100K', en: '50K - 100K' } },
  { value: '100K-500K', label: { zh: '100K - 500K', en: '100K - 500K' } },
  { value: '500K-1M', label: { zh: '500K - 1M', en: '500K - 1M' } },
  { value: '1M+', label: { zh: '1M+', en: '1M+' } },
];

export const dataSourceOptions: OptionItem[] = [
  { value: 'auto', label: { zh: '自动 Auto', en: 'Auto' } },
  { value: 'apify', label: { zh: 'Apify', en: 'Apify' } },
  { value: 'youtube', label: { zh: 'YouTube API', en: 'YouTube API' } },
  { value: 'fastmoss', label: { zh: 'FastMoss CSV / API', en: 'FastMoss CSV / API' } },
  { value: 'importedCsv', label: { zh: 'Imported CSV', en: 'Imported CSV' } },
  { value: 'demo', label: { zh: 'Demo Data', en: 'Demo Data' } },
];

export const creatorDatabaseStatusOptions: OptionItem[] = [
  { value: 'new', label: { zh: 'New', en: 'New' } },
  { value: 'to_audit', label: { zh: 'To Audit', en: 'To Audit' } },
  { value: 'approved', label: { zh: 'Approved', en: 'Approved' } },
  { value: 'contacted', label: { zh: 'Contacted', en: 'Contacted' } },
  { value: 'replied', label: { zh: 'Replied', en: 'Replied' } },
  { value: 'sample_sent', label: { zh: 'Sample Sent', en: 'Sample Sent' } },
  { value: 'content_scheduled', label: { zh: 'Content Scheduled', en: 'Content Scheduled' } },
  { value: 'posted', label: { zh: 'Posted', en: 'Posted' } },
  { value: 'reviewed', label: { zh: 'Reviewed', en: 'Reviewed' } },
];
