"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { clientLogos, projects } from "./siteData";

const filters = ["All", "Websites", "Landing Pages", "Branding", "Digital Marketing", "Software"];

export default function WorkSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredProjects = useMemo(
    () => (activeFilter === "All" ? projects : projects.filter((project) => project[1] === activeFilter)),
    [activeFilter],
  );

  return (
    <section id="work" className="section">
      <div className="clients-heading reveal">
        <div className="clients-heading-top">
          <span>Clients</span>
          <strong>{projects.length}+ Brands</strong>
        </div>
        <h2>Our <em>Notable</em> Clients</h2>
        <p>Brands, clinics, legal firms, cafes and product companies that trust UMV Digital Solutions to shape their digital presence.</p>
      </div>
      <div className="filter-row reveal">
        {filters.map((filter) => (
          <button className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)} key={filter}>
            {filter}
          </button>
        ))}
      </div>
      <div className="client-list">
        {filteredProjects.map(([name, , description], index) => (
          <article className="client-row reveal" key={name}>
            <div className="client-logo-cell">
              {clientLogos[name] ? (
                <Image src={clientLogos[name]} alt={`${name} logo`} width={180} height={90} />
              ) : (
                <span>{name.split(" ").map((word) => word[0]).join("").slice(0, 3)}</span>
              )}
            </div>
            <div className="client-index">
              <small>Client {String(index + 1).padStart(2, "0")}</small>
            </div>
            <div className="client-main">
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
