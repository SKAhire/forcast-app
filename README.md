# Forcast - Energy Generation Forecasting Dashboard

A real-time energy generation forecasting dashboard that visualizes actual and forecasted wind power data from the UK electricity grid using the Elexon BMRS API.

## Live Project

🔗 **Live URL**: [https://forcast-1gm76a36y-skahires-projects.vercel.app/](https://forcast-1gm76a36y-skahires-projects.vercel.app/)

---

## Folder Structure

```
forcast-app/
├── analysis/                          # Data analysis notebooks
│   └── forecast_analysis.ipynb        # Jupyter notebook for forecast analysis
│
├── frontend/                          # React frontend application
│   ├── public/                        # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                    # Images and media
│   │   ├── components/                # React components
│   │   │   ├── Daterangepicker.tsx    # Date range selection component
│   │   │   ├── GenerationChart.tsx    # Main chart component
│   │   │   ├── HorizonSlider.tsx      # Forecast horizon slider
│   │   │   └── LoadingSpinner.tsx     # Loading indicator
│   │   ├── hooks/                     # Custom React hooks
│   │   │   ├── useActualsData.ts      # Fetch actual generation data
│   │   │   ├── useChartData.ts        # Process and transform chart data
│   │   │   └── useForecastsData.ts    # Fetch forecast data
│   │   ├── pages/                     # Page components
│   │   │   └── Home.tsx               # Main dashboard page
│   │   ├── types/                     # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/                     # Utility functions
│   │   │   ├── apiClient.ts           # API client configuration
│   │   │   └── dateUtils.ts           # Date manipulation utilities
│   │   ├── App.tsx                    # Root App component
│   │   ├── index.css                  # Global styles
│   │   └── main.tsx                   # Application entry point
│   ├── .env                           # Environment variables
│   ├── .env.example                   # Environment variables template
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.ts                 # Vite configuration
│   └── tsconfig.json                  # TypeScript configuration
│
├── server/                            # Express backend API
│   ├── src/
│   │   ├── controllers/               # Request handlers
│   │   │   ├── actuals.controller.ts  # Actuals data controller
│   │   │   └── forecasts.controller.ts
│   │   ├── lib/                       # Third-party integrations
│   │   │   └── elexon.client.ts       # Elexon API client
│   │   ├── middleware/                # Express middleware
│   │   │   └── error.middleware.ts    # Error handling middleware
│   │   ├── routes/                    # API route definitions
│   │   │   ├── actuals.routes.ts
│   │   │   └── forecasts.routes.ts
│   │   ├── services/                  # Business logic
│   │   │   ├── actuals.service.ts
│   │   │   └── forecasts.service.ts
│   │   ├── types/                     # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── app.ts                     # Express app configuration
│   │   └── index.ts                   # Server entry point
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

---

## Tech Stack

### Frontend

- **React 19** — UI framework
- **TypeScript** — Type safety
- **Vite** — Build tool
- **Tailwind CSS 4** — Styling
- **Recharts** — Data visualization
- **date-fns** — Date manipulation

### Backend

- **Express 5** — Web framework
- **TypeScript** — Type safety
- **Elexon BMRS API** — UK energy data source

---

## Why React + Node.js?

Node.js is well-suited for handling backend data logic like this — it's straightforward to scale (e.g. adding a load balancer), and critically, it gives us a proper server layer where caching can be introduced. For a data-heavy project that repeatedly fetches the same time-series windows, having a backend that can sit between the client and the upstream API is important.

The tradeoff is that we now have two separate services to host and maintain — two directories, two deployment instances, two sets of environment variables.

**What could be improved:**

- **Caching** — currently the server fetches fresh data from Elexon on every request. Since historical data doesn't change, this is unnecessary. The right approach would be to cache past time windows (e.g. with Redis) indefinitely, and cache recent data with a short expiry (e.g. 2 minutes) so it refreshes without hammering the API on every interaction.
- **Smarter fetching** — right now both actuals and forecasts are fetched simultaneously on every load. A better UX would let the user explicitly request forecast data separately, reducing unnecessary API calls.
- **Quick-select filters** — the date picker requires manual input. Adding presets like "Last 3 days", "Last week", "Last month" would make the tool significantly more usable without any backend changes.

---

## About Elexon & the Data

Elexon is part of the UK electricity market infrastructure. They run the Balancing and Settlement Code (BSC) system, which is responsible for reconciling how much electricity each generator actually produced versus what was contracted, and settling the financial difference.

The data they publish via the BMRS API reflects real grid activity. This project uses two of their public endpoints (no API key required):

### Actuals — `FUELHH`

```
GET https://data.elexon.co.uk/bmrs/api/v1/datasets/FUELHH/stream
    ?publishDateTimeFrom=2024-01-01T00:00:00Z
    &publishDateTimeTo=2024-01-02T00:00:00Z
```

Example response record:

```json
{
  "dataset": "FUELHH",
  "publishTime": "2025-05-01T02:00:00Z",
  "startTime": "2025-05-01T01:30:00Z",
  "settlementDate": "2025-05-01",
  "settlementPeriod": 6,
  "fuelType": "WIND",
  "generation": 2834
}
```

Fields used: `startTime`, `generation`, `fuelType` (filtered to `WIND` only).

`startTime` is the beginning of the 30-minute settlement window the reading covers. This is what we plot on the x-axis.

### Forecasts — `WINDFOR`

```
GET https://data.elexon.co.uk/bmrs/api/v1/datasets/WINDFOR/stream
    ?publishDateTimeFrom=2024-01-01T00:00:00Z
    &publishDateTimeTo=2024-01-02T00:00:00Z
```

Example response record:

```json
{
  "dataset": "WINDFOR",
  "publishTime": "2025-05-01T05:30:00Z",
  "startTime": "2025-04-30T20:00:00Z",
  "generation": 5154
}
```

Fields used: `startTime`, `publishTime`, `generation`.

### Forecast Horizon

The horizon is the time difference between when a forecast was published and the target time it predicts:

```
horizon = startTime - publishTime
```

For example: a forecast for 18:00 published at 14:00 has a 4-hour horizon. The dashboard exposes this as a slider (0–48 hours, default 4 hours). For each target time, we show the latest forecast whose horizon is at least the selected value — i.e. the most recent forecast that was still published at least N hours before the target.

> **Note:** There are parts of the Elexon data model (e.g. settlement period mapping, how WINDFOR forecasts are versioned) that aren't fully clear from the documentation alone. The implementation is based on observed API behaviour and may not be correct in all edge cases.

---

## Prerequisites

- **Node.js** v18 or higher
- **npm**

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SKAhire/forcast-app.git
cd forcast-app
```

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
ELEXON_API_URL=https://data.elexon.co.uk/bmrs/api/v1/datasets
```

Start the server:

```bash
npm run dev
```

The server runs on `http://localhost:3000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`.

### Running Both Together

You'll need two terminal windows:

```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd frontend && npm run dev
```

---

## API Endpoints

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/api/v1/actuals`   | Fetch actual generation data |
| GET    | `/api/v1/forecasts` | Fetch forecast data          |

Both endpoints accept:

- `from` — start datetime (ISO 8601)
- `to` — end datetime (ISO 8601)

Example:

```
GET /api/v1/actuals?from=2025-01-01T00:00:00Z&to=2025-01-07T00:00:00Z
```

---

## Features

- 📊 **Interactive chart** — actual vs forecasted wind generation overlaid on the same axis
- 📅 **Date range picker** — custom start and end time selection
- 🎚️ **Horizon slider** — adjustable forecast horizon from 0 to 48 hours
- 📱 **Responsive** — works on desktop and mobile

---

## Deployment

### Frontend → Vercel

Deployed at: **https://forcast-1gm76a36y-skahires-projects.vercel.app/**

### Backend

Can be deployed to Render, Railway, or similar Node-compatible platforms. Set `VITE_API_URL` in the frontend environment to point to the deployed backend URL.

---

## AI Usage

AI tools (Claude) were used to assist with:

- Project scaffolding and folder structure
- Boilerplate code (Express setup, middleware, component templates)
- Styling and design feedback

All core logic — forecast horizon filtering, data alignment, chart implementation, and the analysis notebook — was written independently.
