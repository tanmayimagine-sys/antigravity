# FINAL MASTER BUILD PROMPT — CENTRAL AI MICRO-BUSINESS OPERATING SYSTEM

Act as a senior product architect, full-stack engineer, AI engineer, data engineer, financial systems engineer, UX designer, QA lead and security engineer. Build a complete, connected, responsive MVP for Indian micro-businesses: cafés, stationery stores, ice-cream parlours, kirana shops, salons, food stalls, repair shops and local retailers. Do not build only a static dashboard. Inspect any existing repository first, preserve useful code, implement incrementally, run tests, and clearly report functional versus simulated features.

## Product goal
One central AI intelligence layer analyzes each business's own data, explains performance, identifies weaknesses, recommends growth actions, helps improve customer experience and genuine Google reviews, compares possible expansion locations, builds a transparent Business Health Profile, and supports controlled funding/repayment workflows. The AI layer is shared, but every business's data, memory/context, permissions and outputs must be tenant-isolated.

## Suggested architecture
- Frontend: Next.js/React + TypeScript, responsive and accessible.
- Backend: modular Node.js/TypeScript API with validation and role-based access.
- Database: PostgreSQL; private object storage for original uploaded files.
- Background workers for OCR, parsing, reconciliation and metric refresh.
- Central AI Orchestrator: checks permissions, retrieves the correct business context, calls analytics tools, invokes an LLM, validates structured output and stores evidence.
- Deterministic Analytics Service: source of truth for arithmetic, metrics, scores and repayment calculations.
- Adapters for permitted Google Business Profile/Places APIs and future authorized POS, bank, UPI and GST-related integrations.
- Audit logs, monitoring, model/prompt versioning and data provenance.

Use the LLM for reasoning, explanations and recommendations, not as an unverified calculator. It must not invent missing values, mix tenants, execute transactions or autonomously approve funding.

## Roles
Business owner; scoped staff/accountant; public visitor/customer; simulated funder; platform admin. Enforce access in backend and database queries, not just by hiding UI controls.

## Core flow
Business onboarding → upload/import bills, POS exports, UPI exports, bank statements, expenses, inventory and authorized GST records → parse and validate → owner reviews uncertain fields → normalize and detect duplicates → reconcile sales to settlements → calculate metrics with provenance/confidence → central AI analyzes evidence → owner reviews recommendations → growth experiments and location comparison → owner-approved public profile → simulated funding/repayment ledger → measured outcomes feed future analysis.

## Central AI orchestration
1. Authenticate user and verify tenant/permissions.
2. Retrieve only the selected business's approved records, metric snapshots, actions and experiments.
3. Call deterministic analytics tools.
4. Build context with date range, source references, confidence and missing data.
5. Route to financial analysis, growth coach, reviews, location intelligence, funding readiness or repayment monitoring.
6. Ask the LLM for schema-valid structured output.
7. Validate claims against available evidence; mark unknowns.
8. Store evidence metric IDs, model/prompt version and confidence.
9. Present findings and require owner approval for public content or consequential actions.
10. Track outcomes for later analysis without altering verified source facts.

## Required AI capabilities
**Financial intelligence:** sales, order count, average order value, product rankings by units/revenue/estimated margin, expenses, cash flow, settlement match rate, unmatched items, volatility, seasonality and break-even scenarios where inputs support them. Bank credits are not automatically sales; they may be transfers, loans, refunds or owner deposits.

**Business Health Profile:** explainable indicators for revenue consistency, cash-flow health, data reliability, profitability, operating stability, documented repayment history and growth readiness. If using 0–100, document methodology and display components, source coverage and confidence. It is a platform-generated indicator, not an official CIBIL/credit-bureau score and not a guarantee of funding or returns. Missing data means low confidence/insufficient data, not automatic rejection. Do not use protected or sensitive personal traits.

**Growth coach:** every recommendation includes finding, evidence IDs, time period, explanation, action, cost estimate only if grounded, expected impact direction, confidence, risks/unknowns, success metric and review date. Suggest product bundles, pricing tests, stockout/waste reduction, operating-hour changes, local partnerships, campus offers, customer retention and working-capital actions. Track baseline → hypothesis → owner approval → budget cap → execution → outcome → keep/change/stop. Never claim causality without evidence or spend/message/change prices without approval.

**Google reviews/reputation:** use authorized data only; analyze themes and trends; draft respectful responses for approval; provide neutral review links/QR codes. Never buy/fabricate reviews, gate requests by sentiment or incentivize reviews. Do not claim Google listings reveal exact footfall or competitors' revenue.

**Location intelligence:** use business type, target customer, expansion budget, rent range, existing unit economics, permitted nearby-place data, colleges/offices, competitor density, accessibility, demographics where available and seasonality. Show conservative/base/optimistic revenue/cost scenarios, assumptions, confidence, break-even estimates and field-validation checklist. Exact pedestrian footfall must not be claimed without a valid measurement source.

