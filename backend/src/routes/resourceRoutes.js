
import express from "express";
import upload from "../middleware/upload.js";
import {
  getResources,
  addResource,
  deleteResource,
} from "../controllers/resourceController.js";

const router = express.Router();

router.get("/resources", getResources);
router.post("/resources", upload.single("file"), addResource);
router.delete("/resources/:id", deleteResource);

export default router;
