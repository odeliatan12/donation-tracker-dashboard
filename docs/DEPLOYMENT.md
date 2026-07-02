# Deployment Plan — Publishing the Live Demo

Goal: a public URL for the portfolio (e.g. in a resume/LinkedIn) that anyone can open
and click through, plus a public GitHub repo as the source-code reference.

## 1. Hosting choices

| Piece | Choice | Why |
|---|---|---|
| Backend (Spring Boot) | **Render** (free web service) | Native Docker/Java support, free tier, simple env-var config, connects to managed Postgres |
| Database | **Render PostgreSQL** (free tier) | Same platform as backend, no separate account needed; H2 is dev-only (in-memory, wiped on restart) so it can't back a live demo |
| Frontend (Angular) | **Netlify** (or Vercel) | Free static hosting, auto-deploys from GitHub on push, trivial Angular build support |
| Source | **GitHub** (public repo) | Required by both Render and Netlify for auto-deploy; also the portfolio artifact itself |

Free-tier caveat to set expectations correctly: Render's free web service spins down
after ~15 minutes of inactivity and takes ~30-50s to wake on the next request. That's
fine for a portfolio demo (mention it in the README: "first load may take ~30s to
wake the backend").

## 2. Backend deployment steps

1. Push `backend/` to GitHub as part of the monorepo.
2. Add a `prod` Spring profile (`application-prod.yml`) that reads DB connection info
   from environment variables (`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`)
   instead of hardcoded H2 settings.
3. Add `spring-boot-starter` production build via Maven (`mvn clean package`); Render
   builds from a `Dockerfile` or its native Java buildpack.
4. Create a Render PostgreSQL instance → copy its internal connection string into the
   Render web service's environment variables.
5. Set `SPRING_PROFILES_ACTIVE=prod` on the Render service.
6. Enable CORS in the backend for the deployed frontend origin (Netlify URL) via a
   `WebMvcConfigurer` bean — restrict to that origin, not `*`, since this will be
   public.
7. Deploy; confirm `GET /api/dashboard/summary` responds on the Render URL.

## 3. Frontend deployment steps

1. Set the production `environment.prod.ts` `apiBaseUrl` to the Render backend URL.
2. Netlify: connect the GitHub repo, set build command
   `ng build --configuration production`, publish directory `frontend/dist/<app-name>`.
3. Add a `_redirects` file (`/* /index.html 200`) so Angular's client-side routing
   works on refresh/deep links.
4. Deploy; confirm the dashboard loads and successfully calls the Render backend
   (watch for CORS errors in the browser console on first deploy).

## 4. Continuous deployment

Both Render and Netlify auto-redeploy on push to `main` once connected to the GitHub
repo — no separate CI pipeline needed for a project this size. If later desired, a
GitHub Actions workflow could run backend tests (`mvn test`) and frontend lint/tests
(`ng test --watch=false`) on every PR before merge — worth adding once the app has a
real test suite, not before.

## 5. README checklist (root of repo)

- One-line project description + **live demo link** + **GitHub repo link**
- Screenshot or short GIF of the dashboard
- "First request may take ~30s (free-tier cold start)" note
- Local setup instructions (this doc covers hosted; local run stays in the main
  project README, since that's what a reviewer clones)
