"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, BadgeCheck, Blocks, BrainCircuit, Camera, Code2, Cpu, DatabaseZap, Gem, Globe2, LineChart, Megaphone, Orbit, Palette, Radar, Search, ShieldCheck, Sparkles, Terminal, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Header from "./components/Header";
import Logo from "./components/Logo";

gsap.registerPlugin(ScrollTrigger);

const designSystem = {
  colors: ["Obsidian black", "Deep navy", "Empire gold", "Electric blue", "Signal cyan"],
  typography: "Huge condensed-feeling Geist Sans headlines with Geist Mono command surfaces.",
  animation: "Boot-up reveals, grid drift, pinned horizontal motion, orbital loops and magnetic controls.",
};

const marqueeServices = [
  "Web Empires",
  "Custom Software",
  "SEO Systems",
  "Brand Identity",
  "Content Shoots",
  "Growth Campaigns",
  "E-Commerce",
  "Automation",
];

const caseStudies = [
  ["Globe Guru", "Travel commerce presence", "/globeguru-ss.png", "Discovery architecture for a travel brand built around trust, packages and enquiries.", "Web + SEO"],
  ["Nova Biopharma", "Healthcare credibility engine", "/novabiopharma-ss.png", "A precise digital face for a biopharma company with clean hierarchy and institutional polish.", "Corporate Web"],
  ["Dr. Kamini", "Clinic conversion system", "/drkamini-ss.png", "Appointment-led experience for a local healthcare brand with warmth, clarity and speed.", "Landing Page"],
  ["ZivaQ", "Pharma brand command", "/zivaq-ss.png", "A sharper market presence for a medical brand that needed authority without visual clutter.", "Brand + Web"],
  ["MM & Co.", "Business services interface", "/mmn-ss.png", "Professional service storytelling wrapped in a direct inquiry pathway.", "Digital Presence"],
];

const ecosystemServices = [
  ["Websites", Code2, "Premium coded sites that feel owned, not templated."],
  ["Software", Blocks, "Dashboards, portals and workflows shaped around operations."],
  ["SEO", Search, "Technical foundations and content paths for compounding discovery."],
  ["Marketing", Megaphone, "Campaign systems for attention, leads and retention."],
  ["Branding", Palette, "Identity systems with enough edge to be remembered."],
  ["Content", Camera, "Photo and video assets made for digital conversion."],
];

const processCommands = [
  ["init_discovery", "Map ambition, market, audience, constraints and decision paths."],
  ["scan_competition", "Find visual sameness, message gaps and authority opportunities."],
  ["compile_identity", "Shape art direction, UX language, content hierarchy and conversion logic."],
  ["deploy_build", "Develop the site, software or campaign with performance-first execution."],
  ["monitor_growth", "Launch, measure, refine and keep the machine improving."],
];

const stats = [
  ["42+", "Digital launches"],
  ["12", "Service engines"],
  ["98", "Speed discipline"],
  ["24/7", "System mindset"],
];

const testimonials = [
  ["A professional identity our clients actually compliment.", "Globe Guru Holidays"],
  ["Better leads, stronger trust and a website that feels premium.", "Clinic Founder"],
  ["Fast delivery, creative thinking and support after launch.", "Retail Brand Owner"],
  ["They understood the business before designing the interface.", "Advisory Client"],
];

function MagneticLink({ href, children, variant = "primary" }) {
  return (
    <a href={href} className={`empire-button magnetic-zone ${variant}`}>
      <span>{children}</span>
      <ArrowRight size={18} />
    </a>
  );
}