**Funding and repayment intelligence:** explain use of funds, cash-flow affordability, risks and missing information. Keep prepaid customer credits separate from investment/financing arrangements. In the MVP all commitments, balances, revenue-share calculations and payouts are SIMULATED. Define eligible revenue, share percentage, cap, fees, timing and exceptions. Calculate payments with deterministic code from reconciled revenue and stop at the cap according to simulated terms. Revenue share is not necessarily profit share. Do not promise returns, collect real money, solicit real investments, approve real loans or execute payouts. Live mode must remain blocked until India-specific legal, tax, payment, security and operational reviews and any required permissions/partners are confirmed.

## Required screens
1. Landing/demo entry and role selection.
2. Business onboarding and industry templates.
3. Data centre: CSV/XLSX upload first; staged PDF/image OCR, source periods, parser confidence and correction queue.
4. Reconciliation workspace with matched/unmatched records, duplicates and audit history.
5. Owner dashboard with sales, AOV, product rankings, expenses, cash flow, confidence and filters.
6. Central AI workspace/chat with evidence-linked answers.
7. AI Business Doctor and growth experiment tracker.
8. Google reviews/reputation coach.
9. Location explorer with scenarios and assumptions.
10. Owner-controlled public business profile.
11. Funding workspace with simulated offers, commitments and repayment ledger.
12. Admin console for roles, flags, complaints, integrations and audit logs.

## Data model
User, Business, ConsentRecord, DataSource, FinancialRecord, SalesOrder, SalesLine, Product, Expense, InventorySnapshot, ReconciliationMatch, MetricSnapshot, HealthAssessment, AIConversation, AIRecommendation, Experiment, LocationCandidate, PublicProfileSettings, FundingRequest, FundingOffer, AgreementDraft, LedgerEntry, AuditEvent and IntegrationConnection. Include tenant IDs, timestamps, source provenance, confidence/review state, methodology/parser/model versions and access scopes. Use decimal or integer minor units for money, not binary floating point.

## Data processing and quality
Validate uploads; normalize fields; flag uncertain OCR; detect duplicates conservatively; support many-to-one and one-to-many settlement matches; handle refunds and delays; keep unmatched items in an exception queue. Keep original uploads private and immutable; corrections must be auditable. Every metric shows definition, period, source coverage and confidence. Bills are not necessarily unique customers or actual footfall. Mark estimates separately from verified facts and AI hypotheses.

## Public business profile
Only owner-approved fields appear: business story, category, area-level location, services/products, selected metrics and periods, data coverage, methodology, verification state, growth goals and permitted demo offers. Never expose raw statements, account numbers, customer transactions, tax identifiers or private supplier terms by default. Record approvals and support correction requests.

## Security and privacy
Tenant isolation; backend RBAC; explicit consent per source/purpose; private encrypted document storage; safe upload checks; secret management; redacted logs; data minimization; access audit; retention/export/deletion workflows as applicable; human review for suspicious documents, disputes and low-confidence extraction. Do not send raw sensitive records to third-party AI unless approved and necessary. No autonomous money movement or publication.

## Seed data
Create three clearly synthetic demo businesses: (A) college-adjacent stationery shop with semester demand and inventory; (B) seasonal ice-cream parlour with evening peaks and wastage; (C) café with multiple products and expenses. Include duplicate bills, refunds, missing fields, delayed settlements, cash sales and mismatches.

## Build phases
1. Inspect repo, schema, roles and seed data.
2. Implement upload, validation, normalized records and reconciliation.
3. Implement deterministic analytics and source-linked dashboard.
4. Implement central AI orchestrator and structured evidence-based recommendations.
5. Implement growth experiments, reputation and location intelligence using mock/authorized adapters.
6. Implement owner-controlled public profile and simulated funding/repayment.
7. Add security tests, automated calculations tests, responsive polish and docs.

## Acceptance criteria
- Demo businesses are isolated; cross-tenant access tests pass.
- Files parse and show validation errors; duplicates/unmatched settlements are flagged.
- Dashboard calculations match deterministic fixtures and show source coverage.
- Central AI answers from the selected business's evidence, cites metric/source IDs and marks unknowns.
- Recommendations include evidence, confidence, risks and measurable next steps.
- Location comparisons show assumptions and never invent exact footfall.
- Reviews flow follows genuine, non-incentivized practices.
- Owner controls every public field.
- Simulated revenue-share calculations are deterministic and cap correctly.
- No real-money functionality is enabled.
- Automated tests cover calculations, matching, access permissions, tenant isolation, repayment caps and error states.
- Deliver source code, migrations, seed script, tests, README, setup guide, .env.example, API notes and a clear list of simulated versus functional features.

Deliver a working end-to-end MVP, not only visual mockups. Do not claim a feature works if it is only a placeholder.
