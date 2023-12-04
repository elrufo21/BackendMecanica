import { Router } from "express";
import {
  getEmloyeeAnalityc,
  getIncomeTickets,
} from "../controllers/analytics.controller.js";

const router = Router();

router.get("/analytics/incoming", getIncomeTickets);
router.get("/analytic/employee", getEmloyeeAnalityc);
export default router;
