import { redirect } from "next/navigation";

const map: Record<string, string> = {
  influencer: "/creator-crm/finder",
  social: "/content-hub",
  site: "/ecommerce-tracking",
};

export default async function WorkflowRedirectPage({
  params,
}: {
  params: Promise<{ track: string }>;
}) {
  const { track } = await params;
  redirect(map[track] ?? "/");
}
