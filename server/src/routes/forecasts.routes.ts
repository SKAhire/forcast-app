import { Router } from "express";
import { getForecastsHandler } from "../controllers/forecasts.controller";

const router = Router();

router.get("/", getForecastsHandler);

export default router;
