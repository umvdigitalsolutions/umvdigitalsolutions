import AboutPageContent from "../components/AboutPageContent";
import PageShell from "../components/PageShell";

export const metadata = {
  title: "About UMV Digital Solutions",
  description: "Learn about UMV Digital Solutions, a creative technology and digital marketing company.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <AboutPageContent />
    </PageShell>
  );
}
