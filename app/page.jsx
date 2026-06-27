"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Camera,
  Code2,
  Globe2,
  LineChart,
  Megaphone,
  Palette,
  Pencil,
  Quote,
  Search,
  Sparkles,
  Star,
  Terminal,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Header from "./components/Header";
import Logo from "./components/Logo";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

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

const marqueeServices2 = [
  "UI/UX Design",
  "Performance",
  "Conversion CRO",
  "Analytics",
  "Cloud Deploy",
  "AI Workflows",
  "App Dev",
  "Strategy",
];

const caseStudies = [
  {
    name: "Globe Guru",
    category: "Web + SEO",
    image: "/globeguru-ss.png",
    desc: "Discovery architecture for a travel brand built around trust, packages and enquiries.",
  },
  {
    name: "Nova Biopharma",
    category: "Corporate Web",
    image: "/novabiopharma-ss.png",
    desc: "A precise digital face for a biopharma company with clean hierarchy and institutional polish.",
  },
  {
    name: "Dr. Kamini",
    category: "Landing Page",
    image: "/drkamini-ss.png",
    desc: "Appointment-led experience for a local healthcare brand with warmth, clarity and speed.",
  },
  {
    name: "ZivaQ",
    category: "Brand + Web",
    image: "/zivaq-ss.png",
    desc: "A sharper market presence for a medical brand that needed authority without visual clutter.",
  },
];

const bentoServices = [
  ["Website Development", Code2, "Premium coded sites that feel owned, not templated."],
  ["Software Development", Blocks, "Dashboards, portals and workflows shaped around operations."],
  ["SEO Optimization", Search, "Technical foundations and content paths for compounding discovery."],
  ["Branding", Palette, "Identity systems with enough edge to be remembered."],
  ["Content Production", Camera, "Photo and video assets made for digital conversion."],
  ["Digital Marketing", Megaphone, "Campaign systems for attention, leads and retention."],
];

const processCommands = [
  ["init_discovery", "Map ambition, market, audience, constraints and decision paths."],
  ["scan_competition", "Find visual sameness, message gaps and authority opportunities."],
  ["compile_identity", "Shape art direction, UX language, content hierarchy and conversion logic."],
  ["deploy_build", "Develop the site, software or campaign with performance-first execution."],
  ["monitor_growth", "Launch, measure, refine and keep the machine improving."],
];

const testimonials = [
  {
    quote:
      "UMV gave our brand a professional online identity that our clients genuinely compliment.",
    name: "Teja Ram",
    company: "Globe Guru Holidays",
  },
  {
    quote:
      "Better leads, stronger trust and a website that feels premium from the very first scroll.",
    name: "Dr. Kamini Shakya",
    company: "Kamini Physiotherapy Clinic",
  },
  {
    quote: "Creative team, fast delivery and excellent support long after the launch date.",
    name: "Amit Lodha",
    company: "Lodha's Beyond Giftings",
  },
];

/* 6 service nodes fixed around the radar — angle = i*60 - 90 (WEB at top, clockwise) */
const orbitNodes = [
  { label: "Web",       Icon: Globe2,    tone: "blue"  },
  { label: "Branding",  Icon: Star,      tone: "amber" },
  { label: "Marketing", Icon: Megaphone, tone: "blue"  },
  { label: "Software",  Icon: Code2,     tone: "amber" },
  { label: "UI/UX",     Icon: Pencil,    tone: "blue"  },
  { label: "SEO",       Icon: Search,    tone: "amber" },
];

/* viewBox is 600x600, centre (300,300); nodes sit at 0.43 of the box → on the outer ring */
/* viewBox units from centre; must equal the CSS --node-r ratio (0.40) × 600 so
   the SVG connector endpoints land exactly on the HTML node centres */
const NODE_R = 240;

function nodeGeometry(i) {
  const a = ((i * 60 - 90) * Math.PI) / 180;
  const cos = Math.cos(a);
  const sin = Math.sin(a);
  const nx = 300 + cos * NODE_R;
  const ny = 300 + sin * NODE_R;
  // quadratic bezier curving gently toward the core
  const mx = (nx + 300) / 2;
  const my = (ny + 300) / 2;
  const dx = 300 - nx;
  const dy = 300 - ny;
  const len = Math.hypot(dx, dy) || 1;
  const bow = 30;
  const ctrlX = mx + (-dy / len) * bow;
  const ctrlY = my + (dx / len) * bow;
  return { cos, sin, nx, ny, d: `M ${nx} ${ny} Q ${ctrlX} ${ctrlY} 300 300` };
}

