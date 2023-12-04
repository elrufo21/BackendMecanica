import { Router } from "express";
import {
  createCustomer,
  getCustomer,
  getCustomerVehiclePhoto,
  updateCustomer,
  getCustomerCount
} from "../controllers/customer.controllers.js";

const router = Router();

router.get("/customers", getCustomer);
router.get("/customer/:id", getCustomerVehiclePhoto);
router.get("/customers/count", getCustomerCount);
router.post("/customers", createCustomer);
router.patch("/customers/:id", updateCustomer);

export default router;
