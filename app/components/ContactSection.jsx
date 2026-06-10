"use client";

import { useState } from "react";
import { Camera, Globe2, Mail, MessageCircle, Send, ShieldCheck, Target, Zap } from "lucide-react";
import SectionHeading from "./SectionHeading";

const instagramUrl = "https://www.instagram.com/umvdigitals/";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", budget: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", phone: "", email: "", service: "", budget: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <SectionHeading
        eyebrow="Contact"
        title="Let's Build Your Next Digital Move"
        copy="Tell us what you want to create and the UMV team will help shape it into a clear plan."
      />
      <div className="contact-grid">
        <form className="contact-form reveal" onSubmit={handleSubmit}>
          <input placeholder="Name" aria-label="Name" required value={form.name} onChange={set("name")} />
          <input placeholder="Phone" aria-label="Phone" value={form.phone} onChange={set("phone")} />
          <input placeholder="Email" type="email" aria-label="Email" required value={form.email} onChange={set("email")} />
          <select aria-label="Service Required" value={form.service} onChange={set("service")}>
            <option>Service Required</option>
            <option>Website Development</option>
            <option>SEO Optimization</option>
            <option>Branding</option>
            <option>Software Development</option>
          </select>
          <select aria-label="Budget Range" value={form.budget} onChange={set("budget")}>
            <option>Budget Range</option>
            <option>Starter</option>
            <option>Growth</option>
            <option>Premium</option>
          </select>
          <textarea placeholder="Message" aria-label="Message" required value={form.message} onChange={set("message")} />

          {status === "success" && (
            <p className="form-feedback form-feedback--ok">Enquiry sent! We&apos;ll be in touch soon.</p>
          )}
          {status === "error" && (
            <p className="form-feedback form-feedback--err">Something went wrong. Please try again or WhatsApp us.</p>
          )}

          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : <>Send Enquiry <Send /></>}
          </button>
        </form>

        <aside className="contact-card reveal">
          <h3>UMV Digital Solutions</h3>
          <p>Code. Create. Convert.</p>
          <a href="mailto:umvdigitalsolutions@gmail.com">
            <Mail /> umvdigitalsolutions@gmail.com
          </a>
          <a
            href="https://wa.me/919967276861?text=Hi%20UMV%20Digital%20Solutions%2C%20I%20want%20to%20start%20a%20project."
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> Chat on WhatsApp
          </a>
          <a href={instagramUrl} target="_blank" rel="noreferrer">
            <Camera /> Follow on Instagram
          </a>
          <div className="contact-icons">
            <Globe2 />
            <ShieldCheck />
            <Zap />
            <Target />
          </div>
        </aside>
      </div>
    </section>
  );
}
