import { Router } from "express";
import { getActualsHandler } from "../controllers/actuals.controller";

const router = Router();

router.get("/", getActualsHandler);

export default router;
