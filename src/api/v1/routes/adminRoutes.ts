import express from "express";
import { setUserRole } from "../controllers/adminController";


const router = express.Router();

// Use the authenticateUser middleware
router.post("/admin/set-role", setUserRole);

export default router;
