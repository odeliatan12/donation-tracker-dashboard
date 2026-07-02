# Build Steps — Prompt-by-Prompt

Purpose: break the build into small, reviewable chunks instead of one large code
dump. Each step below is a prompt you can paste in as-is. Every step produces a small,
self-contained diff you can read before moving on. Checkpoints (marked ✅) are natural
points to actually run the app locally or push a deploy, before continuing.

Copy one line at a time — don't batch them, since each is meant to be reviewed before
the next is generated.

## Phase A — Backend skeleton

1. `Scaffold the Spring Boot project: pom.xml with the dependencies from the plan, application.yml with a dev profile (H2), and the main application class. No business logic yet — just something that boots.`
2. ✅ **Checkpoint:** run `mvn spring-boot:run`, confirm it starts on `:8080` with no entities yet.
3. `Add the Donation entity and DonationType enum, with JPA annotations and Bean Validation constraints (amount > 0, donorName required).`
4. `Add DonationRepository extending JpaRepository, plus any derived query methods we'll need for date-range and monthly lookups.`
5. `Add the DonationRequest/DonationResponse DTOs and a mapper (plain method or MapStruct — your call) between entity and DTO.`
6. `Add DonationService with create/read/update/delete methods, using the DTOs and repository from the last two steps.`
7. `Add DonationController wiring the four REST endpoints (GET/POST/PUT/DELETE /api/donations) to DonationService.`
8. `Add a @ControllerAdvice global exception handler for validation errors (400) and not-found (404), returning a clean JSON error body.`
9. `Add dev-profile seed data (data.sql or a CommandLineRunner) with ~10 sample donations across all three types and a few different months.`
10. ✅ **Checkpoint:** run the backend, exercise all four endpoints with curl/Postman against the seeded H2 data. Confirm validation errors and 404s look right before moving to dashboard/reports.

## Phase B — Backend metrics & reports

11. `Add DashboardService (total all-time, total this month, count, donations grouped by date, donations grouped by type) and DashboardController exposing GET /api/dashboard/summary with a DashboardSummaryResponse DTO.`
12. ✅ **Checkpoint:** hit `/api/dashboard/summary` against seed data, confirm the numbers match what you'd expect by eyeballing the seed set.
13. `Add ReportService (monthly total, donation count, top donors by amount) and ReportController exposing GET /api/reports/monthly with an optional ?month=YYYY-MM param.`
14. `Add the @Scheduled monthly job that logs/generates the report automatically (simulate — no email needed yet).`
15. ✅ **Checkpoint:** full backend manual test pass — all endpoints, one more time, before touching the frontend.

## Phase C — First deploy (backend only)

16. `Add the prod Spring profile (application-prod.yml) reading DB connection info from environment variables, per DEPLOYMENT.md.`
17. ✅ **Checkpoint (deploy):** push to GitHub, stand up Render web service + Render Postgres, set env vars, confirm `/api/dashboard/summary` responds on the public Render URL. Do this now, before frontend work, so backend issues surface early instead of at the end.

## Phase D — Frontend skeleton

18. `Scaffold the Angular project with Angular Material and routing set up (empty /dashboard and /donations routes), plus the TypeScript models matching the backend DTOs.`
19. `Add donation.service.ts with the four CRUD HTTP calls, typed against the models.`
20. `Add the donation-list component: Material table reading from donation.service.ts, no edit/delete yet — just render the list.`
21. ✅ **Checkpoint:** run `ng serve` against the local backend, confirm the table renders seeded data.
22. `Add the donation-form component (reactive form, Material dialog) wired for create, opened from a button on donation-list.`
23. `Wire donation-form for edit (pre-filled) and add the delete action on donation-list.`
24. ✅ **Checkpoint:** full CRUD works end-to-end locally — add, edit, delete a donation and confirm it round-trips through the backend.

## Phase E — Dashboard UI

25. `Add dashboard.service.ts and report.service.ts, typed against DashboardSummaryResponse / MonthlyReportResponse.`
26. `Add the dashboard component's metric cards (total, this month, count) reading from dashboard.service.ts.`
27. `Add the Chart.js line chart (donations over time) to the dashboard component.`
28. `Add the Chart.js pie chart (donations by type) to the dashboard component.`
29. ✅ **Checkpoint:** dashboard renders correctly against local backend/seed data, cards and both charts match expectations.

## Phase F — Second deploy (full stack)

30. `Add CORS config on the backend restricted to the Netlify origin, and set environment.prod.ts's apiBaseUrl to the Render URL.` Note: must explicitly set `.allowedMethods("GET", "POST", "PUT", "DELETE")` — Spring's CORS defaults only permit GET/HEAD/POST when methods aren't listed, which silently blocks edit/delete from the browser (confirmed while testing step 23).
31. ✅ **Checkpoint (deploy):** connect the repo to Netlify (build command `ng build --configuration production`, add `_redirects`), deploy, click through the live dashboard and donations pages end-to-end against the live Render backend.

## Phase G — Bonus (only after F is solid)

32. `Add date-range filter and donor-name search to donation-list.`
33. `Add CSV export on the monthly report endpoint + a download button in the UI.`
34. `Add Spring Security basic login gating the API, plus a simple Angular login page.`

---

Suggested cadence: do Phases A–C in one sitting (backend is self-contained and easy
to verify with curl), then D–F in a second sitting. Stop after any ✅ checkpoint if
something looks off — cheaper to fix there than after three more steps stack on top.
