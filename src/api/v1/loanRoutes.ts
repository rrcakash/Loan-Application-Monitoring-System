import express from "express";
import { getLoans } from "../controllers/loanController";

const router = express.Router();

router.get("/", getLoans);

export default router;
