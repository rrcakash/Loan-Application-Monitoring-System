import express from "express";
import { setUserRole } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { AuthorizationOptions } from "../models/authorizationOptions";

const router = express.Router();

// Use the authenticateUser middleware
router.post("/admin/set-role", authenticate, isAuthorized({ hasRole: ["manager"] }), setUserRole);


export default router;
