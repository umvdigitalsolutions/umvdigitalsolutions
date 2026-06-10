import {
  ArrowRight,
  BadgeCheck,
  Blocks,
  Camera,
  Code2,
  Megaphone,
  Palette,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

const highlights = [
  ["50+", "Projects Delivered"],
  ["20+", "Happy Clients"],
  ["10+", "Business Niches"],
  ["360°", "Digital Solutions"],
];

const capabilities = [
  ["Website Development", Code2],
  ["Software Development", Blocks],
  ["SEO & Local Visibility", Search],
  ["Brand Identity", Palette],
  ["Social Media Marketing", Megaphone],
  ["Content Shoots", Camera],
];

const values = [
  ["Business-first strategy", "Every design, page and campaign is shaped around clear goals, leads and long-term growth.", Target],
  ["Premium execution", "Modern interfaces, clean structure, strong visuals and smooth user journeys across every device.", Sparkles],
  ["Scalable systems", "Websites and software are built so your digital presence can grow with your business.", ShieldCheck],
  ["Fast moving support", "From launch to improvements, UMV keeps the process clear, practical and responsive.", Zap],
];

const industries = [
  "Travel",
  "Healthcare",
  "Pharma",
  "Cafes",
  "Legal",
  "Consulting",
  "Gifting",
  "Consumer Brands",
  "Battery Solutions",
  "Local Businesses",
];

const heroChips = ["Websites", "Software", "SEO", "Branding", "Campaigns"];

export default function AboutPageContent() {
  return (
    <section className="section about-detail">
      <div className="about-hero-wrap">
        <div className="about-hero">
          <span className="about-kicker">UMV Digital Solutions</span>
          <h1>
            Code. Create. <em>Convert.</em>
          </h1>
          <p>
            UMV Digital Solutions is a creative technology and digital marketing company helping businesses build a strong
            online presence through modern websites, software, automation, branding, SEO, content shoots and result-driven
            digital campaigns.
          </p>
          <div className="about-hero-chips">
            {heroChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>

        <aside className="about-signal-card" aria-label="UMV operating system">
          <div className="about-orbit">
            <span />
            <span />
            <span />
          </div>
          <strong>Strategy + Design + Code + Growth</strong>
          <p>One connected digital system for brands that want clarity, trust and measurable momentum.</p>
          <div className="about-signal-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </aside>
      </div>

      <div className="about-stat-strip">
        {highlights.map(([value, label]) => (
          <article key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>

      <div className="about-section-intro">
        <span className="about-kicker">How We Think</span>
        <h2>We connect design decisions to business outcomes.</h2>
        <p>
          Every UMV project is shaped around credibility, clarity, speed and conversion, so the final result feels premium
          and works practically for the business behind it.
        </p>
      </div>

      <div className="about-story-grid">
        <article className="about-story-card">
          <small>01 / Identity</small>
          <span className="about-card-icon"><BadgeCheck /></span>
          <h2>Who We Are</h2>
          <p>
            We work like a high-end digital partner for brands that need more than a basic website. Our focus is to
            combine strategy, design, code and marketing so your brand looks credible, loads fast, communicates clearly
            and converts visitors into real inquiries.
          </p>
        </article>

        <article className="about-story-card featured">
          <small>02 / Execution</small>
          <span className="about-card-icon"><Rocket /></span>
          <h2>What We Build</h2>
          <p>
            From landing pages and business websites to digital growth systems, brand identities, social creatives and
            custom software workflows, UMV creates practical digital assets that support visibility, trust and growth.
          </p>
        </article>
      </div>

      <div className="about-capabilities">
        <div>
          <span className="about-kicker">Core Strengths</span>
          <h2>Digital solutions made for growing businesses.</h2>
          <p>
            We combine clean development, visual identity and marketing systems so every brand touchpoint feels connected.
          </p>
        </div>
        <div className="about-capability-grid">
          {capabilities.map(([label, Icon]) => (
            <article key={label}>
              <Icon />
              <span>{label}</span>
              <small>UMV</small>
            </article>
          ))}
        </div>
      </div>

      <div className="about-section-intro compact">
        <span className="about-kicker">Our Standards</span>
        <h2>The way we make digital work feel reliable.</h2>
      </div>

      <div className="about-values-grid">
        {values.map(([title, copy, Icon]) => (
          <article key={title}>
            <span className="about-card-icon"><Icon /></span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>

      <div className="about-industries">
        <span className="about-kicker">Industries We Support</span>
        <div>
          {industries.map((industry) => (
            <span key={industry}>{industry}</span>
          ))}
        </div>
      </div>

      <div className="about-cta">
        <div>
          <span className="about-kicker">Ready to grow?</span>
          <h2>Let’s build a digital presence that works as hard as your business.</h2>
        </div>
        <a href="/contact">Start Your Project <ArrowRight /></a>
      </div>
    </section>
  );
}
