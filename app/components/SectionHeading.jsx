export default function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading reveal">
      <span>{eyebrow}</span>
      <h2 className="split-heading">{title}</h2>
      {copy ? <p>{copy}</p> : null}
    </div>
  );
}
