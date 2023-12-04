import express from "express";
import employeesRoutes from "./routes/employees.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import ticketsRouters from "./routes/tickets.routes.js";
import vehiclesRoutes from "./routes/vehicles.routes.js";
import invetoryRoutes from "./routes/inventory.routes.js";
import adminRoutes from "./routes/admins.routes.js";
import analitycsRoutes from "./routes/analytics.routes.js"
import cors from "cors";
import multer from "multer";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createVehiclePhoto } from "./controllers/fileUpload.controller.js";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const multerUpload = multer({
  dest: join(CURRENT_DIR, "../uploads"),
  limits: {
    fileSize: 10000000,
  },
});
const app = express();


app.use(cors()); // falta configurar al pasar a produccion
app.use(express.json());

app.post('/api/upload/vehicleImages',multerUpload.array('photos'),createVehiclePhoto)
app.use("/api", employeesRoutes);
app.use("/api", customerRoutes);
app.use("/api", vehiclesRoutes);
app.use("/api", ticketsRouters);
app.use("/api", invetoryRoutes);
app.use("/api", adminRoutes);
app.use("/api",analitycsRoutes)

app.use((req, res, next) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

export default app;
