import { redirect } from "next/navigation";

const routeMap: Record<string, string> = {
  clients: "/creator-crm/finder",
  campaign: "/creator-crm/outreach",
  assets: "/content-hub",
  review: "/creator-crm/performance",
  analytics: "/creator-crm/performance",
  "ai-tools": "/content-hub",
  "ai-title": "/content-hub",
  "ai-outreach": "/creator-crm/outreach",
  "ai-caption": "/content-hub",
  "seo-keywords": "/ecommerce-tracking",
  "customer-analysis": "/creator-crm/auditor",
};

export default async function ResourceRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const target = routeMap[id] ?? "/creator-crm/finder";
  redirect(target);
}
