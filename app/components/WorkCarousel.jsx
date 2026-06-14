"use client";

import Image from "next/image";

const sites = [
  { name: "Dr. Kamini Physiotherapy", url: "https://www.drkaminiphysiotherapy.com", img: "/drkamini-ss.png" },
  { name: "Globe Guru", url: "https://globeguru.org", img: "/globeguru-ss.png" },
  { name: "Zivaq Pharma", url: "https://zivaqpharma.com", img: "/zivaq-ss.png" },
  { name: "Anay Infinity", url: "https://anayinfinity.com", img: "/anayinfinity-ss.png" },
  { name: "Anay Advisory", url: "https://anayadvisory.com", img: "/anayadvisory-ss.png" },
  { name: "Anay Batteries", url: "https://anaybatteries.com", img: "/anaybatteries-ss.png" },
  { name: "MMN Company", url: "https://mmncompany.com", img: "/mmn-ss.png" },
  { name: "Beyond Gifting", url: "https://beyondgiftings.com", img: "/beyondgifting-ss.png" },
  { name: "Nova Bio Pharma", url: "https://novabiopharma.co.in", img: "/novabiopharma-ss.png" },
];

const doubled = [...sites, ...sites];

export default function WorkCarousel() {
  return (
    <div className="wc-wrapper">
      <div className="wc-inner">
        <div className="wc-label">
          <span className="wc-kicker">Our Work</span>
          <p>Websites we have designed, developed and launched for real businesses.</p>
        </div>
        <div className="wc-strip">
          <div className="wc-track">
            {doubled.map(({ name, url, img }, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="wc-card"
                aria-label={name}
              >
                <div className="wc-img-wrap">
                  <Image src={img} alt={name} fill sizes="320px" className="wc-img" />
                </div>
                <div className="wc-foot">
                  <span className="wc-dot" />
                  <span className="wc-name">{name}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
