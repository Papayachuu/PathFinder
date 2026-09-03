import Badge from "./Badge.jsx";

export default function MatchPill({ pct }) {
  const tone = pct >= 75 ? "teal" : "accent";
  return <Badge tone={tone}>{pct}% match</Badge>;
}
