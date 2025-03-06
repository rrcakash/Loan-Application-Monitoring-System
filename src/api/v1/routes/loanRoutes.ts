import { Router } from 'express';
import { getLoans, createLoan, updateLoanStatus } from '../controllers/loanController';
import authenticate from '../middleware/authenticate'; 
import { auth } from 'src/config/firebase';

const router = Router();

// Define the API routes
router.post('/loans',authenticate, createLoan);         // Role: user
router.put('/loans/:id/review',authenticate, updateLoanStatus);   // Role: officer
router.get('/loans',authenticate, getLoans);            // Role: officer
router.put('/loans/:id/approve',authenticate, updateLoanStatus);  // Role: manager

export default router;
