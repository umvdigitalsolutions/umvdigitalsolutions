import SectionHeading from "./SectionHeading";

const stats = ["50+ Projects Delivered", "20+ Happy Clients", "10+ Business Niches", "360° Digital Solutions"];

export default function AboutSection() {
  return (
    <section id="about" className="section about-section">
      <SectionHeading
        eyebrow="Who We Are"
        title="Creative Technology For Ambitious Brands"
        copy="UMV Digital Solutions is a creative technology and digital marketing company helping businesses build strong online presence through modern websites, automation, branding, SEO and result-driven digital campaigns."
      />
      <div className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card reveal" key={stat}>
            <strong>{stat.split(" ")[0]}</strong>
            <span>{stat.replace(stat.split(" ")[0], "").trim()}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
