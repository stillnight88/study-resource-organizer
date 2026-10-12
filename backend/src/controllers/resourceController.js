import path from "path";
import fs from "fs";
import Resource from "../models/Resource.js";
import User from "../models/User.js";
import { uploadsDir } from "../middleware/upload.js";

const isAdmin = async (email) => {
    const user = await User.findOne({ email });
    return user && user.role === "admin";
};

export const getResources = async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const addResource = async (req, res) => {
    try {
        const { title, description, category, userEmail } = req.body;

        if (!(await isAdmin(userEmail))) {
            return res.status(403).json({ message: "Only admin can add resources" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const newResource = await Resource.create({
            title,
            description,
            category,
            filePath: `/uploads/${req.file.filename}`,
            fileName: req.file.originalname,
        });

        res.status(201).json({ message: "Resource added", resource: newResource });
    } catch (error) {
        console.error("Error adding resource:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteResource = async (req, res) => {
    try {
        const { userEmail } = req.body;

        if (!(await isAdmin(userEmail))) {
            return res.status(403).json({ message: "Only admin can delete resources" });
        }

        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }

        const filePath = path.join(uploadsDir, path.basename(resource.filePath));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await resource.deleteOne();
        res.json({ message: "Resource deleted" });
    } catch (error) {
        console.error("Error deleting resource:", error);
        res.status(500).json({ message: "Server error" });
    }
};