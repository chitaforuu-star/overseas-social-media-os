import { ContentHubNewClient } from "./content-hub-new-client";

type PageProps = {
  searchParams?: Promise<{ id?: string } | { id?: string }>;
};

export default async function ContentHubNewPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  return <ContentHubNewClient initialItemId={searchParams.id ?? null} />;
}
