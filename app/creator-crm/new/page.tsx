import { CreatorCrmNewClient } from "./creator-crm-new-client";

type PageProps = {
  searchParams?: Promise<{ id?: string } | { id?: string }>;
};

export default async function CreatorCrmNewPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  return <CreatorCrmNewClient initialCreatorId={searchParams.id ?? null} />;
}
