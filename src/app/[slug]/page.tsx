import { redirect } from "next/navigation";

type Params = {
  params: {
    slug: string;
  };
};

export default function LegacyAgendaRedirect({ params }: Params) {
  redirect(`/agenda/${params.slug}`);
}
