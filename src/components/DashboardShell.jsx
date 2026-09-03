import { LogOut } from "lucide-react";

export default function DashboardShell({ roleLabel, roleIcon: RoleIcon, onLogout, tabs, active, setActive, children }) {
  return (
    <div>
      <div className="as-card">
        <div className="max-w-6xl mx-auto px-6 pt-5">
          <div className="flex items-center gap-3 mb-5">
            <span className="as-serif font-semibold">PathFinder</span>
            <span className="as-hairline flex-1" />
            <div className="flex items-center gap-2 as-muted text-sm">
              <RoleIcon size={16} /> {roleLabel}
            </div>
            <button onClick={onLogout} className="as-btn-outline px-2.5 py-2 flex items-center gap-1.5 text-sm">
              <LogOut size={15} /> Log out
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto as-scroll">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`as-tab ${active === t.id ? "active" : ""} pb-3 text-sm font-medium whitespace-nowrap`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
    </div>
  );
}
