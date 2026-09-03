export default function BridgeMotif() {
  return (
    <svg viewBox="0 0 420 220" className="w-full h-auto">
      <line x1="20" y1="150" x2="400" y2="150" stroke="var(--line)" strokeWidth="2" />
      {[60, 130, 200, 270, 340].map((x, i) => (
        <line key={i} x1={x} y1="150" x2={x} y2={i % 2 === 0 ? "95" : "115"} stroke="var(--teal)" strokeWidth="2" opacity="0.55" />
      ))}
      <path d="M20 150 Q210 40 400 150" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <circle cx="20" cy="150" r="8" fill="var(--ink)" />
      <circle cx="400" cy="150" r="8" fill="var(--ink)" />
      <text x="10" y="180" fontFamily="Fraunces, serif" fontSize="16" fill="var(--ink)">Academia</text>
      <text x="325" y="180" fontFamily="Fraunces, serif" fontSize="16" fill="var(--ink)">Industry</text>
    </svg>
  );
}
