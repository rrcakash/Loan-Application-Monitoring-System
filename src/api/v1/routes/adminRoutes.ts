import express from "express";
import { setUserRole } from "../controllers/adminController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = express.Router();

// Use the authenticateUser middleware
router.post("/set-role", authenticateUser, setUserRole);

export default router;
