import { BriefcaseBusiness, Code2, MessageCircle, Rocket, Sparkles } from "lucide-react";
import MagneticButton from "./MagneticButton";

export default function HeroSection() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg parallax-layer" aria-hidden="true">
        <span className="mesh mesh-a" />
        <span className="mesh mesh-b" />
        <span className="mesh mesh-c" />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">
          <Sparkles /> Code. Create. Convert.
        </p>
        <h1>We Build Digital Experiences That <span className="gradient-text">Grow Your Business</span></h1>
        <p>
          Websites, software, SEO, branding, content shoots and digital marketing solutions designed to make your brand
          stand out.
        </p>
        <div className="hero-actions">
          <MagneticButton href="/contact">
            <Rocket /> Start Your Project
          </MagneticButton>
          <MagneticButton href="/work" variant="secondary">
            <BriefcaseBusiness /> View Our Work
          </MagneticButton>
          <MagneticButton href="/contact" variant="secondary">
            <MessageCircle /> Get a Quote
          </MagneticButton>
        </div>
      </div>
      <div className="visual-panel" aria-label="Digital performance dashboard preview">
        <div className="visual-top">
          <span /> <span /> <span />
        </div>
        <div className="visual-grid">
          <div>
            <strong>92%</strong>
            <span>Lead lift</span>
          </div>
          <div>
            <strong>1.2s</strong>
            <span>Load target</span>
          </div>
          <div>
            <strong>360°</strong>
            <span>Solutions</span>
          </div>
        </div>
        <div className="signal-bars">
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
        <div className="visual-copy">
          <Code2 />
          <p>Strategy, design, code and marketing working as one growth system.</p>
        </div>
      </div>
    </section>
  );
}
