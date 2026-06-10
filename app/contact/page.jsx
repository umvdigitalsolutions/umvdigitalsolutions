import ContactSection from "../components/ContactSection";
import PageShell from "../components/PageShell";

export const metadata = {
  title: "Contact | UMV Digital Solutions",
  description: "Contact UMV Digital Solutions to start your website, software, SEO, branding or digital marketing project.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <ContactSection />
    </PageShell>
  );
}
