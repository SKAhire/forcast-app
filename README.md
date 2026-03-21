# Forcast — UK Wind Generation Forecast Monitor

A dashboard for visualising actual vs. forecasted wind power generation across the UK national grid, built on live data from the Elexon BMRS API.

## Live Project

🔗 **[https://forcast-1gm76a36y-skahires-projects.vercel.app/](https://forcast-1gm76a36y-skahires-projects.vercel.app/)**

---

## Folder Structure

```
forcast-app/
├── analysis/
│   └── forecast_analysis.ipynb        # Forecast error & reliability analysis
│
├── frontend/                          # React application
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Daterangepicker.tsx
│   │   │   ├── GenerationChart.tsx
│   │   │   ├── HorizonSlider.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── hooks/
│   │   │   ├── useActualsData.ts
│   │   │   ├── useChartData.ts
│   │   │   └── useForecastsData.ts
│   │   ├── pages/
│   │   │   └── Home.tsx
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── apiClient.ts
│   │   │   └── dateUtils.ts
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/                            # Express API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── actuals.controller.ts
│   │   │   └── forecasts.controller.ts
│   │   ├── lib/
│   │   │   └── elexon.client.ts
│   │   ├── middleware/
│   │   │   └── error.middleware.ts
│   │   ├── routes/
│   │   │   ├── actuals.routes.ts
│   │   │   └── forecasts.routes.ts
│   │   ├── services/
│   │   │   ├── actuals.service.ts
│   │   │   └── forecasts.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Tech Stack

| Layer     | Technology         | Reason                                                                 |
|-----------|--------------------|------------------------------------------------------------------------|
| Frontend  | React 19 + Vite    | Component model suits a dashboard with independent, stateful controls  |
| Styling   | Tailwind CSS 4     | Utility-first; no context switching between CSS files and components   |
| Charts    | Recharts           | Composable React-native chart primitives; no canvas API overhead       |
| Dates     | date-fns           | Tree-shakeable, immutable, no prototype pollution                      |
| Backend   | Node.js + Express 5| Non-blocking I/O fits the workload — proxying external API calls       |
| Language  | TypeScript         | Shared type contracts between frontend and backend prevent data-shape bugs at the boundary |

---

## Architectural Decisions

### Why a separate backend instead of calling Elexon directly from the browser?

The Elexon BMRS API is a public API with no authentication, so technically you could call it directly from the frontend. There are two reasons not to:

1. **Caching.** Historical energy data doesn't change — a query for January 2025 actuals will return the same result today as it will in six months. Without a server layer, every page load or date range change results in a fresh upstream call. The backend implements in-memory caching (keyed by date range) so repeated queries for the same window are served instantly without hitting Elexon.

2. **Data shaping.** The FUELHH endpoint returns every fuel type (coal, gas, nuclear, biomass, wind, etc.) in a single response. Filtering to `fuelType === "WIND"` and stripping irrelevant fields on the server means the frontend receives only what it needs, keeping payloads small.

### Why is the forecast horizon filter on the frontend, not the backend?

The horizon slider is a UI control — it changes how the same underlying data is presented, not what data is fetched. For any given date window, the backend returns all forecasts in the 0–48hr horizon band. The client then applies the horizon constraint locally:

```
show the latest forecast for each target time where:
  targetTime - publishTime >= selectedHorizonHours
```

If the horizon filter lived on the backend, every slider movement would trigger a new network round-trip for data that's already in the client. Keeping it on the frontend means the slider is instant.

### Why React + Node rather than a full-stack framework (Next.js)?

A full-stack framework would eliminate the two-deployment overhead, but it would also make the caching layer harder to reason about — server components, ISR, and route caching all interact in non-obvious ways for a data-heavy use case like this. Keeping the backend as an explicit Express service means the cache behaviour is straightforward and easy to inspect or replace.

The trade-off is two deployments to manage (Vercel for the frontend, Render for the backend). That's an acceptable cost for this scale.

---

## Data Sources

Both APIs are publicly available from [Elexon BMRS](https://bmrs.elexon.co.uk/api-documentation). Elexon operates the UK's Balancing and Settlement Code (BSC) system — they're the body responsible for reconciling how much electricity each generator produced against what was contracted, and settling the difference financially. The data they publish reflects real grid activity.

### Actual generation — `FUELHH`

```
GET /datasets/FUELHH/stream
    ?publishDateTimeFrom=2025-01-01T00:00:00Z
    &publishDateTimeTo=2025-01-02T00:00:00Z
```

Returns half-hourly actual generation figures for every fuel type on the grid. We use:

- `startTime` — the start of the 30-minute settlement window this reading covers
- `generation` — MW generated during that window
- `fuelType` — filtered to `"WIND"` only

`settlementDate` and `settlementPeriod` are the market's legacy identifiers for the same window (period 1 = 00:00–00:30, period 48 = 23:30–00:00). `startTime` is the ISO equivalent and is what we use.

### Forecasts — `WINDFOR`

```
GET /datasets/WINDFOR/stream
    ?publishDateTimeFrom=2025-01-01T00:00:00Z
    &publishDateTimeTo=2025-01-02T00:00:00Z
```

Returns wind generation forecasts. We use:

- `startTime` — the target time this forecast is predicting generation for
- `publishTime` — when this forecast was created
- `generation` — the forecasted MW value

The difference `startTime - publishTime` is the forecast horizon. A record where `startTime` is `2025-01-01T18:00Z` and `publishTime` is `2025-01-01T14:00Z` represents a 4-hour-ahead forecast.

We apply two filters on ingest:
- Only records where `startTime >= 2025-01-01` (per the assignment spec)
- Only records where the horizon is between 0 and 48 hours

---

## Setup Instructions

### Prerequisites

- Node.js v18+
- npm

### Backend

```bash
cd server
npm install
cp .env.example .env
npm run dev       # starts on http://localhost:3000
```

`.env` values:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ELEXON_API_URL=https://data.elexon.co.uk/bmrs/api/v1/datasets
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev       # starts on http://localhost:5173
```

`.env` values:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

---

## API Endpoints

| Method | Endpoint              | Query params         | Description                    |
|--------|-----------------------|----------------------|--------------------------------|
| GET    | `/api/v1/actuals`     | `from`, `to` (ISO)   | Actual wind generation         |
| GET    | `/api/v1/forecasts`   | `from`, `to` (ISO)   | Raw forecasts for the window   |

---

## Known Limitations & What I Would Improve

### Replace in-memory cache with Redis

The current cache uses `node-cache`, which is process-bound. In a multi-instance deployment, each process maintains its own cache — meaning a load balancer distributing traffic across two instances halves the cache hit rate and doubles upstream API calls. Redis would give a single shared cache across all instances, which is the correct solution at any meaningful scale.

### Smarter cache TTL strategy

Right now all responses share a single TTL. Historical data (anything more than a few hours old) never changes and could be cached indefinitely. Recent data (last 1–2 hours) changes as actuals are published. A two-tier TTL — long for historical windows, short for recent ones — would reduce unnecessary upstream calls while keeping live data fresh.

### Lazy forecast fetching

Both actuals and forecasts are fetched on every page load. A user might only want to see actuals for a date range without the overlay. Adding an explicit toggle would halve the number of API calls in the common case.

### Preset date range shortcuts

Manually entering start and end times is friction. Shortcuts like "Last 24h", "Last 7 days", "Last 30 days" would cover the majority of use cases and make the tool significantly faster to use in practice.

---

## AI Tools Used

This project was built with assistance from Claude (Anthropic) for:
- Initial project scaffolding
- Component skeleton for the date range picker and horizon slider
- Jupyter notebook structure

All core logic — forecast horizon filtering, data alignment, chart implementation, analysis reasoning, and architectural decisions — was written independently.