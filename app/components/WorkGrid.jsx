"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, BadgeCheck, Building2, Layers3, Sparkles } from "lucide-react";
import { clientLogos, projects } from "./siteData";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projectColors = {
  "Globe Guru Holidays": "rgba(17, 183, 255, 0.22)",
  "Dr. Kamini Physiotherapy Clinic": "rgba(72, 255, 176, 0.18)",
  "ZivaQ Pharmaceuticals": "rgba(141, 77, 255, 0.22)",
  "Chai Ki Chuski Cafe": "rgba(242, 199, 109, 0.2)",
  "MM & Co.": "rgba(17, 183, 255, 0.18)",
  "SKY ZENITH": "rgba(141, 77, 255, 0.2)",
  "Lodha's Beyond Giftings": "rgba(242, 199, 109, 0.22)",
  "Anay Advisory": "rgba(72, 255, 176, 0.18)",
  "Nova Biopharma Pvt Ltd": "rgba(72, 255, 176, 0.2)",
  "Anay Infinity": "rgba(17, 183, 255, 0.2)",
  "Anay Batteries": "rgba(242, 199, 109, 0.2)",
  "Black Boots": "rgba(141, 77, 255, 0.22)",
  "RL Associates": "rgba(17, 183, 255, 0.18)",
  "VOWS BOX": "rgba(242, 199, 109, 0.22)",
  "UMV Legal Associates": "rgba(141, 77, 255, 0.2)",
};

const filters = ["All", "Websites", "Landing Pages", "Branding", "Digital Marketing", "Software"];

const stats = [
  ["15+", "Brands served", Building2],
  ["6", "Digital service areas", Layers3],
  ["360°", "Creative + tech support", BadgeCheck],
];

function ClientCard({ name, color, priority = false }) {
  const cardRef = useRef(null);

  const onEnter = () => {
    gsap.to(cardRef.current, { y: -6, scale: 1.025, duration: 0.35, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector(".cc-glow"), { opacity: 1, duration: 0.35 });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(cardRef.current.querySelector(".cc-glow"), { opacity: 0, duration: 0.35 });
  };

  const hasLogo = Boolean(clientLogos[name]);
  const monogram = name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase();

  return (
    <article
      ref={cardRef}
      className="cc"
      style={{ "--cc-accent": color }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="cc-glow" aria-hidden="true" />

      <div className="cc-logo">
        {hasLogo ? (
          <Image
            src={clientLogos[name]}
            alt={`${name} logo`}
            fill
            style={{ objectFit: "contain" }}
            className="cc-logo-img"
            sizes="(max-width: 780px) 45vw, 22vw"
            priority={priority}
          />
        ) : (
          <span className="cc-mono">{monogram}</span>
        )}
      </div>

      <footer className="cc-foot">
        <span className="cc-name">{name}</span>
      </footer>
    </article>
  );
}

export default function WorkGrid() {
  const pageRef = useRef(null);
  const gridRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const filteringRef = useRef(false);
  const filterTweenRef = useRef(null);

  const filteredProjects = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((p) => p[1] === activeFilter)),
    [activeFilter],
  );

  useGSAP(
    () => {
      gsap.from(".wg-hero", {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from(".filter-row button", {
        opacity: 0,
        y: 12,
        stagger: 0.055,
        duration: 0.45,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".wg-stat", {
        opacity: 0,
        y: 18,
        stagger: 0.08,
        duration: 0.55,
        ease: "power3.out",
        delay: 0.22,
      });

      gsap.from(".cc", {
        opacity: 0,
        scale: 0.88,
        y: 28,
        stagger: { amount: 0.55, from: "start" },
        duration: 0.7,
        ease: "back.out(1.3)",
        delay: 0.28,
      });

      gsap.from(".wg-cta", {
        opacity: 0,
        y: 24,
        duration: 0.65,
        ease: "power3.out",
        delay: 0.5,
      });
    },
    { scope: pageRef },
  );

  useEffect(() => {
    if (!filteringRef.current || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".cc");
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, scale: 0.9, y: 24 },
      { opacity: 1, scale: 1, y: 0, stagger: { amount: 0.4 }, duration: 0.55, ease: "back.out(1.2)" },
    );
    filteringRef.current = false;
  }, [filteredProjects]);

  const handleFilter = (filter) => {
    if (filter === activeFilter) return;
    filterTweenRef.current?.kill();
    const cards = gridRef.current?.querySelectorAll(".cc");
    filteringRef.current = true;
    if (cards?.length) {
      filterTweenRef.current = gsap.to(cards, {
        opacity: 0,
        scale: 0.92,
        y: 12,
        stagger: { amount: 0.15 },
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(cards, { clearProps: "opacity,scale,y" });
          setActiveFilter(filter);
        },
      });
    } else {
      setActiveFilter(filter);
    }
  };

  return (
    <section ref={pageRef} id="work" className="section">
      <div className="wg-hero-shell">
        <div className="wg-hero">
          <span className="wg-kicker">
            <Sparkles /> Client Showcase
          </span>
          <h1>
            Brands That Trust <em>UMV Digital</em>
          </h1>
          <p>
            A clean client wall featuring businesses across travel, healthcare, pharma, cafes, legal,
            consulting, gifting and product-led brands.
          </p>
        </div>

        <div className="wg-stats" aria-label="Work highlights">
          {stats.map(([value, label, Icon]) => (
            <article className="wg-stat" key={label}>
              <Icon />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </div>

      <div className="work-toolbar">
        <p>{filteredProjects.length} clients showing</p>
        <div className="filter-row" aria-label="Filter clients">
        {filters.map((f) => (
          <button key={f} className={activeFilter === f ? "active" : ""} onClick={() => handleFilter(f)}>
            {f}
          </button>
        ))}
        </div>
      </div>

      <div ref={gridRef} className="cc-grid">
        {filteredProjects.map(([name], index) => (
          <ClientCard
            key={name}
            name={name}
            color={projectColors[name]}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="wg-cta">
        <div>
          <span>Want to be next?</span>
          <h2>Let&apos;s shape your brand presence with the same care.</h2>
        </div>
        <a href="/contact">
          Start a Project <ArrowRight />
        </a>
      </div>
    </section>
  );
}