/* Small inline sparkline used by the PERFORMANCE / UPTIME cards */
function Sparkline({ tone = "blue" }) {
  return (
    <svg className="dcc-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <path
        className={`dcc-spark-line dcc-spark-line--${tone}`}
        d="M0 23 L11 9 L22 16 L33 5 L44 14 L55 4 L66 18 L77 8 L88 15 L100 6"
        fill="none"
      />
    </svg>
  );
}

const heroSignals = [
  "Strategy-First Approach",
  "Conversion Focused",
  "Premium Design",
  "Performance Optimized",
];

const heroTrustStats = [
  ["42+", "Projects Delivered"],
  ["30+", "Happy Clients"],
  ["98%", "Success Rate"],
  ["2+", "Years of Impact"],
];

function MagneticLink({ href, children, variant = "primary" }) {
  return (
    <a href={href} className={`empire-button magnetic-zone ${variant}`}>
      <span>{children}</span>
      <ArrowRight size={18} />
    </a>
  );
}

const dccParticles = [
  { x: 6, y: 14, s: 2 }, { x: 14, y: 32, s: 1.5 }, { x: 9, y: 52, s: 2.5 },
  { x: 20, y: 70, s: 1.5 }, { x: 30, y: 18, s: 2 }, { x: 40, y: 8, s: 1.5 },
  { x: 52, y: 14, s: 2 }, { x: 64, y: 9, s: 1.5 }, { x: 76, y: 16, s: 2.5 },
  { x: 88, y: 24, s: 1.5 }, { x: 92, y: 44, s: 2 }, { x: 86, y: 64, s: 1.5 },
  { x: 78, y: 80, s: 2 }, { x: 60, y: 88, s: 1.5 }, { x: 40, y: 84, s: 2.5 },
  { x: 24, y: 90, s: 1.5 },
];

const bootLines = [
  "Initializing Command Core...",
  "Loading Modules",
  "Connecting Data Streams",
  "Optimizing Performance",
  "Launching Digital Empire...",
];

