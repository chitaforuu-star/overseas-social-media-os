# Overseas Social Media OS

Chinese:
海外社媒运营工作流系统：用于管理达人搜索、达人审核、建联、寄样、内容上线和数据复盘。

English:
A practical Overseas Social Media / Influencer Marketing workflow system for creator sourcing, auditing, outreach, sampling, content tracking, and performance review.

## Modules

1. `Creator CRM` (core)
2. `Content Hub`
3. `E-commerce Tracking`

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Build Check

```bash
npm run build
```

This project is based on Next.js App Router and can be deployed directly to Vercel.

## Deploy (Recommended: Vercel)

1. Push this project to GitHub.
2. Go to Vercel and click **Add New Project**.
3. Import the GitHub repository.
4. Framework preset: **Next.js** (auto-detected).
5. Build command: `npm run build` (default).
6. Output setting: keep default.
7. Click **Deploy**.

After deployment, Vercel will provide a production URL such as:

```text
https://your-project-name.vercel.app
```

This is the final link you should share with friends/interviewers.

## Routes

- `/` Home
- `/creator-crm/finder`
- `/creator-crm/auditor`
- `/creator-crm/outreach`
- `/creator-crm/collaboration`
- `/creator-crm/sample`
- `/creator-crm/content`
- `/creator-crm/performance`
- `/content-hub`
- `/ecommerce-tracking`

## Notes

- No login required
- No backend required
- Uses frontend mock data + local state for demo and presentation
- Language toggle supported: `中文` / `English`
