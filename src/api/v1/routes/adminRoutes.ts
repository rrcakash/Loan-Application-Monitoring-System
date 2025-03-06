import express from "express";
import { setUserRole } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

// Use the authenticateUser middleware
router.post("/admin/set-role",authenticate, setUserRole);

export default router;
