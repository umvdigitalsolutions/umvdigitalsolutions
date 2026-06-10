import { ChevronRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { services } from "./siteData";

export default function ServicesSection() {
  return (
    <section id="services" className="section">
      <SectionHeading
        eyebrow="Services"
        title="Everything Your Digital Brand Needs"
        copy="A complete stack for visibility, credibility and conversion."
      />
      <div className="services-grid">
        {services.map(([title, description, Icon]) => (
          <article className="service-card reveal" key={title}>
            <div className="service-icon-wrap">
              <Icon />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <ChevronRight />
          </article>
        ))}
      </div>
    </section>
  );
}
