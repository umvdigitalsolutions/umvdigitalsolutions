import { ArrowRight, BadgeCheck, Camera, Crown, Mail, MapPin, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import Logo from "./Logo";

const instagramUrl = "https://www.instagram.com/umvdigitals/";

const quickLinks = [
  ["About", "/about"],
  ["Services", "/services"],
  ["Work", "/work"],
  ["Team", "/team"],
  ["Pricing", "/pricing"],
  ["Contact", "/contact"],
];

const services = [
  "Website Development",
  "Software Development",
  "Brand Identity",
  "Content Production",
  "Digital Marketing",
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div>
          <span><Crown /> UMV Digital Solutions</span>
          <h2>Build a digital presence with authority, trust and lasting impact.</h2>
        </div>
        <a href="/contact">
          Start Your Project <ArrowRight />
        </a>
      </div>

      <div className="footer-main">
        <div className="footer-brand">
          <Logo className="footer-logo" />
          <p>Premium websites, custom software, brand identity, content shoots and digital marketing for businesses that want a stronger market presence.</p>
          <div className="footer-stack">
            <span>Strategy</span>
            <span>Design</span>
            <span>Development</span>
            <span>Growth</span>
          </div>
          <div className="footer-contact-pills">
            <a href="mailto:umvdigitalsolutions@gmail.com"><Mail /> Email Us</a>
            <a href="https://wa.me/919967276861?text=Hi%20UMV%20Digital%20Solutions%2C%20I%20want%20to%20start%20a%20project." target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer"><Camera /> Instagram</a>
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer quick links">
          <h3>Explore</h3>
          {quickLinks.map(([label, href]) => (
            <a href={href} key={label}>{label}</a>
          ))}
        </nav>

        <nav className="footer-links" aria-label="Footer services">
          <h3>Services</h3>
          {services.map((service) => (
            <a href="/services" key={service}>{service}</a>
          ))}
        </nav>

        <div className="footer-reach">
          <h3>Reach</h3>
          <a href="mailto:umvdigitalsolutions@gmail.com"><Mail /> umvdigitalsolutions@gmail.com</a>
          <a href="/contact"><Phone /> Book a discovery call</a>
          <span><MapPin /> India based, working everywhere</span>
          <div className="footer-system">
            <div><BadgeCheck /> Professional project process</div>
            <div><ShieldCheck /> Secure handover and support</div>
            <div><Crown /> Premium brand execution</div>
          </div>
          <div className="social-row">
            <a href="/contact" aria-label="Contact UMV"><MessageCircle /></a>
            <a href="/work" aria-label="View UMV work"><Crown /></a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" aria-label="UMV Digital Solutions Instagram"><Camera /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 UMV Digital Solutions. All rights reserved.</p>
        <span>Authority. Craft. Growth.</span>
      </div>
    </footer>
  );
}
