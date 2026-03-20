import express, { Application, Request, Response } from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware";
import actualRoutes from "./routes/actuals.routes";
import forecastRoutes from "./routes/forecasts.routes";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// api routes
app.use("/api/v1/actuals", actualRoutes);
app.use("/api/v1/forecasts", forecastRoutes);

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);
export default app;
