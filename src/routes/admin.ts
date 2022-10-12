import { Router } from 'express';
import { elevateToAdmin, revokeAdmin } from '../controller/adminController';
import { creditWallet } from '../controller/walletController';
import { auth, adminAuth, superAdminAuth } from '../middleware/auth';
const router = Router();

router.post('/add', auth, superAdminAuth, elevateToAdmin);
router.post('/revoke', auth, superAdminAuth, revokeAdmin);
router.patch('/wallet', auth, adminAuth, creditWallet)

export default router;
