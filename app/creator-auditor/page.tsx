import { CreatorAuditorClient } from "./creator-auditor-client";

type PageProps = {
  searchParams?: Promise<{ profile?: string } | { profile?: string }>;
};

export default async function CreatorAuditorPage(props: PageProps) {
  const searchParams = (await props.searchParams) ?? {};
  return <CreatorAuditorClient initialProfile={searchParams.profile ?? null} />;
}
