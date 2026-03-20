import { Request, Response } from "express";
import { getActualsData } from "../services/actuals.service";

export async function getActualsHandler(
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

    const actuals = await getActualsData(start, end);

    console.log("actuals:", actuals);
    res.status(200).json(actuals);
  } catch (error) {
    console.error("Error fetching actuals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
