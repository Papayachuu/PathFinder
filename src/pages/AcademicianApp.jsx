import { useState } from "react";
import { Users } from "lucide-react";

import { ACADEMIC_OPPS } from "../data/academicOpportunities.js";
import DashboardShell from "../components/DashboardShell.jsx";
import SectionIntro from "../components/ui/SectionIntro.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";

export default function AcademicianApp({ user, onLogout }) {
  const [tab, setTab] = useState("opps");
  const [interests, setInterests] = useState(["ac3"]);
  const [filter, setFilter] = useState("All");

  const types = ["All", ...Array.from(new Set(ACADEMIC_OPPS.map((a) => a.type)))];
  const list = filter === "All" ? ACADEMIC_OPPS : ACADEMIC_OPPS.filter((a) => a.type === filter);

  function toggle(id) {
    setInterests((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const tabs = [
    { id: "opps", label: "Opportunities" },
    { id: "interests", label: `My interests (${interests.length})` },
  ];

  return (
    <DashboardShell roleLabel={`Academician · ${user.name}`} roleIcon={Users} onLogout={onLogout} tabs={tabs} active={tab} setActive={setTab}>
      {tab === "opps" && (
        <div>
          <SectionIntro title="Faculty development & collaboration" sub="Industrial training, FDPs, consultancy and joint research from industry partners." />
          <div className="flex gap-2 mb-6 flex-wrap">
            {types.map((t) => (
              <button key={t} onClick={() => setFilter(t)} className={`as-tab ${filter === t ? "active" : ""} text-sm pb-2 px-1`}>
                {t}
              </button>
            ))}
          </div>
          <div className="grid gap-4">
            {list.map((a) => (
              <div key={a.id} className="as-card p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{a.title}</span>
                    <Badge tone="teal">{a.type}</Badge>
                  </div>
                  <div className="as-muted text-sm mt-1">{a.org} · {a.when}</div>
                </div>
                <button onClick={() => toggle(a.id)} className={interests.includes(a.id) ? "as-btn-primary px-4 py-2 text-sm" : "as-btn-outline px-4 py-2 text-sm"}>
                  {interests.includes(a.id) ? "Interested" : "Express interest"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "interests" && (
        <div>
          <SectionIntro title="Your expressed interests" sub="Industry partners will follow up directly on these." />
          {interests.length === 0 && <EmptyState text="You haven't expressed interest in anything yet." action={() => setTab("opps")} actionLabel="Browse opportunities" />}
          <div className="grid gap-4">
            {ACADEMIC_OPPS.filter((a) => interests.includes(a.id)).map((a) => (
              <div key={a.id} className="as-card p-5">
                <div className="font-semibold">{a.title}</div>
                <div className="as-muted text-sm mt-1">{a.org} · {a.when}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