function DigitalCommandCore() {
  return (
    <div className="digital-command-core" aria-hidden="true">
      <div className="dcc-grid" />
      <div className="dcc-particles">
        {dccParticles.map((p, i) => (
          <span
            key={i}
            className="dcc-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.s}px`,
              height: `${p.s}px`,
            }}
          />
        ))}
      </div>
      <div className="dcc-scan" />
      <div className="dcc-orb dcc-orb--blue" />
      <div className="dcc-orb dcc-orb--gold" />

      <div className="dcc-topbar">
        <div className="dcc-window-dots">
          <span />
          <span />
          <span />
        </div>
        <span>Digital Command Core</span>
        <strong>AI HUD / LIVE</strong>
      </div>

      <div className="dcc-stage">
        {/* ── HUD cards ── */}
        <div className="dcc-info-card dcc-info-card--seo">
          <span>SEO SYNCED</span>
          <p>Keyword Engine Active</p>
          <p>Rank Signals Optimized</p>
        </div>

        <div className="dcc-side-card dcc-side-card--status">
          <span>System Online</span>
          <i className="dcc-ping" aria-hidden="true" />
          <p>All Systems Operational</p>
        </div>

        <div className="dcc-side-card dcc-side-card--performance">
          <div className="dcc-card-row">
            <span>Performance</span>
            <strong>+24.6%</strong>
          </div>
          <Sparkline tone="blue" />
        </div>

        <div className="dcc-info-card dcc-info-card--data">
          <span>DATA STREAM</span>
          <p>Live Analytics Feed</p>
          <div className="dcc-bar-chart">
            {[40, 65, 48, 82, 55, 90, 52, 78, 44, 86, 60, 95].map((h, i) => (
              <i key={i} className={i % 2 ? "amber" : "blue"} style={{ "--h": `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="dcc-terminal-card">
          <span>Terminal</span>
          {bootLines.map((line) => (
            <code className="dcc-boot" key={line}>&gt; {line}</code>
          ))}
          <strong className="dcc-boot">&gt; Status: LIVE<i className="dcc-cursor" /></strong>
        </div>

        <div className="dcc-info-card dcc-info-card--ui">
          <span>UI GRID READY</span>
          <p>Design System Loaded</p>
          <p>User Flow Optimized</p>
        </div>

        <div className="dcc-side-card dcc-side-card--uptime">
          <div className="dcc-card-row">
            <span>Uptime</span>
            <strong>99.99%</strong>
          </div>
          <Sparkline tone="green" />
        </div>

        {/* ── Radar rings + core ── */}
        <div className="dcc-hud">
          <div className="dcc-ring dcc-ring--outer" />
          <div className="dcc-ring dcc-ring--mid" />
          <div className="dcc-ring dcc-ring--inner" />
          <div className="dcc-arc dcc-arc--one" />
          <div className="dcc-arc dcc-arc--two" />
          <div className="dcc-arc dcc-arc--three" />
          <div className="dcc-radar" />
          <div className="dcc-crosshair dcc-crosshair--h" />
          <div className="dcc-crosshair dcc-crosshair--v" />

          <div className="dcc-core">
            <span className="dcc-core-glow" />
            <span className="dcc-core-pulse" />
            <span className="dcc-core-center" />
            <small>AI CORE</small>
          </div>
        </div>

        {/* ── Connector lines (node → core) ── */}
        <svg className="dcc-links" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid meet">
          {orbitNodes.map((n, i) => {
            const g = nodeGeometry(i);
            return (
              <path
                key={n.label}
                id={`dcc-link-${i}`}
                className={`dcc-link dcc-link--${n.tone}`}
                d={g.d}
                fill="none"
              />
            );
          })}
          {orbitNodes.map((n, i) => (
            <circle
              key={`packet-${n.label}`}
              className={`dcc-packet dcc-packet--${n.tone}`}
              data-link={i}
              r="3.4"
            />
          ))}
        </svg>

        {/* ── Static hex nodes ── */}
        <div className="dcc-orbit">
          {orbitNodes.map((n, i) => {
            const g = nodeGeometry(i);
            const Icon = n.Icon;
            return (
              <div
                key={n.label}
                className={`dcc-node dcc-node--${n.tone}`}
                style={{
                  left: `calc(50% + var(--node-r) * ${g.cos.toFixed(4)})`,
                  top: `calc(50% + var(--node-r) * ${g.sin.toFixed(4)})`,
                }}
              >
                <div className="dcc-node-inner">
                  <div className="dcc-node-badge">
                    <Icon size={22} />
                  </div>
                  <span className="dcc-node-label">{n.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const mainRef = useRef(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileMotion =
      window.matchMedia("(max-width: 767px)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    let typewriterTimer;

    /* ── Typewriter for console ── */
    const consoleLine = root.querySelector(".console-text");
    if (consoleLine && !reduceMotion) {
      const text = consoleLine.dataset.text || "";
      consoleLine.textContent = "";
      let i = 0;
      const tick = () => {
        if (i <= text.length) {
          consoleLine.textContent = text.slice(0, i);
          i++;
          typewriterTimer = setTimeout(tick, 42);
        }
      };
      typewriterTimer = setTimeout(tick, 320);
    }

    const context = gsap.context(() => {
      if (!reduceMotion) {
        /* ── Hero reveal ── */
        gsap.set(".hero-reveal", { opacity: 0, y: 40 });
        gsap.to(".hero-reveal", {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.09,
          ease: "power4.out",
          delay: 0.1,
        });

        /* ── Grid plane drift ── */
        gsap.to(".grid-plane", {
          backgroundPosition: "80px 80px",
          duration: 6,
          repeat: -1,
          ease: "none",
        });

        gsap.set(".dcc-info-card, .dcc-side-card, .dcc-terminal-card, .dcc-node, .dcc-boot", {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });

        if (!isMobileMotion) {
          /* ── HUD cards entrance ── */
          gsap.set(".dcc-info-card, .dcc-side-card, .dcc-terminal-card", { opacity: 0, y: 12 });
          gsap.to(".dcc-info-card, .dcc-side-card, .dcc-terminal-card", {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.5,
          });

          /* ── Static node pop-in + gentle bob ── */
          gsap.set(".dcc-node", { opacity: 0, scale: 0.5 });
          gsap.to(".dcc-node", {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(1.7)",
            delay: 0.7,
          });
          gsap.to(".dcc-node-inner", {
            y: "+=7",
            duration: 3,
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.4, from: "random" },
            ease: "sine.inOut",
          });

          /* ── Connector flow + data packets ── */
          gsap.to(".dcc-link", {
            strokeDashoffset: -14,
            duration: 0.9,
            repeat: -1,
            ease: "none",
          });
          gsap.utils.toArray(".dcc-packet").forEach((packet) => {
            const i = packet.dataset.link;
            gsap.set(packet, { opacity: 0.9 });
            gsap.to(packet, {
              motionPath: {
                path: `#dcc-link-${i}`,
                align: `#dcc-link-${i}`,
                alignOrigin: [0.5, 0.5],
              },
              duration: 2.4 + Number(i) * 0.18,
              repeat: -1,
              ease: "none",
              delay: Number(i) * 0.35,
            });
          });

          /* ── Sparklines draw in ── */
          gsap.from(".dcc-spark-line", {
            drawSVG: 0,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.25,
            delay: 1,
          });

          /* ── Terminal boot sequence ── */
          gsap.set(".dcc-boot", { opacity: 0, x: -8 });
          gsap.to(".dcc-boot", {
            opacity: 1,
            x: 0,
            duration: 0.32,
            stagger: 0.22,
            ease: "power2.out",
            delay: 0.9,
          });

          /* ── Scan sweep + core pulse ── */
          gsap.to(".dcc-scan", { yPercent: 125, duration: 2.1, repeat: -1, ease: "none" });
          gsap.to(".dcc-core", { scale: 1.09, duration: 1.35, repeat: -1, yoyo: true, ease: "sine.inOut" });
          gsap.to(".dcc-core-center", { scale: 1.42, opacity: 0.62, duration: 0.9, repeat: -1, yoyo: true, ease: "sine.inOut" });
          gsap.to(".dcc-core-glow", { scale: 1.18, opacity: 0.72, duration: 1.6, repeat: -1, yoyo: true, ease: "sine.inOut" });

          /* ── Rings + arcs + radar ── */
          gsap.to(".dcc-ring--outer", { rotate: 360, duration: 40, repeat: -1, ease: "none" });
          gsap.to(".dcc-ring--mid", { rotate: -360, duration: 32, repeat: -1, ease: "none" });
          gsap.to(".dcc-ring--inner", { rotate: 360, duration: 24, repeat: -1, ease: "none" });
          gsap.to(".dcc-arc--one", { rotate: 360, duration: 15, repeat: -1, ease: "none" });
          gsap.to(".dcc-arc--two", { rotate: -360, duration: 18, repeat: -1, ease: "none" });
          gsap.to(".dcc-arc--three", { rotate: 360, duration: 22, repeat: -1, ease: "none" });
          gsap.to(".dcc-radar", { rotate: 360, duration: 2.8, repeat: -1, ease: "none" });
          gsap.to(".dcc-crosshair", { rotate: -360, duration: 70, repeat: -1, ease: "none" });

          /* ── Data-stream bars ── */
          gsap.to(".dcc-bar-chart i", {
            scaleY: 0.38,
            transformOrigin: "bottom center",
            duration: 0.65,
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.07, repeat: -1, yoyo: true },
            ease: "sine.inOut",
          });

          /* ── Background grid drift ── */
          gsap.to(".dcc-grid", {
            backgroundPosition: "34px 34px, 34px 34px, 112px 112px, 0 0",
            duration: 5,
            repeat: -1,
            ease: "none",
          });
        }

        /* ── Generic section reveals ── */
        gsap.utils.toArray(".empire-reveal").forEach((item) => {
          gsap.set(item, { opacity: 0, y: 44 });
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 84%" },
          });
        });

        /* ── Case card staggered reveal ── */
        gsap.utils.toArray(".case-card").forEach((card, i) => {
          gsap.set(card, { opacity: 0, y: 60 });
          gsap.to(card, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            delay: (i % 2) * 0.1,
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });

        /* ── Bento cards reveal ── */
        gsap.set(".bento-card", { opacity: 0, y: 40 });
        gsap.to(".bento-card", {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: ".bento-grid", start: "top 82%" },
        });

        /* ── Testimonial cards reveal ── */
        gsap.set(".tcard", { opacity: 0, y: 40 });
        gsap.to(".tcard", {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".testimonials-grid", start: "top 84%" },
        });

        /* ── Terminal rows ── */
        gsap.set(".terminal-row", { opacity: 0, x: -28 });
        gsap.to(".terminal-row", {
          x: 0,
          opacity: 1,
          duration: 0.48,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".terminal-window", start: "top 80%" },
        });

        /* ── Stat counters ── */
        root.querySelectorAll(".stat-item[data-target]").forEach((tile) => {
          const target = parseFloat(tile.dataset.target);
          const suffix = tile.dataset.suffix || "";
          const el = tile.querySelector(".stat-num");
          if (!el || Number.isNaN(target)) return;
          const counter = { val: 0 };
          el.textContent = "0" + suffix;
          gsap.to(counter, {
            val: target,
            duration: 1.5,
            ease: "power2.out",
            scrollTrigger: { trigger: tile, start: "top 88%" },
            onUpdate() {
              el.textContent = Math.round(counter.val) + suffix;
            },
          });
        });
      }
    }, root);

    /* ── Magnetic buttons ── */
    const magneticItems = Array.from(root.querySelectorAll(".magnetic-zone"));

    const onMove = (e) => {
      magneticItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        if (!inside) return;
        gsap.to(item, {
          x: (e.clientX - rect.left - rect.width / 2) * 0.26,
          y: (e.clientY - rect.top - rect.height / 2) * 0.26,
          duration: 0.24,
          ease: "power3.out",
        });
      });
    };

    const onLeave = () => {
      gsap.to(magneticItems, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "elastic.out(1, 0.38)",
      });
    };

    const onPointer = (e) => {
      root.style.setProperty("--cursor-x", `${e.clientX}px`);
      root.style.setProperty("--cursor-y", `${e.clientY}px`);
    };

    if (!isMobileMotion) {
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseleave", onLeave);
      window.addEventListener("pointermove", onPointer);
    }

    return () => {
      if (typewriterTimer) clearTimeout(typewriterTimer);
      context.revert();
      if (!isMobileMotion) {
        root.removeEventListener("mousemove", onMove);
        root.removeEventListener("mouseleave", onLeave);
        window.removeEventListener("pointermove", onPointer);
      }
    };
  }, []);

  return (
    <main ref={mainRef} className="site-shell empire-home">
      <div className="cursor-glow" aria-hidden="true" />
      <div className="grid-plane" aria-hidden="true" />
      <div className="noise-layer" aria-hidden="true" />

      <Header />

      {/* ── HERO ── */}
      <section className="empire-hero" aria-label="UMV Digital Solutions">
        <div className="hero-copy-empire">
          <div className="hero-console hero-reveal">
            <span className="console-dot" />
            <span
              className="console-text"
              data-text="UMV DIGITAL SOLUTIONS"
            />
          </div>

          <h1 className="hero-reveal">
            We engineer
            <br />
            <em className="hero-gold">digital empires</em>
            <br />
            with code &amp; <span className="hero-mobile-break">craft.</span>
          </h1>

          <p className="hero-reveal">
            Websites, software and growth systems that attract, engage and
            convert — built to scale your business.
          </p>

          <div className="hero-signal-grid hero-reveal">
            {heroSignals.map((signal) => (
              <span key={signal}>
                <Sparkles size={14} />
                {signal}
              </span>
            ))}
          </div>

          <div className="hero-actions hero-reveal">
            <MagneticLink href="/work">Explore our work</MagneticLink>
            <MagneticLink href="/contact" variant="ghost">
              Start a project
            </MagneticLink>
          </div>

          <div className="hero-stats hero-reveal" aria-label="Key metrics">
            <span className="hero-stats-label">Trusted by growing brands</span>
            {heroTrustStats.map(([value, label]) => (
              <div className="hero-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <DigitalCommandCore />
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-stack" aria-label="Service areas">
        <div className="service-marquee marquee-fwd">
          <div>
            {[...marqueeServices, ...marqueeServices].map((s, i) => (
              <span key={`${s}-${i}`}>
                <Zap size={16} /> {s}
              </span>
            ))}
          </div>
        </div>
        <div className="service-marquee marquee-rev">
          <div>
            {[...marqueeServices2, ...marqueeServices2].map((s, i) => (
              <span key={`${s}-${i}`}>
                <Zap size={16} /> {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PORTFOLIO ── */}
      <section className="portfolio-v2" aria-label="Selected digital builds">
        <div className="pv2-header empire-reveal">
          <span className="empire-kicker">
            <Sparkles size={14} /> Selected Digital Builds
          </span>
          <h2>
            Work that speaks{" "}
            <em className="hero-gold">for itself.</em>
          </h2>
          <p>
            Premium case studies built with strategy, craft and conversion logic.
          </p>
        </div>

        <div className="case-grid">
          {caseStudies.map(({ name, category, image, desc }) => (
            <article className="case-card" key={name}>
              <div className="case-card-img" style={{ position: "absolute", inset: 0 }}>
                <Image
                  src={image}
                  alt={`${name} website screenshot`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <span className="case-badge">{category}</span>
              <div className="case-card-overlay">
                <h3>{name}</h3>
                <p>{desc}</p>
              </div>
              <a href="/work" className="case-arrow" aria-label={`View ${name} project`}>
                <ArrowUpRight size={18} />
              </a>
            </article>
          ))}
        </div>

        <div className="pv2-cta empire-reveal">
          <MagneticLink href="/work" variant="ghost">
            View all work
          </MagneticLink>
        </div>
      </section>

      {/* ── SERVICES BENTO ── */}
      <section className="bento-section" aria-label="Service ecosystem">
        <div className="bento-header empire-reveal">
          <span className="empire-kicker">
            <Zap size={14} /> Service ecosystem
          </span>
          <h2>
            One command center.{" "}
            <em className="hero-gold">Six growth engines.</em>
          </h2>
          <p>
            Each service orbits the same strategic core: authority, conversion
            and future-ready execution.
          </p>
        </div>

        <div className="bento-grid">
          {bentoServices.map(([label, Icon, copy], i) => (
            <div className={`bento-card bento-card--${i}`} key={label}>
              <div className="bento-icon">
                <Icon size={22} />
              </div>
              <h3>{label}</h3>
              <p>{copy}</p>
              <div className="bento-hover-glow" aria-hidden="true" />
            </div>
          ))}
        </div>
      </section>

      {/* ── TERMINAL PROCESS ── */}
      <section className="terminal-section" aria-label="Our process">
        <div className="terminal-window empire-reveal">
          <div className="terminal-top">
            <span />
            <span />
            <span />
            <strong>umv/process.exec</strong>
          </div>
          {processCommands.map(([command, result], i) => (
            <div className="terminal-row" key={command}>
              <code>
                <b>$</b> {command} <em>--phase={i + 1}</em>
              </code>
              <p>{result}</p>
            </div>
          ))}
          <div className="terminal-complete">
            <BadgeCheck size={18} /> build_ready: <strong>true</strong>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-empire" aria-label="Agency stats">
        <div className="stats-empire-header empire-reveal">
          <span className="empire-kicker">
            <LineChart size={14} /> By the numbers
          </span>
          <h2>
            Numbers that <em className="hero-gold">matter.</em>
          </h2>
        </div>
        <div className="stats-empire-grid">
          {[
            ["42", "+", "Digital launches"],
            ["12", "", "Service engines"],
            ["98", "%", "Speed discipline"],
          ].map(([val, suffix, label]) => (
            <div
              className="stat-item"
              key={label}
              data-target={val}
              data-suffix={suffix}
            >
              <strong className="stat-num">
                {val}
                {suffix}
              </strong>
              <span>{label}</span>
            </div>
          ))}
          <div className="stat-item">
            <strong className="stat-num">24/7</strong>
            <span>System mindset</span>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section" aria-label="Client testimonials">
        <div className="testimonials-header empire-reveal">
          <span className="empire-kicker">
            <Globe2 size={14} /> Client signal
          </span>
          <h2>
            What clients <em className="hero-gold">say.</em>
          </h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(({ quote, name, company }) => (
            <blockquote className="tcard" key={name}>
              <Quote size={22} className="tcard-icon" aria-hidden="true" />
              <p>&ldquo;{quote}&rdquo;</p>
              <footer>
                <strong>{name}</strong>
                <span>{company}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta" aria-label="Final call to action">
        <div className="cta-beam empire-reveal">
          <div className="cta-scan" aria-hidden="true" />
          <span>
            <Terminal size={16} /> ready_for_next_command
          </span>
          <h2>Stop looking like everyone else&apos;s website.</h2>
          <p>
            We will build the digital headquarters your clients remember, trust
            and return to.
          </p>
          <MagneticLink href="/contact">Launch the empire</MagneticLink>
        </div>
      </section>

      <footer className="empire-footer">
        <Logo />
        <p>
          UMV Digital Solutions — creative technology studio building premium
          digital presence, business software and growth infrastructure for
          ambitious brands.
        </p>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="/work">Work</a>
          <a href="/services">Services</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
        <small>© 2026 UMV Digital Solutions. Authority. Craft. Growth.</small>
      </footer>
    </main>
  );
}
