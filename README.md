# Central AI Micro-Business Operating System
### Connected Operating System for Indian Micro-Businesses (Version 2.0)

A comprehensive, connected, responsive operating system designed for Indian micro-businesses (cafés, stationery shops, ice-cream parlours, kirana stores). Combining data ingestion, deterministic financial reconciliation, evidence-grounded AI orchestration, explainable Business Health Profiles, owner-controlled public profiles, and simulated revenue-share funding workflows.

---

## 1. Quick Start & Setup

### Prerequisites
- Node.js 18+ or 20+ (tested on Node.js v24)
- npm 9+

### Installation & Launch
```bash
# 1. Clone & install dependencies
git clone <repo-url>
cd antigravity
npm install

# 2. Run automated test suites (Deterministic calculations, Tenant isolation, Theme logic, E2E Demo)
npm test

# 3. Start development server
npm run dev
# Open http://localhost:3000 in your browser
```

### Production Build
```bash
npm run build
npm start
```

---

## 2. 5-Minute Guided Hackathon Demo Path

Click the **"Guided Demo"** button in the top navigation bar to trigger the interactive tour, or follow this manual 6-step script:

1. **Owner Dashboard (`/dashboard`)**:
   - Select **Vidya Stationery & Xerox** from the business switcher.
   - Inspect the 4 `MetricCard`s (Gross Sales ₹5.16L, Orders 2,410, AOV ₹214, Net Cash Flow ₹1.72L).
   - Click the `ⓘ` info button on any card to view deterministic formulas and source coverage.
   - Inspect the **Business Health Profile (84/100)** with 7 explainable component scores and transparent disclaimers.

2. **Data Centre (`/data-centre`)**:
   - Download the provided messy sample file via **"Download Sample Messy File"**.
   - Inspect the **Correction Queue** tab showing low-confidence OCR fields with side-by-side editing before entering financial records.

3. **Reconciliation Workspace (`/reconciliation`)**:
   - Inspect the **Exception Queue** tab displaying the unmatched ₹12,500 Pune University semester payment.
   - Click **Accept Match** or **Split Settlement** to clear the credit into reconciled revenue.
   - Switch to the **Duplicates** tab to view conservative duplicate reference blocking.

4. **Central AI Workspace (`/ai-workspace`)**:
   - Ask starter question: *"Why did sales dip in September?"*
   - Inspect the structured response card. Click evidence chip **`[M-201]`** or **`[M-204]`** to open the **`SourceDrawer`** displaying the raw record, period, and confidence score.
   - Observe the explicit **Unknowns & Blindspots** section.

5. **AI Doctor & Growth Experiments (`/experiments`)**:
   - Review diagnostic recommendations formatted as `ApprovalCard`s.
   - Click **Approve & Track** (includes a 6-second undo toast).
   - Watch the recommendation automatically promote into the **Active Experiment Board** (Baseline → Running → Result → Decision).

6. **Location Explorer & Simulated Funding (`/location` & `/funding`)**:
   - Under **Location Explorer**, compare candidate sites (FC Road vs Viman Nagar) across Conservative, Base, and Optimistic scenarios.
   - Notice the mandatory honest label: **`Footfall: not measured`**.
   - Navigate to **Funding (`/funding`)** to view the non-dismissable simulated banner, revenue-share terms (6.5%), and the deterministic **Repayment Cap Progress Ceiling** stopping at ₹1,15,000.

---

## 3. Architecture & System Design

