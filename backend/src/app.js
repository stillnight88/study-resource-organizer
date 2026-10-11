import express from "express";
import cors from "cors";
import { uploadsDir } from "./middleware/upload.js";
import userRoutes from "./routes/userRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Study Resource Organizer API is running",
  });
});

app.use("/", userRoutes);
app.use("/", resourceRoutes);

export default app;