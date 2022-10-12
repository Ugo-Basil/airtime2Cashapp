import { Router } from 'express';
import {
  registerUser, loginUser, verifyUser, forgetPassword, resetPassword, updateUsers,
  setResetToken, logoutUser, resendVerificationEmail
} from '../controller/userController';
import { auth, oneTimeTokenAuth } from '../middleware/auth';
const router = Router();

router.post('/register', registerUser);
router.get('/verify/:id', resendVerificationEmail);
router.post('/verify/:id', oneTimeTokenAuth, verifyUser);
router.post('/login', loginUser);
router.patch('/forgotPassword', forgetPassword);
router.post('/resetPassword/:id', setResetToken);
router.patch('/resetPassword/:id', oneTimeTokenAuth, resetPassword);
router.patch('/update/:id', auth, updateUsers);
router.get('/logout', logoutUser)


export default router;
