import express from "express";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";

const router = express.Router();

router.get("/user/:uid",authenticate, getUserDetails);

export default router;
