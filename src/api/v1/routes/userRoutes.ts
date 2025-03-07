import express from "express";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize"; 

const router = express.Router();

router.get("/user/:uid",authenticate,isAuthorized({ hasRole: ["manager"] }), getUserDetails);

export default router;
