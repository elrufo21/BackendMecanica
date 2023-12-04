import { Router } from "express";
import {
  getEmployees,
  createEmployee,
  getEmployee,
  deleteEmployee,
  updateEmployee,
  getActiveEmploye,
  createTypeEmployee,
  getEmployeeType,
} from "../controllers/employees.controllers.js";

const router = Router();

router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployee);
router.get("/activeEmploye", getActiveEmploye);
router.get("/employeeType", getEmployeeType);
router.post("/employee", createEmployee);
router.post("/typeEmployee", createTypeEmployee);
router.delete("/employees/:id", deleteEmployee);
router.patch("/employee/:id", updateEmployee);

export default router;
