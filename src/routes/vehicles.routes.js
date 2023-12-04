import { Router } from "express";
import {
  getVehicle,
  getVehicles,
  createVehicle,
  updateVehicle,
  getVehicleCustomer,
} from "../controllers/vehicles.controllers.js";

const router = Router();

router.get("/vehicles", getVehicles);
router.get("/vehiclesCustomers", getVehicleCustomer);
router.get("/vehicles/:id", getVehicle);
router.post("/vehicles", createVehicle);
router.patch("/vehicles/:id", updateVehicle);
export default router;
