export default function Field({ label, children }) {
  return (
    <label className="block">
      <div className="as-muted text-xs mb-1.5">{label}</div>
      {children}
    </label>
  );
}
