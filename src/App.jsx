import { useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import StudentApp from "./pages/StudentApp.jsx";
import IndustryApp from "./pages/IndustryApp.jsx";
import AcademicianApp from "./pages/AcademicianApp.jsx";
import InstitutionApp from "./pages/InstitutionApp.jsx";
import { getSession, logout } from "./utils/auth.js";

export default function App() {
  // Cached session is read once on load — a returning user who registered
  // or logged in before skips the auth screen entirely.
  const [session, setSession] = useState(() => getSession());

  function handleLogout() {
    logout();
    setSession(null);
  }

  return (
    <div className="as-root">
      {!session && <AuthPage onAuth={setSession} />}
      {session?.role === "student" && <StudentApp user={session} onLogout={handleLogout} />}
      {session?.role === "industry" && <IndustryApp user={session} onLogout={handleLogout} />}
      {session?.role === "academician" && <AcademicianApp user={session} onLogout={handleLogout} />}
      {session?.role === "institution" && <InstitutionApp user={session} onLogout={handleLogout} />}
    </div>
  );
}
