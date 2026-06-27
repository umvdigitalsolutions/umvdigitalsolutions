"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { BriefcaseBusiness, CircleDollarSign, Home, Layers3, Menu, Phone, Sparkles, Users, X } from "lucide-react";
import Logo from "./Logo";

const navItems = [
  ["Home", "/", Home],
  ["About", "/about", Sparkles],
  ["Services", "/services", Layers3],
  ["Work", "/work", BriefcaseBusiness],
  ["Team", "/team", Users],
  ["Pricing", "/pricing", CircleDollarSign],
  ["Contact", "/contact", Phone],
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="mobile-header-pill">
        <Logo />
        <button
          className="menu-button"
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <nav className="desktop-header-nav" aria-label="Primary navigation">
        <div className="desktop-logo-slot">
          <Logo />
        </div>
        {navItems.map(([label, href, Icon]) => {
          const active = pathname === href;
          return (
            <a className={active ? "active" : ""} key={label} href={href} aria-label={label} title={label}>
              <Icon />
              {active ? <span>{label}</span> : null}
            </a>
          );
        })}
      </nav>

      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-label="Mobile navigation">
        {navItems.map(([label, href, Icon]) => {
          const active = pathname === href;
          return (
            <a className={active ? "active" : ""} key={label} href={href} onClick={() => setMenuOpen(false)}>
              <Icon />
              {label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