export default function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCompact = window.matchMedia("(max-width: 760px)").matches;
    const context = gsap.context(() => {
      if (!reduceMotion) {
        gsap.from(".hero-reveal", {
          y: 54,
          opacity: 0,
          duration: 1,
          stagger: 0.11,
          ease: "power4.out",
        });

        gsap.to(".grid-plane", {
          backgroundPosition: "120px 120px, 120px 120px",
          duration: 8,
          repeat: -1,
          ease: "none",
        });

        gsap.utils.toArray(".empire-reveal").forEach((item) => {
          gsap.from(item, {
            y: 56,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 82%" },
          });
        });

        const track = root.querySelector(".portfolio-track");
        const section = root.querySelector(".portfolio-section");
        if (track && section && !isCompact) {
          const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);
          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getDistance() + window.innerHeight * 0.8}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }

        const setupCircularOrbit = ({ stageSelector, itemSelector, cardSelector, radius, tabletRadius, duration, direction = 1 }) => {
          const stage = root.querySelector(stageSelector);
          const items = gsap.utils.toArray(itemSelector);
          if (!stage || !items.length) return;

          const state = { angle: 0 };
          const render = () => {
            const stageSize = Math.min(stage.offsetWidth, stage.offsetHeight);
            const currentRadius = Math.min(window.innerWidth < 1100 ? tabletRadius : radius, stageSize * 0.38);

            items.forEach((item, index) => {
              const angle = state.angle * direction + (index / items.length) * Math.PI * 2;
              const x = Math.cos(angle) * currentRadius;
              const y = Math.sin(angle) * currentRadius;
              const depth = (Math.sin(angle) + 1) / 2;
              const card = item.querySelector(cardSelector);

              gsap.set(item, { x, y, zIndex: Math.round(depth * 100), rotate: 0, rotateX: 0, rotateY: 0, skewX: 0, skewY: 0 });
              gsap.set(card, {
                scale: 0.82 + depth * 0.18,
                opacity: 0.45 + depth * 0.55,
                rotate: 0,
                rotateX: 0,
                rotateY: 0,
                skewX: 0,
                skewY: 0,
              });
            });
          };

          render();
          gsap.to(state, {
            angle: Math.PI * 2,
            duration,
            repeat: -1,
            ease: "none",
            onUpdate: render,
          });
        };

        setupCircularOrbit({
          stageSelector: ".ecosystem-orbit",
          itemSelector: ".service-orbit-item",
          cardSelector: ".orbit-node",
          radius: 250,
          tabletRadius: 205,
          duration: 48,
        });

        setupCircularOrbit({
          stageSelector: ".testimonial-stage",
          itemSelector: ".testimonial-orbit-item",
          cardSelector: ".testimonial-card",
          radius: 270,
          tabletRadius: 215,
          duration: 42,
          direction: -1,
        });
      }
    }, root);

    const magneticItems = Array.from(root.querySelectorAll(".magnetic-zone"));
    const onMove = (event) => {
      magneticItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const inside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;
        if (!inside) return;
        gsap.to(item, {
          x: (event.clientX - rect.left - rect.width / 2) * 0.22,
          y: (event.clientY - rect.top - rect.height / 2) * 0.22,
          duration: 0.32,
          ease: "power3.out",
        });
      });
    };
    const onLeave = () => gsap.to(magneticItems, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, 0.35)" });
    const onPointer = (event) => {
      root.style.setProperty("--cursor-x", `${event.clientX}px`);
      root.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    root.addEventListener("mousemove", onMove);
    root.addEventListener("mouseleave", onLeave);
    window.addEventListener("pointermove", onPointer);

    return () => {
      context.revert();
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <main ref={mainRef} className="site-shell empire-home">
      <div className="cursor-glow" aria-hidden="true" />
      <div className="grid-plane" aria-hidden="true" />
      <Header />

      <section className="empire-hero" aria-label="UMV Digital Solutions">
        <div className="hero-console hero-reveal">
          <span className="console-dot" />
          <span>system: UMV_DIGITAL_EMPIRE</span>
          <strong>ONLINE</strong>
        </div>
        <div className="hero-copy-empire">
          <p className="hero-kicker hero-reveal">
            <Sparkles size={16} />
            <span className="kicker-desktop">Agency interface for brands that refuse template gravity</span>
            <span className="kicker-mobile">Creative agency interface</span>
          </p>
          <h1 className="hero-reveal">We engineer digital empires with code, cinema and growth systems.</h1>
          <p className="hero-reveal">
            UMV Digital Solutions builds premium websites, software, identities, content and marketing engines that feel custom from the first pixel.
          </p>
          <div className="hero-actions hero-reveal">
            <MagneticLink href="/contact">Start a build</MagneticLink>
            <MagneticLink href="/work" variant="ghost">Enter portfolio</MagneticLink>
          </div>
        </div>
        <div className="hero-orbital hero-reveal" aria-hidden="true">
          <div className="empire-core"><Logo /></div>
          <span style={{ "--i": 0 }}>UX</span>
          <span style={{ "--i": 1 }}>SEO</span>
          <span style={{ "--i": 2 }}>AI</span>
          <span style={{ "--i": 3 }}>DEV</span>
          <span style={{ "--i": 4 }}>ADS</span>
          <span style={{ "--i": 5 }}>CMS</span>
        </div>
      </section>

      <section className="service-marquee" aria-label="Moving service marquee">
        <div>
          {[...marqueeServices, ...marqueeServices].map((service, index) => (
            <span key={`${service}-${index}`}><Zap size={18} /> {service}</span>
          ))}
        </div>
      </section>

      <section className="portfolio-section" aria-label="Portfolio case studies">
        <div className="portfolio-intro empire-reveal">
          <span><Radar size={16} /> Horizontal case stream</span>
          <h2>Proof moves sideways.</h2>
          <p>Scroll through selected builds as cinematic product frames, not stacked template cards.</p>
        </div>
        <div className="portfolio-track">
          {caseStudies.map(([name, title, image, copy, tag], index) => (
            <article className="case-panel" key={name}>
              <div className="case-index">0{index + 1}</div>
              <div className="case-screen" style={{ position: "relative" }}>
                <Image src={image} alt={`${name} website screenshot`} fill sizes="(max-width: 900px) 86vw, 58vw" />
              </div>
              <div className="case-copy">
                <span>{tag}</span>
                <h3>{name}</h3>
                <strong>{title}</strong>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ecosystem-section empire-reveal" aria-label="Services ecosystem">
        <div className="ecosystem-copy">
          <span><Orbit size={16} /> Service ecosystem</span>
          <h2>One command center. Many growth engines.</h2>
          <p>{designSystem.typography} Each service orbits the same strategic core: authority, conversion and future-ready execution.</p>
        </div>
        <div className="ecosystem-orbit">
          <div className="orbit-ring" aria-hidden="true" />
          <div className="service-orbit-field">
            {ecosystemServices.map(([label, Icon, copy], index) => (
              <div className="service-orbit-item" style={{ "--i": index }} key={label}>
                <div className="orbit-node">
                  <Icon />
                  <strong>{label}</strong>
                  <small>{copy}</small>
                </div>
              </div>
            ))}
          </div>
          <div className="ecosystem-core">
            <Cpu />
            <strong>UMV OS</strong>
            <span>Strategy + Design + Code + Growth</span>
          </div>
        </div>
      </section>

      <section className="terminal-section" aria-label="Command line process">
        <div className="terminal-window empire-reveal">
          <div className="terminal-top"><span /><span /><span /><strong>umv/process.exec</strong></div>
          {processCommands.map(([command, result], index) => (
            <div className="terminal-row" key={command}>
              <code><b>$</b> {command} --phase={index + 1}</code>
              <p>{result}</p>
            </div>
          ))}
          <div className="terminal-complete"><BadgeCheck size={18} /> build_ready: true</div>
        </div>
      </section>

      <section className="analytics-section empire-reveal" aria-label="Live analytics dashboard">
        <div className="analytics-header">
          <span><LineChart size={16} /> Live agency telemetry</span>
          <h2>Stats as a control room, not a trophy shelf.</h2>
        </div>
        <div className="dashboard-shell">
          <div className="metric-column">
            {stats.map(([value, label]) => (
              <div className="metric-tile" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="signal-graph" aria-hidden="true">
            {[42, 68, 54, 88, 74, 96, 63, 82, 91, 77, 99, 86].map((height, index) => (
              <i style={{ "--h": `${height}%` }} key={index} />
            ))}
          </div>
          <div className="dashboard-feed">
            <p><DatabaseZap size={16} /> lead_quality.index rising</p>
            <p><ShieldCheck size={16} /> launch_integrity stable</p>
            <p><BrainCircuit size={16} /> creative_systems learning</p>
          </div>
        </div>
      </section>

      <section className="testimonial-section empire-reveal" aria-label="Orbit testimonials">
        <div className="testimonial-copy">
          <span><Gem size={16} /> Client signal orbit</span>
          <h2>Reputation with motion around it.</h2>
          <p>Short proof points circulate around the UMV core, because trust is part of the system design.</p>
        </div>
        <div className="testimonial-stage">
          <div className="testimonial-core"><Globe2 /><strong>TRUST CORE</strong></div>
          <div className="testimonial-orbit" aria-hidden="true" />
          <div className="testimonial-orbit-field">
            {testimonials.map(([quote, name], index) => (
              <div className="testimonial-orbit-item" style={{ "--i": index }} key={name}>
                <blockquote className="testimonial-card">
                  <p>&quot;{quote}&quot;</p>
                  <cite>{name}</cite>
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta" aria-label="Final call to action">
        <div className="cta-beam empire-reveal">
          <span><Terminal size={16} /> ready_for_next_command</span>
          <h2>Let your brand stop looking like everyone else&apos;s website.</h2>
          <p>We will build the digital headquarters your clients remember, trust and return to.</p>
          <MagneticLink href="/contact">Launch the empire</MagneticLink>
        </div>
      </section>

      <footer className="empire-footer">
        <Logo />
        <p>UMV Digital Solutions is a creative technology studio building premium digital presence, business software and growth infrastructure for ambitious brands.</p>
        <div>
          {designSystem.colors.map((item) => <span key={item}>{item}</span>)}
        </div>
        <small>(c) 2026 UMV Digital Solutions. Authority. Craft. Growth.</small>
      </footer>
    </main>
  );
}
