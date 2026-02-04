# Financial Advisor Portal Setup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Initialize the "Hybrid Co-Pilot" Financial Advisor Portal with a dark-mode-first foundation and the core "Split Hero" Dashboard.

**Architecture:** Vite (React + TypeScript) for fast SPA performance, Tailwind CSS for styling (configured for default dark mode), Lucide React for icons. We will build a modular `SplitHero` component.

**Tech Stack:** React, Vite, TypeScript, Tailwind CSS, Lucide React, clsx/tailwind-merge.

---

### Task 1: Initialize Vite Project with Dark Mode

**Files:**
- Create: `index.html` (Vite creates this, we modify)
- Modify: `tailwind.config.ts`
- Modify: `src/index.css`
- Modify: `src/App.tsx` (or `src/main.tsx`)

**Step 1: Run Project Initialization**

Run: `npm create vite@latest . -- --template react-ts`
(Note: Run this in the root. If command fails due to non-empty dir, manual cleanup might be needed first).

**Step 2: Install Dependencies**

Run: `npm install`
Run: `npm install -D tailwindcss postcss autoprefixer`
Run: `npx tailwindcss init -p`

**Step 3: Configure Dark Mode Default in Tailwind**

Modify `tailwind.config.js` (or `.ts`):
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // We will force 'dark' class on HTML
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
         // Premium Dark Palette
         background: '#0a0a0a', 
         surface: '#121212',
         primary: '#3b82f6', // Trusted Blue
         secondary: '#10b981', // Growth Green
      }
    },
  },
  plugins: [],
}
```

**Step 4: Force Dark Class in HTML**

Modify `index.html`:
```html
<!doctype html>
<html lang="en" class="dark"> <!-- Forced Dark Mode -->
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Financial Co-Pilot</title>
  </head>
  <body class="bg-background text-white antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 5: Setup Global CSS**

Modify `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Reset or global styles if needed */
```

**Step 6: Verify Build**

Run: `npm run build`
Expected: SUCCESS

**Step 7: Commit**
```bash
git add .
git commit -m "feat: initialize vite with dark mode"
```

### Task 2: Create Dashboard Shell and Split Hero Component

**Files:**
- Create: `src/components/dashboard/SplitHero.tsx`
- Modify: `src/App.tsx`

**Step 1: Create SplitHero Component Shell**

Create `src/components/dashboard/SplitHero.tsx`:
```tsx
import React from 'react';

export default function SplitHero() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] w-full">
      <div className="bg-surface rounded-2xl p-8 flex flex-col justify-between border border-white/10" data-testid="hero-pulse">
        {/* Pulse Side */}
        <h2 className="text-gray-400 font-medium">Portfolio Value</h2>
        <div>
           <span className="text-5xl font-bold text-white tracking-tight">$1,250,000</span>
           <div className="flex items-center gap-2 mt-2 text-secondary">
             <span>+$4,200 (Day)</span>
           </div>
        </div>
      </div>
      
      <div className="bg-surface rounded-2xl p-8 border border-white/10 flex items-center justify-center relative overflow-hidden" data-testid="hero-vision">
        {/* Vision Side - Placeholder for Charts */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <span className="relative z-10 text-xl font-medium text-gray-300">Net Worth Growth Chart (Coming Soon)</span>
      </div>
    </div>
  );
}
```

**Step 2: Implement Dashboard Page in App.tsx**

Modify `src/App.tsx`:
```tsx
import React from 'react';
import SplitHero from './components/dashboard/SplitHero';

function App() {
  return (
    <main className="min-h-screen p-8 bg-background text-white">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Good Evening, Robert.</h1>
      </header>
      
      <section className="mb-8">
        <SplitHero />
      </section>
      
      {/* Interaction Area Placeholder */}
      <section className="grid grid-cols-3 gap-4">
         <div className="bg-surface h-32 rounded-xl border border-white/5 opacity-50"></div>
         <div className="bg-surface h-32 rounded-xl border border-white/5 opacity-50"></div>
         <div className="bg-surface h-32 rounded-xl border border-white/5 opacity-50"></div>
      </section>
    </main>
  );
}

export default App;
```

**Step 3: Run Dev Server to Verify (Manual)**
Run: `npm run dev`
(Manual check: Open localhost, verify dark theme and split layout).

**Step 4: Commit**
```bash
git add .
git commit -m "feat: implement split hero dashboard shell"
```
