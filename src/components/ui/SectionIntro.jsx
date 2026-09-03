export default function SectionIntro({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="as-teal-text text-sm font-medium mb-1">{eyebrow}</div>}
      <h2 className="as-serif text-2xl md:text-3xl font-semibold leading-snug">{title}</h2>
      {sub && <p className="as-muted mt-2 max-w-2xl text-[15px] leading-relaxed">{sub}</p>}
    </div>
  );
}