```
antigravity/
├── src/
│   ├── app/                     # Next.js App Router (12 screens + 7 API endpoints)
│   │   ├── page.tsx             # 1. Landing & Role Selector (Owner, Staff, Funder, Admin)
│   │   ├── onboarding/          # 2. Business Onboarding (4-step Stepper)
│   │   ├── data-centre/         # 3. Data Centre & Correction Queue
│   │   ├── reconciliation/      # 4. Reconciliation & ExceptionQueue
│   │   ├── dashboard/           # 5. Owner Dashboard & BHP-v2.0
│   │   ├── ai-workspace/        # 6. Central AI Workspace & SourceDrawer
│   │   ├── experiments/         # 7. Doctor & Experiments Kanban
│   │   ├── reviews/             # 8. Reviews Coach & Neutral QR
│   │   ├── location/            # 9. Location Explorer & ScenarioSwitch
│   │   ├── public-profile/      # 10. Owner-Controlled Visibility Editor
│   │   │   └── [slug]/          # Minimal Public Visitor Page
│   │   ├── funding/             # 11. Simulated Funding & Cap Ledger
│   │   ├── admin/               # 12. Admin Console & Locked Gate
│   │   ├── settings/            # Settings: Light / Dark / Adaptive
│   │   └── api/                 # Modular REST API endpoints (Tenant Isolated)
│   ├── components/
│   │   ├── theme/               # ThemeProvider, ThemeScript (Zero FOUC), QuickToggle
│   │   ├── shell/               # Sidebar, TopBar, MobileTabs, CommandPalette (Ctrl+K)
│   │   ├── ui/                  # MetricCard, ConfidenceBadge, EvidenceTag, ApprovalCard
│   │   └── shared/              # DataTable, FileDropzone, ExceptionQueue, ScenarioSwitch
│   ├── lib/
│   │   ├── db/                  # In-memory / SQL repository with tenant isolation
│   │   ├── deterministic/       # Pure functions: reconciliation, health profile, funding cap
│   │   ├── formatters/          # Indian Rupee (INR paise), en-IN Lakh/Crore grouping
│   │   ├── seed/                # 3 Synthetic Demo Businesses (Vidya, Scoops, Chai)
│   │   └── types/               # TypeScript definitions across all 22 required entities
│   └── styles/
│       └── globals.css          # WCAG 2.1 AA design tokens (Light & Dark)
├── tests/                       # 27 automated tests across 5 test suites
└── docs/
    ├── spec/                    # Project specifications (MD, DOCX, PDF)
    ├── screenshots/             # 42 visual verification screenshots (375px, 768px, 1280px)
    ├── PLAN.md                  # Milestone implementation plan
    ├── DECISIONS.md             # Architectural decision records (ADRs)
    └── FEATURE_STATUS.md        # Functional vs Simulated audit report
```

---

## 4. Design & Theme System

- **Color Tokens**: Defined as CSS variables on `:root` and `:root[data-theme="dark"]`, mapped in `tailwind.config.ts`.
- **WCAG 2.1 AA Compliant**: All text contrast ratios exceed 4.5:1 (e.g. `--primary` in dark mode = 5.4:1).
- **Theme Modes**:
  - ☀ **Light**: Always light.
  - 🌙 **Dark**: Always dark.
  - ⏱ **Adaptive (Default)**: Automatically switches based on the user's local clock time (default: light 07:00–19:00, dark 19:00–07:00). Configurable in Settings.
- **No Flash of Wrong Theme**: Tiny inline `<head>` script evaluates `localStorage` and device time before first paint.
- **Tabular Figures**: Every monetary number, table, and chart label uses `font-variant-numeric: tabular-nums` for clean digit alignment.
- **Accessibility & Motion**: Supports `prefers-reduced-motion` and provides an in-app toggle to disable transitions.

---

## 5. Non-Negotiable Safety & Compliance Rules

1. **Simulated Funding Only**: All financing offers, revenue-share percentages, balances, and ledger payouts are **SIMULATED**. Live investment and money movement remain strictly **BLOCKED** in the Admin Console.
2. **Deterministic Computations**: The LLM is never permitted to calculate figures or approve transactions. Calculations are executed by verified TypeScript functions.
3. **Tenant Isolation**: Every database query verifies `businessId`. Cross-tenant mutations and data leaks are blocked and covered by automated security tests.
4. **Honest Footfall**: Pedestrian footfall is explicitly labeled `"Footfall: not measured"`.
5. **Non-Incentivized Reviews**: Review workflows follow Google policies. No incentives, discounts, or sentiment-filtering are permitted.
6. **Integer Minor Units (Paise)**: All money is stored as integer paise to prevent floating-point rounding errors.

---

## 6. Verification & Documentation Index

- Detailed Implementation Plan: [`/docs/PLAN.md`](docs/PLAN.md)
- Architectural Decision Records (ADRs): [`/docs/DECISIONS.md`](docs/DECISIONS.md)
- Functional vs. Simulated Feature Status: [`/docs/FEATURE_STATUS.md`](docs/FEATURE_STATUS.md)
- Visual Verification Screenshots: [`/docs/screenshots/`](docs/screenshots/)
- Specifications: [`/docs/spec/`](docs/spec/)
