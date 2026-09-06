import React, { useState } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer,
} from "recharts";
import { GraduationCap, CheckCircle2, Circle, Award, MapPin, Clock, Wallet, Search } from "lucide-react";

import { SKILLS } from "../data/skills.js";
import { QUIZ, OPTION_SCORES } from "../data/quiz.js";
import { OPPORTUNITIES } from "../data/opportunities.js";
import { LEARNING_PROGRAMS } from "../data/programs.js";
import { STAGES, skillById, matchScore } from "../utils/matching.js";

import DashboardShell from "../components/DashboardShell.jsx";
import SectionIntro from "../components/ui/SectionIntro.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";
import MatchPill from "../components/ui/MatchPill.jsx";

export default function StudentApp({ user, onLogout }) {
  const [tab, setTab] = useState("assess");
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState(null);
  const [step, setStep] = useState(0);
  const [applications, setApplications] = useState([{ id: "seed1", oppId: "op2", stage: 2 }]);

  // Search + type filter for the "Internships & jobs" tab (UI-only, no data changes)
  const [oppSearch, setOppSearch] = useState("");
  const [oppTypeFilter, setOppTypeFilter] = useState("All");

  const done = Object.keys(answers).length === QUIZ.length;

  function choose(qi, optIdx) {
    const next = { ...answers, [qi]: optIdx };
    setAnswers(next);
    if (step < QUIZ.length - 1) setStep(step + 1);
  }

  function finish(preAnswers) {
    const a = preAnswers || answers;
    const s = {};
    QUIZ.forEach((q, i) => { s[q.cat] = OPTION_SCORES[a[i] ?? 1]; });
    setScores(s);
    setTab("profile");
  }

  function sampleFill() {
    const a = {};
    QUIZ.forEach((q, i) => { a[i] = [2, 3, 1, 2, 3, 1][i]; });
    setAnswers(a);
    setStep(QUIZ.length - 1);
    finish(a);
  }

  function apply(oppId) {
    if (applications.find((x) => x.oppId === oppId)) return;
    setApplications([...applications, { id: `app-${oppId}`, oppId, stage: 0 }]);
  }

  function advance(appId) {
    setApplications(applications.map((a) => (a.id === appId ? { ...a, stage: Math.min(a.stage + 1, STAGES.length - 1) } : a)));
  }

  const gaps = scores ? SKILLS.filter((s) => scores[s.id] < 70) : [];

  // Distinct opportunity types for the filter tabs, plus "All"
  const oppTypes = ["All", ...Array.from(new Set(OPPORTUNITIES.map((o) => o.type)))];

  // Opportunities narrowed by the current search text and type filter
  const filteredOpps = OPPORTUNITIES.filter((o) => {
    const matchesType = oppTypeFilter === "All" || o.type === oppTypeFilter;
    const q = oppSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.title.toLowerCase().includes(q) ||
      o.org.toLowerCase().includes(q) ||
      o.location.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const tabs = [
    { id: "assess", label: "Skill assessment" },
    { id: "profile", label: "Skill profile" },
    { id: "opps", label: "Internships & jobs" },
    { id: "applications", label: `Applications${applications.length ? ` (${applications.length})` : ""}` },
    { id: "portfolio", label: "Digital portfolio" },
  ];

  return (
    <DashboardShell roleLabel={`Student · ${user.name}`} roleIcon={GraduationCap} onLogout={onLogout} tabs={tabs} active={tab} setActive={setTab}>
      {tab === "assess" && (
        <div className="max-w-xl">
          <SectionIntro eyebrow="Step 1" title="Tell us where you stand" sub="Six short questions across the skill areas Ayurveda employers look for. This builds your skill profile and recommendations." />
          {!scores && (
            <>
              <div className="flex gap-1.5 mb-6" aria-hidden="true">
                {QUIZ.map((_, i) => (
                  <span key={i} className="h-1.5 flex-1" style={{ background: i <= step ? "var(--accent)" : "var(--line)" }} />
                ))}
              </div>
              <div className="as-card p-6">
                <div className="as-muted text-sm mb-1">Question {step + 1} of {QUIZ.length}</div>
                <div id="quiz-question" className="font-semibold text-lg mb-5 leading-snug">{QUIZ[step].q}</div>
                <div role="radiogroup" aria-labelledby="quiz-question" className="flex flex-col gap-2.5">
                  {QUIZ[step].options.map((opt, oi) => (
                    <button
                      key={oi}
                      role="radio"
                      aria-checked={answers[step] === oi}
                      onClick={() => choose(step, oi)}
                      className={`as-btn-outline text-left px-4 py-3 text-sm flex items-center justify-between ${answers[step] === oi ? "selected" : ""}`}
                    >
                      {opt}
                      {answers[step] === oi && <CheckCircle2 size={16} className="as-accent-text" />}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-6">
                  <button onClick={sampleFill} className="as-muted text-sm underline underline-offset-4">Try with sample answers</button>
                  {done && <button onClick={() => finish()} className="as-btn-primary px-5 py-2.5 text-sm font-medium">See my skill profile</button>}
                </div>
              </div>
            </>
          )}
          {scores && (
            <div className="as-card p-6 flex items-center justify-between">
              <div>
                <div className="font-semibold">Assessment complete</div>
                <div className="as-muted text-sm mt-1">Your skill profile is ready.</div>
              </div>
              <button onClick={() => setTab("profile")} className="as-btn-primary px-4 py-2.5 text-sm font-medium">View profile</button>
            </div>
          )}
        </div>
      )}

      {tab === "profile" && (
        <div>
          {!scores ? (
            <EmptyState text="Complete the skill assessment first to generate your profile." action={() => setTab("assess")} actionLabel="Take assessment" />
          ) : (
            <>
              <SectionIntro eyebrow="Skill mapping" title="Your skill profile" sub="Compared against the competency level industry postings typically expect." />
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div className="as-card p-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <RadarChart data={SKILLS.map((s) => ({ skill: s.short, you: scores[s.id], expected: 75 }))} outerRadius="72%">
                      <PolarGrid stroke="var(--line)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fill: "var(--ink-soft)", fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 10 }} />
                      <Radar name="You" dataKey="you" stroke="var(--accent-dark)" fill="var(--accent)" fillOpacity={0.35} />
                      <Radar name="Industry expected" dataKey="expected" stroke="var(--teal-dark)" fill="var(--teal)" fillOpacity={0.12} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <div className="font-semibold mb-3">Areas to strengthen</div>
                  {gaps.length === 0 && <div className="as-muted text-sm">No major gaps — you're at or above industry expectation everywhere. Strong work.</div>}
                  <div className="flex flex-col gap-3">
                    {gaps.map((g) => {
                      const prog = LEARNING_PROGRAMS.find((p) => p.cat === g.id);
                      return (
                        <div key={g.id} className="as-card p-4">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{g.label}</div>
                            <span className="as-muted text-xs">{scores[g.id]}/100</span>
                          </div>
                          {prog && (
                            <div className="as-muted text-xs mt-2">
                              Suggested: <span className="as-teal-text font-medium">{prog.title}</span> — {prog.org}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === "opps" && (
        <div>
          <SectionIntro eyebrow="Recommended for you" title="Internships & jobs" sub={scores ? "Ranked by how well your skill profile matches each posting." : "Complete the skill assessment to see your match percentage."} />

          <div className="relative mb-4 max-w-md">
            <Search size={15} className="as-muted" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={oppSearch}
              onChange={(e) => setOppSearch(e.target.value)}
              placeholder="Search by title, organisation or location"
              className="as-btn-outline w-full pl-8 pr-3 py-2 text-sm"
            />
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {oppTypes.map((t) => (
              <button key={t} onClick={() => setOppTypeFilter(t)} className={`as-tab ${oppTypeFilter === t ? "active" : ""} text-sm pb-2 px-1`}>
                {t}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredOpps.length === 0 && (
              <EmptyState
                text="No opportunities match your search or filter."
                action={() => { setOppSearch(""); setOppTypeFilter("All"); }}
                actionLabel="Clear filters"
              />
            )}
            {[...filteredOpps]
              .sort((a, b) => (scores ? matchScore(b.skills, scores) - matchScore(a.skills, scores) : 0))
              .map((o) => {
                const applied = applications.find((a) => a.oppId === o.id);
                return (
                  <div key={o.id} className="as-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{o.title}</span>
                          <Badge tone="teal">{o.type}</Badge>
                          {scores && <MatchPill pct={matchScore(o.skills, scores)} />}
                        </div>
                        <div className="as-muted text-sm mt-1">{o.org}</div>
                        <div className="as-muted text-xs mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1"><MapPin size={12} />{o.location}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{o.duration}</span>
                          <span className="flex items-center gap-1"><Wallet size={12} />{o.stipend}</span>
                        </div>
                        <p className="text-sm mt-3 max-w-xl leading-relaxed">{o.desc}</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {o.skills.map((s) => (
                            <Badge key={s.cat} tone="accent">{skillById(s.cat).short}</Badge>
                          ))}
                        </div>
                      </div>
                      <button
                        disabled={!!applied}
                        onClick={() => apply(o.id)}
                        className={applied ? "as-btn-outline px-4 py-2 text-sm" : "as-btn-primary px-4 py-2 text-sm font-medium"}
                      >
                        {applied ? "Applied" : "Apply now"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {tab === "applications" && (
        <div>
          <SectionIntro title="Track your applications" sub="Follow each application through review, shortlisting and final selection." />
          {applications.length === 0 && <EmptyState text="You haven't applied to anything yet." action={() => setTab("opps")} actionLabel="Browse opportunities" />}
          <div className="flex flex-col gap-4">
            {applications.map((a) => {
              const opp = OPPORTUNITIES.find((o) => o.id === a.oppId);
              return (
                <div key={a.id} className="as-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <div className="font-semibold">{opp.title}</div>
                      <div className="as-muted text-sm">{opp.org}</div>
                    </div>
                    {a.stage < STAGES.length - 1 && (
                      <button onClick={() => advance(a.id)} className="as-btn-outline px-3 py-1.5 text-xs">
                        Simulate progress →
                      </button>
                    )}
                  </div>
                  <div className="flex items-center">
                    {STAGES.map((s, i) => (
                      <React.Fragment key={s}>
                        <div className="flex flex-col items-center gap-1.5">
                          {i <= a.stage ? <CheckCircle2 size={18} className="as-teal-text" /> : <Circle size={18} className="as-muted" />}
                          <span className={`text-xs ${i <= a.stage ? "font-medium" : "as-muted"}`}>{s}</span>
                        </div>
                        {i < STAGES.length - 1 && (
                          <div className="flex-1 h-px mx-2" style={{ background: i < a.stage ? "var(--teal)" : "var(--line)" }} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "portfolio" && (
        <div>
          <SectionIntro eyebrow="Employability" title="Digital portfolio" sub="A single verified record of skills, certifications, projects and internship experience." />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-4">
              <div className="as-card p-5">
                <div className="font-semibold mb-3">Self-assessed skills</div>
                {!scores ? (
                  <div className="as-muted text-sm">Take the skill assessment to populate this section.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SKILLS.map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-3 py-2 as-alt" style={{ border: "1px solid var(--line)" }}>
                        <span className="text-sm">{s.label}</span>
                        <span className="as-accent-text text-sm font-semibold">{scores[s.id]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="as-card p-5">
                <div className="font-semibold mb-3">Certifications & projects</div>
                <div className="flex flex-col gap-3">
                  {[
                    { t: "Certificate in Panchakarma Fundamentals", by: "Rajkiya Ayurveda College", verified: true },
                    { t: "Case study: Dietary management in Amavata", by: "Department of Kayachikitsa", verified: true },
                    { t: "Summer internship, Vaidyashram Wellness Retreats", by: "Vaidyashram Wellness Retreats", verified: false },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{c.t}</div>
                        <div className="as-muted text-xs">{c.by}</div>
                      </div>
                      <Badge tone={c.verified ? "teal" : "accent"}>{c.verified ? "Verified" : "Pending verification"}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="as-card p-5 h-fit">
              <div className="flex items-center gap-2 mb-2">
                <Award size={18} className="as-accent-text" />
                <span className="font-semibold">Readiness score</span>
              </div>
              <div className="as-serif text-4xl font-semibold">
                {scores ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / SKILLS.length) : "—"}
              </div>
              <div className="as-muted text-sm mt-1">out of 100, across all skill areas</div>
            </div>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}