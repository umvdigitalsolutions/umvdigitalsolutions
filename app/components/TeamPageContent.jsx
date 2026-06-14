import Image from "next/image";
import { ArrowRight, BriefcaseBusiness, Code2, Layers3, Megaphone, UserRound } from "lucide-react";

const leadership = [
  {
    name: "Umaid Kishan",
    prefix: "Mr.",
    role: "Founder & Director",
    bio: "A retired banker with vast professional experience, Mr. Umaid Kishan brings deep financial acumen, disciplined leadership and a strong business mindset to UMV Digital Solutions — ensuring every project is run with clarity, trust and long-term vision.",
    Icon: BriefcaseBusiness,
    accent: "var(--blue)",
    index: "01",
    photo: "/umk2.png",
  },
  {
    name: "Teja Ram",
    prefix: "Mr.",
    role: "Director",
    bio: "Co-directs operations and ensures every project is delivered with precision, clarity and a strong alignment to client goals across all verticals.",
    Icon: BriefcaseBusiness,
    accent: "var(--purple)",
    index: "02",
    photo: "/teja.png",
  },
];

const team = [
  {
    name: "Govardhan",
    prefix: "Mr.",
    role: "Software Developer",
    bio: "Builds robust, scalable software and back-end systems that power UMV's digital products, automation workflows and custom client solutions.",
    Icon: Code2,
    accent: "var(--green)",
    index: "03",
    photo: "/govardhan.png",
  },
  {
    name: "Aditya",
    prefix: "Mr.",
    role: "Full Stack Developer",
    bio: "Crafts end-to-end web experiences, handling everything from pixel-perfect front-end interfaces to reliable back-end architecture and API integrations.",
    Icon: Layers3,
    accent: "var(--gold)",
    index: "04",
    photo: "/adi.png",
  },
  {
    name: "Piyush",
    prefix: "Mr.",
    role: "Digital Marketing",
    bio: "Drives visibility, engagement and growth through result-driven digital campaigns, SEO strategies, social media and content that connects brands with their audience.",
    Icon: Megaphone,
    accent: "var(--green)",
    index: "05",
    photo: "/pisu.png",
  },
];

function MemberCard({ name, prefix, role, bio, Icon, accent, index, photo, imgFit = "cover", imgPosition = "center top" }) {
  return (
    <article className="team-card" style={{ "--tc-accent": accent }}>
      <div className="team-card-photo-wrap">
        {photo ? (
          <Image
            src={photo}
            alt={`${prefix} ${name}`}
            fill
            sizes="320px"
            className="team-card-photo"
            style={{ objectFit: imgFit, objectPosition: imgPosition }}
          />
        ) : (
          <div className="team-card-no-photo" aria-hidden="true">
            <UserRound />
          </div>
        )}
        <span className="team-card-index">{index}</span>
      </div>
      <div className="team-card-body">
        <div className="team-card-role-row">
          <span className="team-card-icon"><Icon /></span>
          <span className="team-card-role">{role}</span>
        </div>
        <strong className="team-card-name">{prefix} {name}</strong>
        <p>{bio}</p>
      </div>
    </article>
  );
}

export default function TeamPageContent() {
  return (
    <section className="section team-detail">
      <div className="team-hero">
        <span className="about-kicker">Our People</span>
        <h1>
          The Team <em>Behind</em> UMV
        </h1>
        <p>
          A focused group of builders, strategists and creatives working together to deliver premium digital solutions for
          growing businesses across India and beyond.
        </p>
      </div>

      <div className="team-leadership-wrap">
        <span className="about-kicker">Leadership</span>
        <div className="team-leadership-grid">
          {leadership.map((member) => (
            <MemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>

      <div className="team-members-wrap">
        <span className="about-kicker">The Team</span>
        <div className="team-grid">
          {team.map((member) => (
            <MemberCard key={member.name} {...member} />
          ))}
        </div>
      </div>

      <div className="about-cta">
        <div>
          <span className="about-kicker">Work with us</span>
          <h2>Let's build something great together.</h2>
        </div>
        <a href="/contact">Start a Project <ArrowRight /></a>
      </div>
    </section>
  );
}
