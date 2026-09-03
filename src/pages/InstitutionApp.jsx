import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Landmark } from "lucide-react";

import { DEPT_READINESS, SKILL_GAP, MONTHLY_TREND, TOP_INDUSTRIES } from "../data/institution.js";
import DashboardShell from "../components/DashboardShell.jsx";
import SectionIntro from "../components/ui/SectionIntro.jsx";
import StatCard from "../components/ui/StatCard.jsx";

export default function InstitutionApp({ user, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const tabs = [{ id: "dashboard", label: "Analytics dashboard" }];

  const avgReadiness = Math.round(DEPT_READINESS.reduce((a, b) => a + b.readiness, 0) / DEPT_READINESS.length);

  return (
    <DashboardShell roleLabel={`Institution · ${user.name}`} roleIcon={Landmark} onLogout={onLogout} tabs={tabs} active={tab} setActive={setTab}>
      <SectionIntro title="Cohort overview" sub="Skill readiness, internship participation and placement trends across departments." />

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Average placement readiness" value={`${avgReadiness}%`} />
        <StatCard label="Active internships this term" value="31" />
        <StatCard label="Placements confirmed" value="16" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="as-card p-5">
          <div className="font-semibold text-sm mb-4">Placement readiness by department</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DEPT_READINESS} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="var(--line)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis type="category" dataKey="dept" width={100} tick={{ fontSize: 11, fill: "var(--ink-soft)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderColor: "var(--line)" }} />
              <Bar dataKey="readiness" name="Readiness %" fill="var(--accent)" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="as-card p-5">
          <div className="font-semibold text-sm mb-4">Cohort skill gap vs. industry expectation</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SKILL_GAP}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="skill" tick={{ fontSize: 10, fill: "var(--ink-soft)" }} interval={0} angle={-15} textAnchor="end" height={50} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderColor: "var(--line)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="cohortAvg" name="Cohort average" fill="var(--teal)" barSize={14} />
              <Bar dataKey="industryExpected" name="Industry expected" fill="var(--line)" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="as-card p-5">
          <div className="font-semibold text-sm mb-4">Internships & placements over time</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={MONTHLY_TREND}>
              <CartesianGrid stroke="var(--line)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ink-soft)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderColor: "var(--line)" }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="internships" stroke="var(--accent-dark)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="placements" stroke="var(--teal-dark)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="as-card p-5">
          <div className="font-semibold text-sm mb-4">Top recruiting industry partners</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TOP_INDUSTRIES} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke="var(--line)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "var(--muted)" }} />
              <YAxis type="category" dataKey="org" width={130} tick={{ fontSize: 11, fill: "var(--ink-soft)" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderColor: "var(--line)" }} />
              <Bar dataKey="postings" name="Postings" fill="var(--ink)" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardShell>
  );
}
