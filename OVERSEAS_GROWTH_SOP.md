# 海外红人营销 / 海外社媒运营 / 独立站运营 SOP

## 适用定位

这套 SOP 适合以海外用户增长为目标的执行型岗位或个人项目，覆盖三条工作线：

- 海外红人营销：达人收集、筛选、建联、跟进、周报。
- 海外社媒运营：趋势调研、选题、caption、短视频脚本、发布复盘。
- 独立站运营：竞品拆解、页面结构、AI 文案、SEO/CTR 优化、工程落地。

## 每周循环

| 阶段 | 时间 | 核心动作 | 交付物 | 可用 AI / Skill |
| --- | --- | --- | --- | --- |
| 目标输入 | 周一上午 | 明确地区、客群、产品、平台和本周目标 | 增长 brief | Hermes Agent、qiaomu-smart-search、baoyu-translate |
| 对标拆解 | 周一至周二 | 拆竞品站、达人主页、短视频结构、评论区问题 | 竞品拆解表、素材库 | content-parser、apify-ultimate-scraper、baoyu-youtube-transcript |
| 候选池筛选 | 每日执行，周三清洗 | 按地区、垂类、互动率、合作痕迹做 A/B/C 分层 | 达人 CRM | apify-influencer-brand-collabs、spreadsheets、apify-verified-email-finder |
| 资产生产 | 周二至周四 | 产出 caption、脚本、建联话术、页面文案 | 内容包、建联模板 | creator、humanizer、baoyu-imagine |
| 发布落地 | 每日推进 | 发布内容、达人建联、工程对接、状态回填 | 发布记录、建联记录、上线验收 | Hermes Cron、shopify-product-serp-seo-optimizer |
| 数据复盘 | 周五 | 汇总漏斗、内容、页面数据，给出下周动作 | 周报、下周排期 | marketingskills、spreadsheets、Hermes memory |

## 每日执行口径

1. 达人营销：每天完成候选收集、筛选、去重、建联、跟进状态回填。
2. 社媒运营：每天至少拆 3 条对标内容，沉淀 hook、caption、脚本或评论洞察。
3. 独立站运营：每周至少提出 1 个页面或文案优化实验，并记录上线前后数据。
4. 所有动作必须保留来源、链接、时间、负责人、下一步。

## 周报模板

| 模块 | 本周数据 | 发现 | 下周动作 |
| --- | --- | --- | --- |
| 达人池 | 收集数、有效数、建联数、回复数、意向数 | 哪类达人更匹配 | 加码/停止/调整筛选标准 |
| 社媒内容 | 发布数、互动率、保存率、完播率、主页点击 | 哪类内容结构更有效 | 下周选题和脚本方向 |
| 独立站 | CTR、停留、跳出、询盘/点击转化 | 哪些文案或模块影响点击 | 页面优化实验 |

## 已同步安装到 Codex 的 RedSkill

- `marketingskills`：SEO audit、on-page SEO、流量下滑诊断。
- `shopify-product-serp-seo-optimizer`：产品页 SERP 标题、描述、alt text、元字段优化。

## Hermes Agent 接入建议

Hermes Agent 适合承担长期记忆、定时提醒、跨平台入口和重复任务沉淀。后续可以把这套 SOP 拆成以下 Hermes skills：

- `overseas-influencer-crm.skill`
- `short-video-script-factory.skill`
- `independent-site-seo-review.skill`
- `weekly-growth-review.skill`

先用当前网站执行和打磨 SOP，稳定后再把最常用的步骤固化成 Hermes skill。
