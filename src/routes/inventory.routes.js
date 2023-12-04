import { Router } from "express";
import {
  createItem,
  createType,
  getInventory,
  getType,
} from "./../controllers/inventory.controller.js";

const router = Router();

router.get("/inventory", getInventory);
router.post("/inventory", createItem);

router.get("/types", getType);
router.post("/types", createType);

export default router;
