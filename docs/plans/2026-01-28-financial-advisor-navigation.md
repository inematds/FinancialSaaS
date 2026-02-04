# Navigation & Core Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Transform the single-page dashboard into a multi-page application with a persistent Sidebar navigation.

**Tech Stack:** React Router 6, Lucide React (Icons), Tailwind CSS.

---

### Task 1: Setup Routing and Layout

**Files:**
- Modify: `src/App.tsx` (Setup Routes)
- Create: `src/layouts/DashboardLayout.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/pages/Dashboard.tsx` (Move current Home content here)

**Step 1: Install React Router**
Run: `npm install react-router-dom`

**Step 2: Create Sidebar Component**
Create `src/components/layout/Sidebar.tsx`:
- Fixed left width (e.g., `w-64`).
- Links: Dashboard (Home), Portfolio (PieChart), Plan (Map), Documents (Folder), News (Globe).
- Active state styling (highlight current route).

**Step 3: Create Dashboard Layout**
Create `src/layouts/DashboardLayout.tsx`:
- Wraps children with `<Sidebar />` on left and content area on right.
- Handles responsive toggle (optional/MVP).

**Step 4: Refactor Dashboard Page**
- Move content from `src/App.tsx` to `src/pages/Dashboard.tsx`.
- `App.tsx` will now only contain the `<BrowserRouter>` and `<Routes>`.

### Task 2: Create Page Shells

**Files:**
- Create: `src/pages/Portfolio.tsx`
- Create: `src/pages/FinancialPlan.tsx`
- Create: `src/pages/Documents.tsx`
- Create: `src/pages/MarketNews.tsx`

**Step 1: Create Placeholders**
For each page, create a simple component with a Header and a "Coming Soon" placeholder card.
Example:
```tsx
export default function Portfolio() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Portfolio</h1>
      <div className="bg-surface rounded-xl p-8 border border-white/10">
        <p className="text-gray-400">Holdings and Performance coming soon.</p>
      </div>
    </div>
  )
}
```

**Step 2: Wire up Routes**
Update `src/App.tsx` to import these pages and link them to paths:
- `/` -> Dashboard
- `/portfolio` -> Portfolio
- `/plan` -> FinancialPlan
- `/documents` -> Documents
- `/news` -> MarketNews

### Task 3: Verification
- Run `npm run dev`
- Click all sidebar links.
- Verify URL changes and content updates.
- Verify active state on Sidebar.
