import Image from "next/image";
import { clientLogos } from "./siteData";

const logos = Object.entries(clientLogos);

export default function LogoReel() {
  return (
    <div className="logo-reel-wrapper">
      <div className="logo-reel-inner">
        <div className="logo-reel-heading">
          <span>Clients</span>
          <h2>Our Notable Clients</h2>
          <p>Brands and businesses that trust UMV Digital Solutions for digital presence, identity and growth.</p>
        </div>
      </div>
      <div className="logo-reel-strip" aria-label="Our clients">
        <div className="logo-reel-track">
          {[...logos, ...logos].map(([name, src], index) => (
            <div key={`${name}-${index}`} className="logo-reel-item">
              <Image
                src={src}
                alt={name}
                width={140}
                height={60}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="logo-reel-bottom" />
    </div>
  );
}
