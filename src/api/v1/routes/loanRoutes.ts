import { Router } from 'express';
import { getLoans, createLoan, updateLoanStatus } from '../controllers/loanController';
import authenticate from '../middleware/authenticate'; 
import isAuthorized from "../middleware/authorize";


const router = Router();

// Define the API routes
router.post("/loans", authenticate, isAuthorized({ hasRole: ["user"] }), createLoan);
router.put("/loans/:id/review", authenticate, isAuthorized({ hasRole: ["officer","manager"] }), updateLoanStatus);
router.get("/loans", authenticate, getLoans);
router.put("/loans/:id/approve", authenticate, isAuthorized({ hasRole: ["manager"] }), updateLoanStatus);

export default router;
