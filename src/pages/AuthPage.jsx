import { useState } from "react";
import { LogIn, UserPlus, AlertTriangle } from "lucide-react";

import { ROLES } from "../data/roles.js";
import { register, login } from "../utils/auth.js";
import BridgeMotif from "../components/BridgeMotif.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import Field from "../components/ui/Field.jsx";

export default function AuthPage({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("");
  const [ack, setAck] = useState(false);
  const [error, setError] = useState("");

  function switchMode(next) {
    setMode(next);
    setPassword("");
    setConfirm("");
    setError("");
  }

  function submitLogin(e) {
    e.preventDefault();
    const res = login(name, password);
    if (res.error) { setError(res.error); return; }
    onAuth(res.session);
  }

  function submitRegister(e) {
    e.preventDefault();
    if (password.length < 4) { setError("Password should be at least 4 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (!role) { setError("Choose a role to continue."); return; }
    if (!ack) { setError("Please confirm you understand your role can't be changed later."); return; }
    const res = register(name, password, role);
    if (res.error) { setError(res.error); return; }
    onAuth(res.session);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="as-serif text-xl font-semibold tracking-tight">PathFinder</div>
        <span className="as-hairline flex-1 hidden md:block" />
        <span className="as-muted text-sm hidden md:block">Ministry of Ayush · Academia–Industry Collaboration Portal</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h1 className="as-serif text-4xl md:text-5xl font-semibold leading-[1.1] mb-5">
            One bridge between the classroom and the clinic.
          </h1>
          <p className="as-soft text-lg leading-relaxed max-w-md mb-8">
            PathFinder connects Ayurveda students, faculty and industry so skills learned in
            college translate into internships, placements and real practice.
          </p>
          <BridgeMotif />
        </div>

        <div className="as-card p-6 md:p-8">
          <div className="flex gap-6 mb-6">
            <button onClick={() => switchMode("login")} className={`as-tab ${mode === "login" ? "active" : ""} pb-2 text-sm font-medium flex items-center gap-1.5`}>
              <LogIn size={15} /> Log in
            </button>
            <button onClick={() => switchMode("register")} className={`as-tab ${mode === "register" ? "active" : ""} pb-2 text-sm font-medium flex items-center gap-1.5`}>
              <UserPlus size={15} /> Create account
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={submitLogin} className="flex flex-col gap-4">
              <Field label="Name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="as-btn-outline w-full px-3 py-2 text-sm" placeholder="As you registered" />
              </Field>
              <Field label="Password">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="as-btn-outline w-full px-3 py-2 text-sm" />
              </Field>
              {error && <div className="text-sm" style={{ color: "var(--danger)" }}>{error}</div>}
              <button type="submit" className="as-btn-primary px-5 py-2.5 text-sm font-medium mt-1">Log in</button>
              <div className="as-muted text-xs">You'll stay signed in on this device until you log out.</div>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="flex flex-col gap-4">
              <Field label="Name">
                <input value={name} onChange={(e) => setName(e.target.value)} className="as-btn-outline w-full px-3 py-2 text-sm" placeholder="Your name, or your organisation's name" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Password">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="as-btn-outline w-full px-3 py-2 text-sm" />
                </Field>
                <Field label="Confirm password">
                  <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="as-btn-outline w-full px-3 py-2 text-sm" />
                </Field>
              </div>

              <div>
                <div className="as-muted text-xs mb-1.5">Role</div>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => {
                    const Icon = r.icon;
                    const selected = role === r.id;
                    return (
                      <button
                        type="button"
                        key={r.id}
                        onClick={() => setRole(r.id)}
                        className="as-btn-outline text-left px-3 py-2.5 text-sm flex items-center gap-2"
                        style={selected ? { borderColor: "var(--accent)", background: "var(--accent-soft)" } : {}}
                      >
                        <Icon size={16} /> {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="as-warning p-3 flex gap-2.5 text-sm">
                <AlertTriangle size={17} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Choose carefully — your role is locked in once your account is created and can't be changed later.</span>
              </div>

              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5" />
                <span>I understand I won't be able to change my role after this.</span>
              </label>

              {error && <div className="text-sm" style={{ color: "var(--danger)" }}>{error}</div>}
              <button type="submit" className="as-btn-primary px-5 py-2.5 text-sm font-medium mt-1">Create account</button>
            </form>
          )}
        </div>
      </div>

      <div className="as-hairline my-14" />

      <div>
        <div className="as-muted text-xs uppercase tracking-wide mb-1">How it works</div>
        <h2 className="as-serif text-2xl font-semibold mb-6">From classroom skill to verified placement</h2>
        <HowItWorks />
      </div>
    </div>
  );
}
