import ServicesSection from "../components/ServicesSection";
import PageShell from "../components/PageShell";
import JarvisOrb from "../components/JarvisOrb";

export const metadata = {
  title: "Services | UMV Digital Solutions",
  description: "Explore website development, SEO, branding, software development and digital marketing services.",
};

export default function ServicesPage() {
  return (
    <PageShell className="services-route">
      <section className="section services-orb-section" aria-label="Interactive services orb">
        <div className="jarvis-orb-shell services-page-orb">
          <JarvisOrb scrollDriven />
        </div>
      </section>
      <ServicesSection />
    </PageShell>
  );
}
