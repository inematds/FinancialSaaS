# Market News Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** implement a live Market News page with a ticker and headline feed using the **Finnhub Free API**.

**Tech Stack:** React, Axios (or fetch), Tailwind CSS, Finnhub API.

---

### Task 1: API Service Layer

**Files:**
- Create: `src/services/finnhub.ts`
- Modify: `.env` (Add `VITE_FINNHUB_API_KEY`)

**Step 1: Create Service**
Create `src/services/finnhub.ts` to handle API calls.
- `getMarketNews(category: string)`: Fetches general market news.
- `getQuote(symbol: string)`: Fetches current price for the ticker.
- **Mock Fallback:** If API call fails (or no key), return realistic mock data so the UI doesn't break during demo.

**Step 2: Environment Variables**
Create `.env.local` (example) to store the key.
```
VITE_FINNHUB_API_KEY=your_key_here
```

### Task 2: Components (Ticker & News Card)

**Files:**
- Create: `src/components/news/MarketTicker.tsx`
- Create: `src/components/news/NewsCard.tsx`

**Step 1: Market Ticker**
- A horizontal scrolling bar (marquee style or flex row).
- Displays: S&P 500 (SPY), NASDAQ (QQQ), Dow Jones (DIA), Bitcoin (BTC).
- Shows: Symbol, Price, and Color-coded % Change (Green/Red).

**Step 2: News Card**
- A clean card component to display a single news article.
- Image (left or top), Headline, Source, Date, Summary (if available), "Read More" button.

### Task 3: Market News Page Assembly

**Files:**
- Modify: `src/pages/MarketNews.tsx`

**Step 1: Assemble the Page**
- Replace the "Coming Soon" shell.
- **Top:** `<MarketTicker />`
- **Header:** "Market Pulse"
- **Content:** A Masonry or Grid layout of `<NewsCard />` items fetching from `finnhub.getMarketNews("general")`.
- **Loading State:** Skeletons while fetching.

### Task 4: User Instructions
- Add a note in the UI or README about getting a free Finnhub Key.

---

## Verification Plan
1.  **No Key:** Run app, verify Mock Data loads and looks good.
2.  **With Key:** Enter a valid Finnhub key, verify live data appears.
