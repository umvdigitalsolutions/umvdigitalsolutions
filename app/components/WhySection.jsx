"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Code2, Gauge, HandCoins, Palette, Search, ShieldCheck, Smartphone, Target } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { whyCards } from "./siteData";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const accents = ["#11b7ff", "#8d4dff", "#48ffb0", "#f2c76d"];
const icons = [Code2, Search, Gauge, Palette, Smartphone, ShieldCheck, Target, HandCoins];

const descriptions = [
  "Every build is tailored around your brand, goals and customer journey.",
  "Clean structure, local visibility and technical basics built from day one.",
  "Optimized pages, lean assets and smooth interactions across devices.",
  "Modern layouts, premium visuals and flows that feel easy to use.",
  "Responsive experiences that look sharp on mobile, tablet and desktop.",
  "Reliable foundations, safer forms and scalable code for future growth.",
  "Decisions are guided by leads, trust, conversion and business clarity.",
  "Smart packages designed to feel premium without wasting your budget.",
];

export default function WhySection() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(".why-item", {
        opacity: 0,
        y: 50,
        scale: 0.88,
        stagger: { amount: 0.65, from: "random" },
        duration: 0.65,
        ease: "back.out(1.3)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 76%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="why-section section">
      <SectionHeading
        eyebrow="Why Choose UMV Digital Solutions"
        title="Built For Brands That Want Momentum"
        copy="Eight standards we bring to every project, every time."
      />
      <div className="why-grid">
        {whyCards.map((card, index) => {
          const accent = accents[index % accents.length];
          const Icon = icons[index % icons.length];
          return (
            <div
              className="why-item"
              key={card}
              style={{ "--why-accent": accent }}
            >
              <div className="why-topline">
                <span className="why-icon"><Icon /></span>
                <span className="why-num">{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="why-title">{card}</h3>
              <p className="why-desc">{descriptions[index]}</p>
              <div className="why-divider" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
