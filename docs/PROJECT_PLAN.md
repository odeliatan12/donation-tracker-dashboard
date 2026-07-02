# Donation Tracker Dashboard — Project Plan

## 1. Purpose

A full-stack donation tracking system for a non-profit: log donations, view dashboard
metrics, and generate monthly reports automatically. Built as a portfolio piece that
demonstrates a clean layered Spring Boot backend + Angular Material frontend.

## 2. Scope (this build)

| Area | In scope | Deferred (bonus) |
|---|---|---|
| Donations | CRUD, validation | Search by donor, date-range filter |
| Dashboard | Totals, monthly total, by-type breakdown, time series | — |
| Reports | Monthly summary + top donors | CSV export |
| Auth | None (open for demo) | Spring Security basic login |
| Scheduling | `@Scheduled` monthly report log | Email delivery of report |

## 3. Repository layout

```
donation-tracker-dashboard/
├── backend/                 # Spring Boot (Maven)
│   └── src/main/java/.../{controller,service,repository,entity,dto,config,exception}
├── frontend/                 # Angular
│   └── src/app/{components,services,models}
├── docs/
│   ├── PROJECT_PLAN.md       # this file
│   └── DEPLOYMENT.md         # publishing/hosting plan
└── README.md                 # quick start, links to live demo
```

Rationale: backend and frontend as sibling folders in one repo (monorepo) keeps the
portfolio piece self-contained — one `git clone` gets the whole system, and one README
can link to both the live demo and the source.

## 4. Backend architecture

Layered, single responsibility per layer:

- **entity** — `Donation` (JPA entity, enum `DonationType { CASH, ONLINE, EVENT }`)
- **repository** — `DonationRepository extends JpaRepository`, plus derived/`@Query`
  methods for date-range and monthly aggregation
- **service** — `DonationService` (CRUD + validation), `DashboardService` (metrics),
  `ReportService` (monthly report + scheduled job)
- **controller** — `DonationController`, `DashboardController`, `ReportController`
- **dto** — request/response DTOs so entities never leak through the API directly
  (e.g. `DonationRequest`, `DonationResponse`, `DashboardSummaryResponse`,
  `MonthlyReportResponse`)
- **exception** — `@ControllerAdvice` global handler mapping validation errors and
  not-found cases to clean JSON error responses (400/404) instead of stack traces

Config: `application.yml` with Spring profiles — `dev` (H2, in-memory, `data.sql` seed)
and `prod` (PostgreSQL, driven by env vars) — see [DEPLOYMENT.md](DEPLOYMENT.md).

## 5. Frontend architecture

- **services/** — thin HTTP wrappers (`donation.service.ts`, `dashboard.service.ts`,
  `report.service.ts`) — one method per backend endpoint, typed with matching
  TypeScript interfaces in `models/`
- **components/**
  - `dashboard/` — metric cards + Chart.js line (donations over time) and pie
    (by type) charts
  - `donation-list/` — Angular Material table, delete action, opens form
  - `donation-form/` — reactive form (add/edit) in a Material dialog
- Routing: `/dashboard` (default) and `/donations`
- State: kept simple — services hold the HTTP calls, components manage local state;
  no NgRx, since app scope doesn't justify the overhead

## 6. Build order

1. Backend: entity → repository → service → controller → validation → exception
   handling → seed data (`dev` profile)
2. Verify all endpoints manually (Postman/curl) against H2
3. Frontend: models → services → donation-list + donation-form (CRUD working
   end-to-end against local backend) → dashboard (charts wired to summary endpoint)
4. Wire CORS so Angular dev server (`:4200`) can call Spring Boot (`:8080`)
5. Add `@Scheduled` monthly report logger
6. Polish: loading/empty states, form validation messages, responsive layout
7. Deploy — see [DEPLOYMENT.md](DEPLOYMENT.md)

## 7. Non-goals

- No multi-tenant/org support — single non-profit, single dataset
- No role-based access control in this pass (flagged as bonus/future work)
- No offline support / PWA
