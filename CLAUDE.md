# CLAUDE.md — Movio Survey Production Guidelines

## 1. Core Commands
Execute all development operations using `pnpm` (running inside WSL2 environment).

### Development & Verification
- **Start Local Server:** `pnpm dev`
- **Type-Check Project:** `pnpm tsc --noEmit`
- **Lint Codebase:** `pnpm lint`
- **Build Production Asset:** `pnpm build`

### UI & Component Management
- **Initialize shadcn/ui:** `pnpm dlx shadcn@latest init`
- **Add Core Components:** `pnpm dlx shadcn@latest add button card input label textarea radio-group checkbox progress toast badge separator`

---

## 2. Technical Stack & Architecture

### Stack Constraints
- **Frontend:** React 18+ (Vite) + TypeScript (strict mode)
- **Styling:** Tailwind CSS + shadcn/ui (Radix Primitives)
- **Database/Backend:** Supabase JS Client (`@supabase/supabase-js`)
- **State Management:** Local React `useState` (lifted safely across multi-step flows)
- **Routing:** React Router v6 (`/` and `/survey`)

### Directory Structure Requirements
Maintain strict adherence to this structural layout. Notice the migration from `.jsx` to `.tsx`:


```

movio-survey/
├── src/
│   ├── lib/
│   │   └── supabase.ts           # Typed Supabase client instance
│   ├── types/
│   │   └── database.types.ts     # Generated or explicit DB schemas
│   ├── components/
│   │   ├── ui/                   # Auto-managed shadcn directory
│   │   ├── Navbar.tsx            # Static lightweight layout header
│   │   └── ProgressBar.tsx       # Controlled progress tracking element
│   ├── pages/
│   │   ├── Landing.tsx           # Route component for "/"
│   │   └── Survey.tsx            # Route component for "/survey" (Multi-step)
│   ├── App.tsx                   # Declarative routing configurations
│   └── main.tsx                  # StrictMode entry-point hook
├── .env.local                    # Ignored local environment variables

```

---

## 3. Code Style & Implementation Guidelines

### TypeScript & Type Safety
- **Strict Typing:** Avoid `any` at all costs. Declare strict interfaces for form payloads and database schema shapes.
- **Supabase Integration:** Cast DB payload structures safely or use generated schemas when performing inserts:

```typescript
  export interface SurveyResponsePayload {
    study_level: string;
    shuttle_frequency: string;
    wait_time: string;
    arrival_awareness: string;
    late_for_lecture: string;
    full_bus_experience: string;
    change_problem: string;
    satisfaction_score: number | null;
    biggest_problem?: string;
    has_nfc: string;
    live_tracking_usefulness: string;
    tap_to_board_interest: string;
    desired_features: string[];
    app_comfort: string;
    additional_comments?: string;
  }

```

### Code Style Archetype

* **Component Definitions:** Use concise functional components (`export const ComponentName = () => { ... }`).
* **Data Fetching/Mutations:** Explicitly wrap all asynchronous operations tracking Supabase states within `try/catch` wrappers.
* **State Isolation:** Keep layout and operational primitives highly isolated. Avoid bloated re-renders by collocated states where possible.

### UX & Form Submission Rules

* **Optimistic State Execution:** Show loading states immediately (`isSubmitting`) to prevent multiple clicks and redundant data ingestion.
* **Conditional Handling:** Ensure the step sequence cuts off gracefully right after Step 1 if the user provides a negative use case choice on `shuttle_frequency` ("Never").
* **Error Interception:** Parse raw PostgreSQL unique-constraint or validation objects safely before flashing Toast notifications to users.