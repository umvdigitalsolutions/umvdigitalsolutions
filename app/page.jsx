"use client";

import { useRef } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Preloader from "./components/Preloader";
import ProcessSection from "./components/ProcessSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhySection from "./components/WhySection";
import useLandingAnimations from "./components/useLandingAnimations";

export default function Home() {
  const mainRef = useRef(null);

  useLandingAnimations(mainRef);

  return (
    <main ref={mainRef} className="site-shell home-shell">
      <Preloader />
      <Header />
      <HeroSection />
      <WhySection />
      <ProcessSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
