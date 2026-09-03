import { useState } from "react";
import { Building2 } from "lucide-react";

import { SKILLS } from "../data/skills.js";
import { OPPORTUNITIES } from "../data/opportunities.js";
import { LEARNING_PROGRAMS } from "../data/programs.js";
import { CANDIDATES } from "../data/candidates.js";
import { skillById, matchScore } from "../utils/matching.js";

import DashboardShell from "../components/DashboardShell.jsx";
import SectionIntro from "../components/ui/SectionIntro.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Badge from "../components/ui/Badge.jsx";
import MatchPill from "../components/ui/MatchPill.jsx";
import Field from "../components/ui/Field.jsx";

export default function IndustryApp({ user, onLogout }) {
  const ORG = user.name;
  const [tab, setTab] = useState("postings");
  const [postings, setPostings] = useState(OPPORTUNITIES);
  const [programs, setPrograms] = useState(LEARNING_PROGRAMS);
  const [selected, setSelected] = useState(null);
  const [shortlisted, setShortlisted] = useState({});
  const [form, setForm] = useState({ title: "", type: "Internship", location: "", duration: "", stipend: "", cat: "pharma", level: 70, desc: "" });
  const [pform, setPform] = useState({ title: "", cat: "pharma", format: "" });

  const mine = postings.filter((p) => p.org === ORG);

  function submitPosting(e) {
    e.preventDefault();
    if (!form.title) return;
    setPostings([
      {
        id: `op-${Date.now()}`,
        org: ORG,
        title: form.title,
        type: form.type,
        location: form.location || "Lucknow, UP",
        duration: form.duration || "8 weeks",
        stipend: form.stipend || "Unpaid",
        skills: [{ cat: form.cat, level: Number(form.level) }],
        desc: form.desc || "Details to be shared with shortlisted candidates.",
      },
      ...postings,
    ]);
    setForm({ title: "", type: "Internship", location: "", duration: "", stipend: "", cat: "pharma", level: 70, desc: "" });
    setTab("postings");
  }

  function submitProgram(e) {
    e.preventDefault();
    if (!pform.title) return;
    setPrograms([{ id: `lp-${Date.now()}`, org: ORG, title: pform.title, cat: pform.cat, format: pform.format || "Self-paced" }, ...programs]);
    setPform({ title: "", cat: "pharma", format: "" });
  }

  function toggleShortlist(postId, candId) {
    setShortlisted((prev) => {
      const set = new Set(prev[postId] || []);
      set.has(candId) ? set.delete(candId) : set.add(candId);
      return { ...prev, [postId]: set };
    });
  }

  const tabs = [
    { id: "postings", label: `My postings (${mine.length})` },
    { id: "post", label: "Post an opportunity" },
    { id: "matches", label: "Candidate matches" },
    { id: "programs", label: "Learning programs" },
  ];

  return (
    <DashboardShell roleLabel={`Industry · ${ORG}`} roleIcon={Building2} onLogout={onLogout} tabs={tabs} active={tab} setActive={setTab}>
      {tab === "postings" && (
        <div>
          <SectionIntro title="Your postings" sub="Internships, apprenticeships and jobs you've published to the portal." />
          {mine.length === 0 && <EmptyState text="You haven't posted anything yet." action={() => setTab("post")} actionLabel="Post an opportunity" />}
          <div className="grid gap-4">
            {mine.map((o) => (
              <div key={o.id} className="as-card p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{o.title}</span>
                    <Badge tone="teal">{o.type}</Badge>
                  </div>
                  <div className="as-muted text-sm mt-1">Requires: {o.skills.map((s) => skillById(s.cat).short).join(", ")}</div>
                </div>
                <button onClick={() => { setSelected(o.id); setTab("matches"); }} className="as-btn-outline px-4 py-2 text-sm">
                  View candidate matches
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "post" && (
        <div className="max-w-lg">
          <SectionIntro title="Post an opportunity" sub="Describe the role and the skills required — students will see a match score against their profile." />
          <form onSubmit={submitPosting} className="as-card p-6 flex flex-col gap-4">
            <Field label="Title">
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Formulation Lab Intern" className="as-btn-outline w-full px-3 py-2 text-sm" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Type">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="as-btn-outline w-full px-3 py-2 text-sm">
                  {["Internship", "Apprenticeship", "Job"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>
              <Field label="Duration">
                <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 8 weeks" className="as-btn-outline w-full px-3 py-2 text-sm" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Location">
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Lucknow, UP" className="as-btn-outline w-full px-3 py-2 text-sm" />
              </Field>
              <Field label="Stipend / CTC">
                <input value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} placeholder="e.g. ₹9,000/month" className="as-btn-outline w-full px-3 py-2 text-sm" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Primary skill required">
                <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} className="as-btn-outline w-full px-3 py-2 text-sm">
                  {SKILLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
              <Field label={`Minimum level (${form.level})`}>
                <input type="range" min="30" max="100" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full" />
              </Field>
            </div>
            <Field label="Description">
              <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} rows={3} placeholder="What will the candidate work on?" className="as-btn-outline w-full px-3 py-2 text-sm" />
            </Field>
            <button type="submit" className="as-btn-primary px-5 py-2.5 text-sm font-medium self-start">Publish opportunity</button>
          </form>
        </div>
      )}

      {tab === "matches" && (
        <div>
          <SectionIntro title="Candidate matches" sub="Students ranked by how closely their skill profile fits the posting's requirements." />
          <div className="flex flex-wrap gap-2 mb-6">
            {mine.map((o) => (
              <button key={o.id} onClick={() => setSelected(o.id)} className={`as-tab ${selected === o.id ? "active" : ""} text-sm pb-2 px-1`}>
                {o.title}
              </button>
            ))}
          </div>
          {!selected && <EmptyState text="Choose one of your postings above to see ranked candidates." />}
          {selected &&
            (() => {
              const post = postings.find((p) => p.id === selected);
              const ranked = [...CANDIDATES].sort((a, b) => matchScore(post.skills, b.scores) - matchScore(post.skills, a.scores));
              const shortSet = shortlisted[selected] || new Set();
              return (
                <div className="grid gap-3">
                  {ranked.map((c) => (
                    <div key={c.id} className="as-card p-4 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {c.name} <MatchPill pct={matchScore(post.skills, c.scores)} />
                        </div>
                        <div className="as-muted text-sm">{c.college}</div>
                      </div>
                      <button onClick={() => toggleShortlist(selected, c.id)} className={shortSet.has(c.id) ? "as-btn-primary px-4 py-1.5 text-xs" : "as-btn-outline px-4 py-1.5 text-xs"}>
                        {shortSet.has(c.id) ? "Shortlisted" : "Shortlist"}
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
        </div>
      )}

      {tab === "programs" && (
        <div>
          <SectionIntro title="Learning programs" sub="Publish training, certifications and mentorship so students can close skill gaps before they apply." />
          <div className="grid md:grid-cols-2 gap-8">
            <div className="grid gap-3 content-start">
              {programs.filter((p) => p.org === ORG).map((p) => (
                <div key={p.id} className="as-card p-4">
                  <div className="font-medium text-sm">{p.title}</div>
                  <div className="as-muted text-xs mt-1">{p.format}</div>
                  <Badge tone="accent">{skillById(p.cat).short}</Badge>
                </div>
              ))}
            </div>
            <form onSubmit={submitProgram} className="as-card p-6 flex flex-col gap-4 h-fit">
              <div className="font-semibold text-sm mb-1">Publish a new program</div>
              <Field label="Title">
                <input value={pform.title} onChange={(e) => setPform({ ...pform, title: e.target.value })} className="as-btn-outline w-full px-3 py-2 text-sm" />
              </Field>
              <Field label="Skill it targets">
                <select value={pform.cat} onChange={(e) => setPform({ ...pform, cat: e.target.value })} className="as-btn-outline w-full px-3 py-2 text-sm">
                  {SKILLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
              <Field label="Format">
                <input value={pform.format} onChange={(e) => setPform({ ...pform, format: e.target.value })} placeholder="e.g. Certificate · 3 weeks, online" className="as-btn-outline w-full px-3 py-2 text-sm" />
              </Field>
              <button type="submit" className="as-btn-primary px-5 py-2.5 text-sm font-medium self-start">Publish program</button>
            </form>
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
