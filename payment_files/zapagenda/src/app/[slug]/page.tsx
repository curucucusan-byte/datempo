import ClientPage from "./ClientPage";

type Params = { slug: string };
type PageProps = {
  params: Promise<Params>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return <ClientPage slug={slug} />;
}
