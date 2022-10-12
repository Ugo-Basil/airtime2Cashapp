import { Router } from 'express';
import { getWithdrawals, withdrawal, withdraw } from '../controller/withdrawalController';
import { auth } from '../middleware/auth';
const router = Router();

router.post('/', auth, withdrawal);
router.get('/all', auth, getWithdrawals);
router.post('/wallet', auth, withdraw);

export default router;
