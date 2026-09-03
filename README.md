## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. `npm run build` produces a static production build in `dist/`.

## Accounts

There's no separate role picker anymore — role is chosen once, at registration, and locked in
for that account (the register form warns about this and requires an explicit acknowledgement
before it lets you continue). Logging in afterwards takes you straight to that role's dashboard.

Sessions are cached in the browser's `localStorage`, so once you register or log in you stay
signed in across reloads until you click **Log out**. This is a front-end-only demo: accounts and
sessions live only in the current browser (see `src/utils/auth.js` for exactly how, and its notes
on why this must be replaced with real server-side auth and password hashing before handling any
real user's credentials).

## Project structure

```
index.html              Entry HTML, loads fonts + Tailwind (layout utilities only)
src/
  main.jsx              React root
  App.jsx                Routes to the auth screen or the signed-in user's role dashboard
  index.css              Design tokens (colors, type) and shared component classes

  data/                  Static mock content, one file per domain
    roles.js                 The 4 account roles (student/industry/academician/institution)
    skills.js                The 6 skill categories used across every role
    quiz.js                   Skill-assessment questions
    opportunities.js          Internship / apprenticeship / job postings
    programs.js                 Industry-published training & certification programs
    academicOpportunities.js    FDPs, industrial training, research, consultancy for faculty
    candidates.js                 Mock student pool shown to industry for matching
    institution.js                Aggregate analytics for the institution dashboard

  utils/
    auth.js                 Register / log in / cached session, backed by localStorage
    matching.js              Skill-match scoring algorithm + shared constants (application stages)

  components/             Shared, role-agnostic UI
    BridgeMotif.jsx           Decorative SVG used on the auth page
    DashboardShell.jsx        Shared header + tab bar + log-out button for every role dashboard
    ui/
      Badge.jsx, MatchPill.jsx, SectionIntro.jsx, EmptyState.jsx, Field.jsx, StatCard.jsx

  pages/                  One file per screen, each self-contained
    AuthPage.jsx              Combined login / register screen with the role lock-in warning
    StudentApp.jsx             Assessment → skill profile (radar chart) → opportunities → applications → portfolio
    IndustryApp.jsx             Post opportunities → postings → candidate matches → learning programs
    AcademicianApp.jsx           Browse FDPs/research/consultancy → express interest
    InstitutionApp.jsx           Analytics dashboard (readiness, skill gap, trends, top partners)
```

## Notes for extending this into a real system

- **Data layer** — everything in `src/data/` is static mock content today. Swap it for API calls
  (e.g. React Query) against a real backend without touching any page/component code.
- **Matching algorithm** — `src/utils/matching.js` has a single `matchScore()` function; this is
  the natural place to plug in a more sophisticated recommendation engine later.
- **Auth** — `src/utils/auth.js` is a browser-only stand-in. A real deployment needs a server
  that hashes passwords (bcrypt/argon2), issues real sessions/tokens, and lets an admin — not the
  end user — handle the rare legitimate case of a role needing to change.
- **App state persistence** — applications, postings, shortlists and expressed interest are still
  in-memory (`useState`) per page, so they reset on reload even though login itself persists.
  Wiring those to a backend (or to `localStorage` per user, as a quicker interim step) is the
  natural next step.
