"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./Footer";
import Header from "./Header";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function PageShell({ children }) {
  const shellRef = useRef(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const isWorkPage = pathname === "/work";
      const introTargets = gsap.utils.toArray(
        ".route-shell .section > *:not(.cc-grid):not(.work-toolbar):not(.wg-cta)",
        shellRef.current,
      );

      gsap.from(introTargets, {
        y: 32,
        opacity: 0,
        stagger: 0.08,
        duration: 0.72,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      if (!isWorkPage) {
        gsap.utils.toArray(".route-shell .section article, .route-shell .section form, .route-shell .section aside", shellRef.current).forEach((element) => {
          gsap.from(element, {
            y: 34,
            opacity: 0,
            duration: 0.68,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 86%" },
          });
        });
      }
    },
    { dependencies: [pathname], scope: shellRef },
  );

  return (
    <main ref={shellRef} className="site-shell route-shell">
      <Header />
      {children}
      <Footer />
    </main>
  );
}
