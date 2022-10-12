import { Router } from 'express';
import { createAccount, getAccounts, deleteAccount, updateAccount } from '../controller/accountController';
import { auth } from '../middleware/auth';
const router = Router();

router.get('/', auth, getAccounts);
router.post('/add', auth, createAccount);
router.patch('/update/:id', auth, updateAccount);
router.delete('/delete/:id', auth, deleteAccount);

export default router;



