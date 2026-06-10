import SectionHeading from "./SectionHeading";
import { processSteps } from "./siteData";

export default function ProcessSection() {
  return (
    <section className="section process-section">
      <SectionHeading
        eyebrow="Process"
        title="From First Call To Launch"
        copy="A transparent workflow that keeps the project moving and the decisions clear."
      />
      <div className="process-timeline">
        <div className="timeline-line" />
        {processSteps.map(([title, copy], index) => (
          <article className="process-step reveal" key={title}>
            <span>Step {index + 1}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
