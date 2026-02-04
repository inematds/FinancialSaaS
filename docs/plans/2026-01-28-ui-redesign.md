# FinPilot UI Redesign Implementation Plan

## Overview

Transform the current app into a **Cyberpunk Command Center** aesthetic based on the user's HTML reference design. The new design features:
- **Brutalist/Angular styling** with `clip-path` polygons (no rounded corners)
- **Top horizontal navigation** (replacing sidebar)
- **JetBrains Mono + Archivo fonts** for tech/financial feel
- **Neon accent colors** on ultra-dark backgrounds

---

## Design System Tokens

### Colors
```css
--bg-primary: #0a0a0a      // Main background
--bg-secondary: #141414    // Card backgrounds
--bg-tertiary: #1a1a1a     // Nested elements
--accent-green: #00ff88    // Primary accent (positive)
--accent-red: #ff3366      // Negative states
--accent-blue: #00d4ff     // Secondary accent
--accent-yellow: #ffcc00   // Tertiary accent
--text-primary: #ffffff    
--text-secondary: #a0a0a0
--border: #2a2a2a
```

### Typography
- **Archivo** (900, 600, 400, 300) — Headings and body
- **JetBrains Mono** (800, 700, 400) — Numbers, values, code

### Clip Path Patterns
```css
// Top-right cut
clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);

// Bottom-right cut
clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);

// Parallelogram
clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
```

---

## Implementation Tasks

### Phase 1: Design System Setup <!-- priority: high -->

#### Task 1.1: Update Tailwind Config & Global Styles
**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`

**Changes:**
1. Add custom colors to Tailwind config matching the design tokens
2. Import Google Fonts (JetBrains Mono, Archivo)
3. Create utility classes for clip-path patterns
4. Remove all rounded corner defaults

---

#### Task 1.2: Create Reusable Card Component
**Files:**
- Create: `src/components/ui/Card.tsx`

**Implementation:**
```tsx
interface CardProps {
  variant?: 'default' | 'hero' | 'accent-green' | 'accent-blue';
  clipPath?: 'top-right' | 'bottom-right' | 'none';
  children: React.ReactNode;
  className?: string;
}
```
- Uses clip-path based on variant
- Animated hover states with border glow
- Green gradient line on top when hovered

---

### Phase 2: Navigation Overhaul <!-- priority: high -->

#### Task 2.1: Replace Sidebar with Top Navigation
**Files:**
- Create: `src/components/layout/TopNav.tsx`
- Delete: `src/components/layout/Sidebar.tsx`
- Modify: `src/layouts/DashboardLayout.tsx`

**Components:**
- Logo section (parallelogram clip-path)
- Horizontal nav links with active underline
- User avatar (parallelogram clip-path)

---

### Phase 3: Dashboard Redesign <!-- priority: high -->

#### Task 3.1: Create Dashboard Grid System
**Files:**
- Modify: `src/pages/Dashboard.tsx`
- Create: `src/components/dashboard/PortfolioHeroCard.tsx`
- Create: `src/components/dashboard/AIAdvisorCard.tsx`
- Create: `src/components/dashboard/MarketPulseCard.tsx`
- Create: `src/components/dashboard/AllocationCard.tsx`
- Create: `src/components/dashboard/GoalsCard.tsx`
- Create: `src/components/dashboard/TransactionsCard.tsx`
- Create: `src/components/dashboard/PerformanceCard.tsx`
- Create: `src/components/dashboard/QuickActionsCard.tsx`

**Grid Layout (12-column):**
```
| Portfolio Hero (8 cols) | AI Advisor (4 cols) |
| Market Pulse (4)        | Allocation (4) | Goals (4) |
| Transactions (6)        | Performance (6)      |
| Quick Actions (12 cols)                        |
```

---

#### Task 3.2: Implement Chart.js Integration
**Files:**
- Install: `chart.js`, `react-chartjs-2`
- Create: `src/components/charts/SparklineChart.tsx`
- Create: `src/components/charts/AllocationDonutChart.tsx`
- Create: `src/components/charts/PerformanceAreaChart.tsx`

**Charts:**
- Mini sparkline for portfolio trend
- Doughnut chart for allocation
- Area chart for 6-month performance

---

### Phase 4: Secondary Pages <!-- priority: medium -->

#### Task 4.1: Redesign Portfolio Page
**Grid:**
- Holdings table with angular rows
- Allocation breakdown

#### Task 4.2: Redesign Analytics Page (new)
**Features:**
- Performance metrics
- Historical comparison

#### Task 4.3: Redesign Documents Page
**Features:**
- Folder grid with angular clip-paths

#### Task 4.4: Redesign Market News Page
**Features:**
- Market ticker with angular items
- News grid with clipped cards

---

### Phase 5: Animations & Polish <!-- priority: low -->

#### Task 5.1: Add Entrance Animations
- `fadeInUp` keyframes with staggered delays
- Count-up animation for numbers
- Pulse animation for AI icon

---

## Verification Plan

### Automated
- `npm run build` — Verify TypeScript compiles
- `npm run dev` — Visual inspection

### Manual
- Compare Dashboard layout to reference HTML
- Verify animations match (count-up, fade-in)
- Test responsive grid on mobile

---

## Execution Order

1. **Task 1.1** — Design tokens in Tailwind (foundation)
2. **Task 1.2** — Card component (reusable)
3. **Task 2.1** — Top Navigation (layout change)
4. **Task 3.1** — Dashboard grid + all cards
5. **Task 3.2** — Charts
6. **Task 4.x** — Secondary pages
7. **Task 5.1** — Animations

---

## User Review Required

> [!IMPORTANT]
> This redesign will **replace the current sidebar navigation** with a **top horizontal bar**. All existing functionality will be preserved, but the layout will change significantly.

> [!NOTE]
> The Stitch skill requires an MCP server that isn't currently connected. I'll implement the design directly using React components based on the HTML reference, following the react:components skill's modular architecture pattern.
