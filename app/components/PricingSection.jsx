import { ArrowRight, Check, Wrench } from "lucide-react";
import MagneticButton from "./MagneticButton";
import SectionHeading from "./SectionHeading";
import { pricing, services } from "./siteData";

const standardPlans = pricing.filter(([, , price]) => price !== null);
const customPlan = pricing.find(([, , price]) => price === null);

const pricedServiceNames = new Set([
  "Website Development",
  "Landing Page Development",
  "Software Development",
  "E-commerce Development",
]);

const contactServices = services.filter(([name]) => !pricedServiceNames.has(name));

const planAccents = ["#11b7ff", "#8d4dff", "#48ffb0", "#f2c76d"];
const planTags = ["Starter", "Business", "Most Popular", "Enterprise"];

export default function PricingSection() {
  return (
    <section id="pricing" className="section">
      <SectionHeading
        eyebrow="Pricing"
        title="Transparent Pricing, Real Value"
        copy="Pick a package that fits your goal. Every plan includes clean code, mobile-first design and a dedicated point of contact."
      />

      <div className="pricing-grid">
        {standardPlans.map(([name, features, price], index) => (
          <article
            key={name}
            className={`pc reveal${index === 2 ? " pc--featured" : ""}`}
            style={{ "--pc-accent": planAccents[index] }}
          >
            {index === 2 && <div className="pc-popular-badge">Most Popular</div>}
            <div className="pc-top">
              <span className="pc-tag">{planTags[index]}</span>
              <h3 className="pc-name">{name}</h3>
            </div>
            <div className="pc-price">
              <span className="pc-from">Starting from</span>
              <strong className="pc-amount">{price}</strong>
            </div>
            <ul className="pc-features">
              {features.map((feature) => (
                <li key={feature}>
                  <Check />
                  {feature}
                </li>
              ))}
            </ul>
            <MagneticButton href="/contact" variant={index === 2 ? "primary" : "secondary"}>
              Get Quote <ArrowRight />
            </MagneticButton>
          </article>
        ))}
      </div>

      {customPlan && (
        <div className="custom-plan-card reveal">
          <div className="custom-plan-icon">
            <Wrench />
          </div>
          <div className="custom-plan-body">
            <h3>{customPlan[0]}</h3>
            <p>Every business has unique requirements. We scope, plan and build software tailored exactly to your workflows — pricing is defined after understanding your needs.</p>
            <ul className="custom-plan-features">
              {customPlan[1].map((feature) => (
                <li key={feature}><Check /> {feature}</li>
              ))}
            </ul>
          </div>
          <div className="custom-plan-cta">
            <span className="custom-plan-price">Depends on project scope</span>
            <MagneticButton href="/contact">
              Discuss Your Project <ArrowRight />
            </MagneticButton>
          </div>
        </div>
      )}

      <div className="other-services reveal">
        <div className="other-services-header">
          <span className="other-services-eyebrow">More Services</span>
          <h3>Need something else?</h3>
          <p>These services are scoped and priced to your specific goals. Drop us a message and we will get back with a tailored quote.</p>
        </div>
        <div className="other-services-grid">
          {contactServices.map(([name, , Icon]) => (
            <a key={name} href="/contact" className="other-service-card">
              <div className="other-service-icon">
                <Icon />
              </div>
              <div className="other-service-info">
                <span className="other-service-name">{name}</span>
                <span className="other-service-label">Contact for pricing</span>
              </div>
              <ArrowRight className="other-service-arrow" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
