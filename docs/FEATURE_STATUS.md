# Feature Status Report — Central AI Micro-Business Operating System

Version 2.0 | Release: 23 October 2026 | Hackathon MVP Audit

---

## 1. Compliance & Security Summary

| Safety & Regulatory Standard | Status | Implementation Verification |
|---|---|---|
| **Live Funding & Real Payouts** | **BLOCKED** | Hard-locked switch in Admin Console; non-overridable in MVP; persistent simulated banners on all funding screens. |
| **Tenant Data Isolation** | **FUNCTIONAL** | Queries enforce `businessId` checks at repository and API layer; verified with automated IDOR & cross-tenant access tests. |
| **Deterministic Financial Math** | **FUNCTIONAL** | Gross sales, order count, AOV, expense categorization, reconciliation tolerance, and repayment cap calculations run through deterministic TypeScript functions, not LLM floating-point guesses. |
| **Integer Minor Units (Paise)** | **FUNCTIONAL** | All currency stored as integer paise (100 paise = ₹1.00); formatted with `Intl.NumberFormat('en-IN')` with Indian Lakh/Crore notation. |
| **Evidence-Grounded AI** | **FUNCTIONAL** | Central AI cites verifiable metric codes (`[M-201]`, `[M-204]`) and record references; clicking chips opens the `SourceDrawer` with raw provenance. |
| **Honest Location Standards** | **FUNCTIONAL** | Footfall explicitly labeled `"Footfall: not measured"`; no fabricated sensor numbers or competitor revenues. |
| **Genuine Review Workflows** | **FUNCTIONAL** | Non-incentivized, neutral Google review QR codes and links; sentiment-gating ("rate us before review") is prohibited. |
| **Owner Approval Gate** | **FUNCTIONAL** | Consequential actions (promotions, price updates, public profile fields, simulated offers) require explicit owner approval via `ApprovalCard` with 6-second undo window. |

---

## 2. Screen-by-Screen Feature Status

| Screen | Required Capability | Implementation Status | Verification Details |
|---|---|---|---|
| **1. Landing / Demo Entry** | Role selection (Owner, Accountant, Funder, Admin, Visitor) | **Functional** | Multi-role switcher, "How it works" 3-step strip, trust & compliance overview. |
| **2. Business Onboarding** | 4-step stepper, domain templates, explicit consent | **Functional** | Baselines saved, domain presets (stationery, café, ice-cream), consent toggles default to OFF. |
| **3. Data Centre** | Drag-drop upload, CSV/XLSX parser, OCR beta, Correction Queue | **Functional** | Dropzone accepts CSV/XLSX/PDF/images, downloadable sample messy file, side-by-side correction form. |
| **4. Reconciliation** | Exact & batch matching, duplicate detection, Exception Queue | **Functional** | Match rate KPI, duplicate reference blocker, split-view Exception Queue with Accept/Reject/Split. |
| **5. Owner Dashboard** | 4 MetricCards, Recharts sales trends, hero product rankings, Health Profile | **Functional** | Metric definitions on click, units/revenue/margin toggle, accessible table toggle, BHP 0-100 breakdown. |
| **6. Central AI Workspace** | 60/40 chat layout, starter chips, evidence chips, SourceDrawer, context panel, **Live Gemini 2.5 Flash Integration** | **Functional** | Isolated context boundary, clickable evidence tags, unknowns disclosure, live Gemini 2.5 Flash reasoning connected to full business state (sales, margins, reviews, expenses, BHP). |
| **7. Business Doctor & Experiments** | ApprovalCards, 4-column Kanban board, measured-outcome tracking | **Functional** | Pending recommendations, 6-second undo toast, Baseline → Running → Result → Decision workflow. |
| **8. Reviews Coach** | Sentiment themes, neutral QR generator, AI draft reply composer | **Functional** | Positive & negative themes, direct Google review link copy, editable respectful response editor. |
| **9. Location Explorer** | Scenario modeling, capex break-even, field-visit checklist, **AI Review-Driven Expansion Suggestion** | **Functional** | Conservative/Base/Optimistic switch, "Footfall: not measured" tag, interactive field inspection checklist, Gemini AI expansion recommender based on target audience & Google review bottlenecks. |
| **10. Public Profile Editor** | Owner-controlled visibility toggles, live desktop/mobile preview | **Functional** | Field-by-field opt-in switches, "Never shown publicly" safety list, live 375px & desktop simulator. |
| **10b. Public Visitor Slug** | Minimal, fast public store page (`/public-profile/[slug]`) | **Functional** | Server-rendered, light & dark theme compatible, hides private margins and statements. |
| **11. Funding & Investor Marketplace** | Borrowing listing creation, Investor discovery marketplace, Simulated revenue share, repayment cap ceiling, ledger | **Simulated Marketplace** | Owners can list their business for capital with target return and use of funds; Investors can evaluate businesses via verified BHP score, 30d sales, cash flow, and commit simulated capital; Persistent simulated banner, daily eligible revenue share formula, deterministic cap progress bar. |
| **12. Admin Console** | Users, feature flags, disputes, integrations, audit log | **Functional** | "Live funding: BLOCKED" lock switch, connected API heartbeats, searchable and exportable audit trail. |
| **13. Settings & Appearance** | Light / Dark / Adaptive 3-way toggle, schedule pickers, data reset | **Functional** | Local clock adaptive switching (07:00 to 19:00 default), no FOUC on load, reduce motion toggle, full reset. |

---

## 3. Verified Synthetic Demo Businesses

| Business Key | Name & Category | Seed Characteristics | Verification Status |
|---|---|---|---|
| `biz_stationery` | **Vidya Stationery & Xerox** (Pune) | College semester demand, Xerox high margin (70%), drawing sheets stockout risk, delayed college exam booklet settlement. | **Verified** |
| `biz_icecream` | **Scoops & Swirls Cold Treat** (Bengaluru) | Evening pedestrian peaks, seasonal volume dip, high dairy refrigeration power tariffs (BESCOM). | **Verified** |
| `biz_cafe` | **Chai & Chutney All-Day Café** (New Delhi) | High chai margins (78.1%), morning commuter rush, aggregator settlements (Swiggy/Zomato). | **Verified** |

---

## 4. Test Suite Audit

- **Theme & Adaptive Logic:** 6 unit tests (10:00 light, 22:00 dark, 07:00/19:00 boundary resolution, custom schedules) — **PASSED**
- **Rupee / Paise Formatter:** 4 unit tests (en-IN Lakh/Crore formatting, negative values, string parsing) — **PASSED**
- **Deterministic Reconciliation & Funding Cap:** 7 unit tests (duplicate reference detection, batch matching, eligible revenue calculation, absolute cap enforcement, zero-sales handling) — **PASSED**
- **Tenant Isolation & Security:** 4 unit tests (cross-tenant query isolation, unauthorized mutation rejection, audit logging) — **PASSED**
- **5-Minute Guided Demo Flow:** 6 integration tests covering the complete hackathon end-to-end journey — **PASSED**
- **Total Automated Tests:** 27 tests across 5 test suites. 100% passing.
