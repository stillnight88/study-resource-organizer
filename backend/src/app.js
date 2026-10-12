
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/userRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Study Resource Organizer API is running",
  });
});

app.use("/api/users", userRoutes);
app.use("/api", resourceRoutes);

export default app;
