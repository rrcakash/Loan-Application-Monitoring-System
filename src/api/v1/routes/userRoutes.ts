import express from "express";
import { getUserDetails } from "../controllers/userController";


const router = express.Router();

router.get("/user/:uid", getUserDetails);

export default router;
