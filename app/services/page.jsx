import ServicesSection from "../components/ServicesSection";
import PageShell from "../components/PageShell";

export const metadata = {
  title: "Services | UMV Digital Solutions",
  description: "Explore website development, SEO, branding, software development and digital marketing services.",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <ServicesSection />
    </PageShell>
  );
}
