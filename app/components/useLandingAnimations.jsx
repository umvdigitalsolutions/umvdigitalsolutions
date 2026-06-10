"use client";

import { useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function useLandingAnimations(scopeRef) {
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const hasSeenPreloader =
        window.sessionStorage.getItem("umv-preloader-seen") === "true" ||
        window.__umvPreloaderHasPlayed === true;
      const shouldPlayLoader = Boolean(document.querySelector(".preloader")) && !hasSeenPreloader;
      const heroDelay = shouldPlayLoader ? 10.45 : 0.15;
      const visualDelay = shouldPlayLoader ? 10.6 : 0.28;

      const heroItems = gsap.utils.toArray(".hero-copy > *");
      const visualPanel = document.querySelector(".visual-panel");
      const timelineLine = document.querySelector(".timeline-line");

      if (heroItems.length) {
        gsap.from(heroItems, {
          y: 36,
          opacity: 0,
          stagger: 0.12,
          duration: 0.9,
          delay: heroDelay,
          ease: "power3.out",
        });
      }

      if (visualPanel) {
        gsap.from(visualPanel, { y: 42, rotateX: 10, opacity: 0, duration: 1, delay: visualDelay, ease: "power3.out" });
      }

      gsap.utils.toArray(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 44,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 84%" },
        });
      });

      gsap.utils.toArray(".split-heading").forEach((heading) => {
        if (!heading.dataset.splitReady) {
          const words = heading.textContent.trim().split(/\s+/);
          heading.textContent = "";
          words.forEach((word, index) => {
            const span = document.createElement("span");
            span.className = "split-word";
            span.textContent = `${word}${index === words.length - 1 ? "" : " "}`;
            heading.appendChild(span);
          });
          heading.dataset.splitReady = "true";
        }

        gsap.from(heading.querySelectorAll(".split-word"), {
          yPercent: 105,
          rotateX: -18,
          opacity: 0,
          stagger: 0.045,
          duration: 0.78,
          ease: "power4.out",
          scrollTrigger: { trigger: heading, start: "top 86%" },
        });
      });

      if (timelineLine) {
        gsap.from(timelineLine, {
          scaleY: 0,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: { trigger: ".process-timeline", start: "top 70%", end: "bottom 55%", scrub: true },
        });
      }
    },
    { scope: scopeRef },
  );

  useEffect(() => {
    const hero = document.querySelector(".hero");
    const visual = document.querySelector(".visual-panel");
    if (!hero || !visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 22;
      const y = (event.clientY / window.innerHeight - 0.5) * 22;
      gsap.to(".parallax-layer", { x, y, duration: 0.6, ease: "power2.out" });
      gsap.to(visual, { rotateY: x * 0.25, rotateX: -y * 0.18, duration: 0.6, ease: "power2.out" });
    };

    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, []);
}
