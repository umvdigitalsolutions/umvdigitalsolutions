import PageShell from "../components/PageShell";
import WorkGrid from "../components/WorkGrid";

export const metadata = {
  title: "Work | UMV Digital Solutions",
  description: "View selected website, branding, digital marketing and software work by UMV Digital Solutions.",
};

export default function WorkPage() {
  return (
    <PageShell>
      <WorkGrid />
    </PageShell>
  );
}
