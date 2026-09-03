export default function Badge({ children, tone = "accent" }) {
  return <span className={`as-badge-${tone} text-xs font-medium px-2 py-1`}>{children}</span>;
}
