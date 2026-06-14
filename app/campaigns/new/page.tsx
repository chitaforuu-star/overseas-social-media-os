import { CampaignNewClient } from "./campaign-new-client";

type PageProps = {
  searchParams?: Promise<{ id?: string } | { id?: string }>;
};

export default async function CampaignNewPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  return <CampaignNewClient initialCampaignId={searchParams.id ?? null} />;
}
