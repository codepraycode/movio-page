# Movio Page

The landing page + research survey for **Movio** — a smart campus transportation
management system for the Federal University of Technology, Akure (FUTA) that
combines NFC-based student authentication with real-time GPS shuttle tracking.

This site does two jobs:

1. **Collects needs-assessment data** from FUTA students (cited in Chapter 3 of
   the final-year project report, "Requirements Elicitation").
2. **Captures a waitlist** of students interested in Movio, as early demand
   validation.

> 🎓 Movio is a final year Software Engineering project at FUTA.

---

## Tech stack

| Layer       | Choice                                  |
| ----------- | --------------------------------------- |
| Framework   | React 19 + Vite (Rolldown, React Compiler) |
| Language    | TypeScript                              |
| Styling     | Tailwind CSS v4                         |
| Routing     | React Router                            |
| Backend/DB  | Supabase (Postgres + REST + RLS)        |
| Hosting     | Vercel                                  |
| Tooling     | ESLint + Prettier, pnpm                 |

### Notes on choices (deviations from the original spec)

The original build spec (`CLAUDE.md`) suggested plain JSX, shadcn/ui, and React
Router v6. The actual implementation differs slightly, on purpose:

- **TypeScript instead of plain JS** — the project was scaffolded with the Vite
  React-TS template, and typed survey answers map cleanly to the database columns.
- **Hand-rolled Tailwind components instead of shadcn/ui** — keeps the dependency
  surface small and avoids a non-interactive `shadcn init`. The components in
  `src/components/ui/` (Button, Card, Input, RadioGroup, Progress, Toast, …)
  cover everything the spec needed.
- **React Router 7** — current major; the two-route API used here is identical
  to v6.

Everything the spec asked for — the 15-question multi-step survey, the "Never"
conditional exit, the Q13 max-3 validation, the waitlist with duplicate-email
handling, loading/success/error states — is implemented.

---

## Project structure

```
movio-survey/
├── public/
│   └── favicon.svg
├── src/
│   ├── lib/
│   │   ├── supabase.ts        # Supabase client + helpers
│   │   ├── survey.ts          # Declarative 15-question survey definition + types
│   │   └── utils.ts           # cn() class-name helper
│   ├── components/
│   │   ├── ui/                # Button, Card, Input, Label, Textarea,
│   │   │                      #   OptionGroup (radio/checkbox), Progress, toast
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ProgressBar.tsx    # Survey step indicator
│   │   ├── SurveyQuestion.tsx # Renders one question from the config
│   │   └── WaitlistForm.tsx   # Reused on landing + survey exit/thank-you
│   ├── pages/
│   │   ├── Landing.tsx        # Route: /
│   │   └── Survey.tsx         # Route: /survey
│   ├── App.tsx                # Router + ToastProvider
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind + brand theme
├── supabase/
│   └── schema.sql             # Tables + RLS policies (run in Supabase SQL editor)
├── docs/
│   ├── SUPABASE.md            # Database setup
│   └── DEPLOYMENT.md          # Vercel deployment
├── .env.example               # Copy to .env.local and fill in
├── vercel.json                # SPA rewrites for client-side routing
└── ...config (vite, tsconfig, eslint, prettier, editorconfig)
```

---

## Getting started

Prerequisites: **Node 20+** and **pnpm**.

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local
#   then edit .env.local with your Supabase URL + anon key
#   (Supabase dashboard → Settings → API)

# 3. Set up the database
#   Run supabase/schema.sql in the Supabase SQL editor (see docs/SUPABASE.md)

# 4. Start the dev server
pnpm dev
```

The app runs at <http://localhost:5173>.

### Scripts

| Command         | What it does                                   |
| --------------- | ---------------------------------------------- |
| `pnpm dev`      | Start the Vite dev server                      |
| `pnpm build`    | Type-check (`tsc -b`) and build for production |
| `pnpm preview`  | Preview the production build locally           |
| `pnpm lint`     | Run ESLint                                      |
| `pnpm format`   | Format the codebase with Prettier              |

---

## Environment variables

Defined in `.env.local` (never committed — it's gitignored):

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The same two variables must be added in **Vercel → Project Settings →
Environment Variables** before deploying. See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Code style & editor setup

- **Prettier** owns formatting. Config in `.prettierrc.json`:
  **4-space indent**, single quotes, no semicolons, trailing commas, 100-char
  width, with `prettier-plugin-tailwindcss` to auto-sort Tailwind classes.
- **ESLint** (flat config in `eslint.config.js`) handles code quality and defers
  all formatting to Prettier via `eslint-config-prettier`.
- **`.editorconfig`** enforces 4-space indent / LF endings across editors.
- **VS Code** (`.vscode/settings.json`) is set to **format on save** (and
  auto-save on focus change) using Prettier, plus ESLint auto-fix on save.
  Recommended extensions are in `.vscode/extensions.json` — accept the prompt to
  install Prettier, ESLint, and the Tailwind IntelliSense extensions.

---

## The survey

15 questions across 3 steps, defined declaratively in
[`src/lib/survey.ts`](src/lib/survey.ts) so the questions, types, and database
columns stay in one place. Key behaviours:

- **Multi-step** with a progress bar (Step _x_ of 3).
- **Conditional exit:** selecting "Never — I do not use the shuttle" on Q2 ends
  the survey early with a polite exit screen + inline waitlist form.
- **Q13 max-3 validation:** extra checkboxes are disabled once three are chosen.
- **Per-step required-field validation** before advancing.
- **Thank-you screen** with a copy-the-link share button and a waitlist prompt.

All responses insert into the `survey_responses` table in a single call; export
them as CSV from the Supabase Table Editor for your report.

See [`docs/SUPABASE.md`](docs/SUPABASE.md) for the schema and how the data maps
back into the report.

---

## Deployment

Push to GitHub and import the repo into Vercel — it auto-detects Vite. Add the
two environment variables, deploy, and share the URL. Full steps in
[`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).
