export default function StatCard({ label, value }) {
  return (
    <div className="as-card p-5">
      <div className="as-muted text-xs mb-1.5">{label}</div>
      <div className="as-serif text-3xl font-semibold">{value}</div>
    </div>
  );
}
