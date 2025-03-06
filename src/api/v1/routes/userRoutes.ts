import express from "express";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize"; // Import the authorization middleware

const router = express.Router();

router.get("/user/:uid",authenticate,isAuthorized({ hasRole: ["user"] }), getUserDetails);

export default router;
