# Design Specification: Financial Advisor "Hybrid Co-Pilot" Portal

## Overview
A premium, high-trust User Portal for financial advisory clients. This application serves as a "Co-Pilot," bridging the gap between professional advisor management and client autonomy.

## Core Philosophy
**"Intuitive Clarity"**: The design must feel approachable, not intimidating. It should simplify complex financial data into actionable insights while maintaining a "white glove" exclusive feel.

## Key Features

### 1. Hybrid Data Strategy (The Backend)
- **Advisor Data**: Core investment portfolios, tax documents, and strategic plans are fed directly by the Advisor (System of Record).
- **Client Data**: Clients can link external accounts (Bank, Real Estate, Crypto) via aggregation (e.g., Plaid integration concept) to complete their Net Worth picture.

### 2. The Dashboard (The "Split Hero" Concept)
The landing page features a prominent split-screen hero section:
- **Left Side (The "Pulse"):**
  - **Focus:** Performance & Immediate Value.
  - **Content:** "Portfolio Value" (e.g., $1,250,000), "Today's Change" (e.g., +$4,200), and "YTD Return" (e.g., +12%).
  - **Vibe:** Exciting, validation of result.
- **Right Side (The "Vision"):**
  - **Focus:** Long-term Wealth Building.
  - **Content:** A smooth area chart showing "Total Net Worth" growth over time (combining Advisor + Client assets).
  - **Vibe:** Calming, reassuring stability.

### 3. Direct Access (The Connection)
- **Feature:** "Advisor Chat"
- **Location:** Always accessible (floating action button or persistent sidebar).
- **Interaction:** Real-time messaging interface for quick, low-friction queries ("Can I afford this vacation?", "Clarify this tax form").
- **Vibe:** Premium access. "Your advisor is just a text away."

## Technical Architecture (Proposed)
- **Frontend:** Next.js (React) + Vite
- **Styling:** Vanilla CSS (Modular) or Tailwind (if requested) for "Rich Aesthetics" (Glassmorphism, animated gradients).
- **Components:** Custom "Stitch" components for Charts and Chat.

## Next Steps
- Initialize Next.js project.
- Implement the "Split Hero" Dashboard layout.
- Build the "Advisor Chat" UI component.
