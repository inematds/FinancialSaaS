# Design Specification: Navigation & Core Pages

## Overview
This document defines the application structure, navigation pattern, and the functional requirements for the core pages beyond the Dashboard.

## 1. Navigation Structure (The Skeleton)
- **Pattern:** Persistent Left Sidebar ("Command Center").
- **Visual Style:** Dark, frosted glass surface (different shade from main background).
- **Behavior:** Fixed width on desktop, collapsible hamburger menu on mobile.

### Sidebar Items (Top to Bottom):
1.  **Dashboard** (Home Icon) - *Already Implemented*
2.  **Portfolio** (Pie Chart Icon)
3.  **Financial Plan** (Map/Flag Icon)
4.  **Documents** (Folder Icon)
5.  **Market News** (Newspaper/Globe Icon) - *New Feature*

### Sidebar Footer:
- **User Profile:** Small avatar + Name.
- **Settings:** Gear icon.
- **Log Out:** Interaction point.

## 2. Core Page Specifications

### A. Portfolio (The "Holdings" View)
- **Goal:** detailed breakdown of what the client owns.
- **Key Components:**
    - **Allocation Chart:** Donut chart showing Asset Class breakdown (Stocks, Bonds, Cash, Alt).
    - **Holdings Table:** List of individual assets with columns: Name, Ticker, Quantity, Price, Value, Day Change.
    - **Performance Toggle:** Switch view between "Holdings" and "Performance" (Time-weighted returns graph).

### B. Financial Plan (The "Future" View)
- **Goal:** Visualize progress towards life goals.
- **Key Components:**
    - **Probability Meter:** "86% Chance of Success" (Monte Carlo visual).
    - **Goal Cards:** Progress bars for specific targets (e.g., "Retirement 2045", "Lake House Purchase").
    - **Action Plan:** List of next steps recommended by the advisor.

### C. Documents (The "Vault")
- **Goal:** Secure repository for statements and tax forms.
- **Key Components:**
    - **Folder Grid:** "Tax Documents", "Monthly Statements", "Legal".
    - **Recent Uploads:** List of newest files.
    - **Upload Button:** For client-provided documents.

### D. Market News (The "Pulse")
- **Goal:** General market awareness (MVP: Market Wide).
- **Key Components:**
    - **Market Ticker:** Scrolling strip at top (S&P 500, NASDAQ, 10Y Treasury).
    - **Headline Grid:** 3-4 Featured major stories with images.
    - **Live Feed:** Chronological list of latest text headlines.
    - **Source:** "Market-Wide" focus (General financial news, not personalized yet).

## 3. Global Header
- **Breadcrumbs:** Current page location.
- **Search Bar:** "Search holdings..."
- **Advisor Chat Trigger:** Quick access button to open the chat sidebar.
