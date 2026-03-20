import { Request, Response } from "express";
import { getForecastsData } from "../services/forecasts.service";

export async function getForecastsHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { startTime, endTime } = req.query;

    console.log("request params:", { startTime, endTime });

    if (!startTime || !endTime) {
      res.status(400).json({
        error: "Missing required query parameters: startTime, endTime",
      });
      return;
    }
    const start = new Date(startTime as string);
    const end = new Date(endTime as string);

    const forecasts = await getForecastsData(start, end);

    console.log("forecasts:", forecasts);
    res.status(200).json(forecasts);
  } catch (error) {
    console.error("Error fetching forecasts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
