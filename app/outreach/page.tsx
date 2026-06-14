import { OutreachClient } from "./outreach-client";

type PageProps = {
  searchParams?: Promise<{ creatorId?: string } | { creatorId?: string }>;
};

export default async function OutreachPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  return <OutreachClient initialCreatorId={searchParams.creatorId ?? null} />;
}
