
import { Router } from 'express';
import { createTransaction, getTransactions, uniqueTransaction, confirmTransaction, cancelTransaction, getOneTransaction } from '../controller/transactionController';
import { adminAuth, auth } from '../middleware/auth';
const router = Router();

router.post('/:id', auth, createTransaction)
router.get('/transactions/:type', auth, adminAuth, getTransactions)
router.get('/:id', auth, uniqueTransaction)
router.get('/transaction/:id', auth, adminAuth, getOneTransaction)
router.patch('/confirm/:id', auth, adminAuth, confirmTransaction)
router.patch('/cancel/:id', auth, adminAuth, cancelTransaction)

export default router;
