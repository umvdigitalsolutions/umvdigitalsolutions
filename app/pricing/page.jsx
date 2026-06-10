import PageShell from "../components/PageShell";
import PricingSection from "../components/PricingSection";

export const metadata = {
  title: "Pricing | UMV Digital Solutions",
  description: "Request a quote for starter websites, business websites and premium digital packages.",
};

export default function PricingPage() {
  return (
    <PageShell>
      <PricingSection />
    </PageShell>
  );
}
