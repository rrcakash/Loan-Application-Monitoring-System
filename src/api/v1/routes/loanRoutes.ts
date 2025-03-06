import { Router } from 'express';
import { getLoans, createLoan, updateLoanStatus } from '../controllers/loanController';

const router = Router();

// Define the API routes
router.post('/loans', createLoan);         // Role: user
router.put('/loans/:id/review', updateLoanStatus);   // Role: officer
router.get('/loans', getLoans);            // Role: officer
router.put('/loans/:id/approve', updateLoanStatus);  // Role: manager

export default router;
