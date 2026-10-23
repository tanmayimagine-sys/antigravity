# Implementation Plan — Central AI Micro-Business Operating System

Version 2.0 | Target Delivery: Production-Grade Working Hackathon MVP

---

## 1. Executive Summary & Goals

Deliver a complete, connected, accessible, and responsive operating system for Indian micro-businesses (cafés, stationery shops, ice-cream parlours).
- **Core Philosophy:** Foundation before features. Clean, calm, trustworthy design system. 
- **Key Safety Guardrails:** Deterministic financial computations, strict tenant isolation, evidence-linked AI, owner-controlled public profiles, simulated revenue-share funding, no real-money movements, no fabricated reviews or footfall.

---

## 2. Architecture & Folder Structure

```
antigravity/
├── docs/
│   ├── spec/
│   │   ├── FINAL_Central_AI_System_Build_Prompt.md
│   │   ├── FINAL_Central_AI_Micro_Business_Platform_Spec.docx
│   │   └── FINAL_Central_AI_Micro_Business_Platform_Spec.pdf
│   ├── screenshots/             # Visual verification (375px, 768px, 1280px)
│   ├── PLAN.md                  # This implementation plan
│   ├── DECISIONS.md             # Architectural decision records
│   └── FEATURE_STATUS.md        # Functional vs Simulated audit report
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx           # Global HTML shell + ThemeProvider + inline FOUC script
│   │   ├── page.tsx             # 1. Landing / Demo entry & Role selection
│   │   ├── onboarding/          # 2. Business onboarding & industry templates
│   │   ├── data-centre/         # 3. Data ingestion, validation & Correction Queue
│   │   ├── reconciliation/      # 4. Reconciliation workspace & ExceptionQueue
│   │   ├── dashboard/           # 5. Owner dashboard & Health Profile
│   │   ├── ai-workspace/        # 6. Central AI orchestrator & chat with SourceDrawer
│   │   ├── experiments/         # 7. AI Business Doctor & Growth experiments board
│   │   ├── reviews/             # 8. Google reviews / reputation coach
│   │   ├── location/            # 9. Location explorer & scenario comparison
│   │   ├── public-profile/      # 10. Owner-controlled public profile & live preview
│   │   │   └── [slug]/          # Minimal, fast public visitor page
│   │   ├── funding/             # 11. Simulated funding workspace & repayment ledger
│   │   ├── admin/               # 12. Admin console, audit logs, blocked live flag
│   │   ├── settings/            # Settings: Appearance, Profile, Data/Privacy, Roles
│   │   └── api/                 # Modular API routes with RBAC & tenant isolation
│   │       ├── auth/
│   │       ├── businesses/
│   │       ├── uploads/
│   │       ├── reconciliation/
│   │       ├── metrics/
│   │       ├── ai/
│   │       ├── experiments/
│   │       ├── reviews/
│   │       ├── locations/
│   │       ├── funding/
│   │       └── admin/
│   ├── components/
│   │   ├── theme/               # ThemeProvider, theme-script, quick-toggle popover
│   │   ├── shell/               # Sidebar, TopBar, BottomTabs, Breadcrumbs, CommandPalette, GuidedDemo
│   │   ├── ui/                  # Design system primitives (MetricCard, ConfidenceBadge, EvidenceTag, etc.)
│   │   └── shared/              # DataTable, FileDropzone, ExceptionQueue, ScenarioSwitch, ApprovalCard
│   ├── lib/
│   │   ├── db/                  # Database client, schema (22 entities), seed loader
│   │   ├── deterministic/       # Pure functions: arithmetic, metrics, health scores, repayment cap
│   │   ├── ai/                  # Central AI orchestrator, tool registry, prompt engine, fallback provider
│   │   ├── formatters/          # Rupee currency (INR paise to string), date (en-IN), percentages
│   │   └── seed/                # 3 Synthetic demo businesses (Stationery, Ice-cream, Café)
│   └── styles/
│       └── globals.css          # CSS variable tokens (WCAG 2.1 AA checked, light & dark)
├── tests/
│   ├── deterministic/           # Unit tests: metrics, reconciliation matching, cap calculations
│   ├── security/                # Tenant isolation tests, cross-tenant IDOR rejection tests, RBAC
│   ├── theme/                   # Theme resolution & adaptive schedule tests
│   └── e2e/                     # Guided 5-minute demo flow smoke tests
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 3. Milestones & Delivery Order

### Milestone 1: Tooling, Design System & Theme Engine
- Initialize Next.js project with TypeScript, Tailwind CSS, Lucide icons, Framer Motion, Radix UI.
- Implement CSS variable design tokens for Light and Dark themes as specified in Section 4.
- Implement `ThemeProvider` with Light / Dark / Adaptive modes (clock-based schedule, live switch, zero FOUC, top-bar quick toggle popover, Settings appearance controls).
- Verify WCAG AA contrast, reduced-motion preferences, and font settings (Inter tabular-nums).

### Milestone 2: App Shell & Shared Components
- App shell: Responsive sidebar (collapsible), TopBar (business switcher, date filter, Ctrl+K command palette, theme toggle, notifications), mobile bottom tab bar (5 items).
- Persistent cues: "Synthetic demo data" chip, non-dismissable simulated funding notice.
- Shared components: `MetricCard`, `ConfidenceBadge`, `EvidenceTag`, `EvidenceChip` + `SourceDrawer`, `ApprovalCard`, `DataTable`, `FileDropzone`, `ExceptionQueue`, `ScenarioSwitch`, `GuidedDemo` tour modal, keyboard shortcut modal (`?`).

### Milestone 3: Data Layer, Database Schema & 3 Synthetic Businesses
- Define data model across all 22 entities: `User`, `Business`, `ConsentRecord`, `DataSource`, `FinancialRecord`, `SalesOrder`, `SalesLine`, `Product`, `Expense`, `InventorySnapshot`, `ReconciliationMatch`, `MetricSnapshot`, `HealthAssessment`, `AIConversation`, `AIRecommendation`, `Experiment`, `LocationCandidate`, `PublicProfileSettings`, `FundingRequest`, `FundingOffer`, `AgreementDraft`, `LedgerEntry`, `AuditEvent`, `IntegrationConnection`.
- Seed 3 distinct synthetic businesses:
  1. **Vidya Stationery & Xerox** (college demand, semester rush, delayed institutional payments).
  2. **Scoops & Swirls Cold Treat** (seasonal, evening peaks, refrigeration power spikes, wastage).
  3. **Chai & Chutney Café** (multi-category foods, aggregator delayed settlements, refund disputes).
- Provide a "Reset demo data" capability and downloadable messy sample files.

### Milestone 4: Deterministic Analytics & Source-Linked Dashboard (Screen 5)
- Deterministic calculation library: sales, AOV, expense categorization, cash flow, unit economics.
- Explainable Business Health Profile (0–100 with component formula, coverage, confidence).
- Screen 5: Owner Dashboard with 4 MetricCards, interactive sales charts, hero product rankings (units / revenue / estimated margin), expense breakdown, and "Needs your attention" alerts.

### Milestone 5: Ingestion & Reconciliation (Screens 3 & 4)
- Screen 3: Data Centre with file dropzone, CSV/XLSX parser, staged PDF/image OCR beta label, confidence scores, and Correction Queue.
- Screen 4: Reconciliation Workspace with match rate metrics, Matched / Unmatched / Duplicates tabs, and `ExceptionQueue` (split settlement view with Accept / Reject / Split).

### Milestone 6: Central AI Orchestrator & Business Doctor (Screens 6 & 7)
- Central AI orchestrator: authenticates tenant, retrieves approved business facts, calls deterministic tools, builds schema-valid output with evidence IDs.
- Screen 6: Central AI Workspace with 60/40 chat layout, live context panel, starter question chips, and interactive `SourceDrawer`.
- Screen 7: AI Business Doctor & Growth Experiment Tracker with ApprovalCards and a 4-column Kanban board (Baseline → Running → Result → Keep/Change/Stop).

### Milestone 7: Reputation Coach & Location Explorer (Screens 8 & 9)
- Screen 8: Google Reviews Coach with sentiment theme breakdown, owner-approved response composer, and genuine non-incentivized review QR code generator.
- Screen 9: Location Explorer with map, candidate area comparison, `ScenarioSwitch` (Conservative / Base / Optimistic), break-even calculator, field-visit checklist, and explicit "Footfall: not measured" label.

### Milestone 8: Public Profile & Simulated Funding (Screens 10, 11 & 12)
- Screen 10: Owner-Controlled Public Profile with per-field approval toggles, live desktop/mobile preview, and public slug page (`/public-profile/[slug]`) hiding private financial data.
- Screen 11: Simulated Funding Workspace with clear simulated banner, revenue-share offer terms, commitment flow, repayment ledger, and deterministic cap progress bar.
- Screen 12: Admin Console with Users & Roles, Feature Flags (locked "Live funding: BLOCKED"), Complaints, Integrations, and Audit Log.
- Screen 2: Business Onboarding flow with 4-step stepper and explicit consent toggles.
- Screen 1: Landing / Demo Entry with role cards (Owner, Accountant, Funder, Admin, Visitor).

### Milestone 9: Testing, Visual Verification & Documentation
- Automated test suites: deterministic calculations, reconciliation matching, tenant isolation & IDOR rejection, theme schedule logic, repayment cap enforcement.
- Visual verification at 375px, 768px, 1280px in Light and Dark modes.
- Complete documentation: `/docs/FEATURE_STATUS.md`, `README.md`, `.env.example`, API notes.

---

## 4. Risk Matrix & Mitigations

| Risk | Impact | Mitigation Strategy |
|---|---|---|
| **AI Hallucination / Math Errors** | High | LLM is prohibited from calculating numbers. Central AI Orchestrator executes deterministic analytics first and strictly injects pre-calculated numbers and evidence tags into the prompt context. |
| **Cross-Tenant Data Leak** | Critical | Enforce `businessId` checks in every database query at the backend API layer. Add automated test verifying User A cannot access Business B data. |
| **Real Money / Regulatory Misunderstanding** | Critical | Persistent simulated banners on all funding views; "Live funding: BLOCKED" lock in Admin Console; explicit disclaimers on Health Profile. |
| **Theme Flashing (FOUC)** | Medium | Inline pure-JavaScript `<head>` snippet that inspects `localStorage` and system clock before CSS/DOM render. |
| **Environment / Missing API Keys** | Medium | Built-in fallback "Sample AI responses" mode with schema-valid, evidence-grounded demo data. No external API key required to test 100% of the UI. |
