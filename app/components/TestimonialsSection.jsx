"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { testimonials } from "./siteData";

export default function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((item) => (item + 1) % testimonials.length), 4200);
    return () => clearInterval(id);
  }, []);

  const [quote, clientName, role] = testimonials[active];

  return (
    <section className="section testimonials-section">
      <SectionHeading eyebrow="Testimonials" title="What Clients Say" />
      <div className="testimonial-card reveal">
        <Star />
        <Star />
        <Star />
        <Star />
        <Star />
        <p>&ldquo;{quote}&rdquo;</p>
        <div className="testimonial-author">
          <strong>{clientName}</strong>
          <span>{role}</span>
        </div>
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              className={active === index ? "active" : ""}
              key={index}
              onClick={() => setActive(index)}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
