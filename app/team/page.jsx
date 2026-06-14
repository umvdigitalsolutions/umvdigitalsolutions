import TeamPageContent from "../components/TeamPageContent";
import PageShell from "../components/PageShell";

export const metadata = {
  title: "Our Team — UMV Digital Solutions",
  description: "Meet the team behind UMV Digital Solutions — directors, developers and creatives building digital presence for growing businesses.",
};

export default function TeamPage() {
  return (
    <PageShell>
      <TeamPageContent />
    </PageShell>
  );
}
