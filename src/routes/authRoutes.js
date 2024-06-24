import {Router} from 'express'
import { getMatches, googleAuth, googleAuthCallback, initiateChat, login, payment, signup, verifyOTP } from '../controller/authController.js'
import upload from '../utils/multer.js'
import {verifyToken} from '../middlewares/authMiddleware.js'
import passport from '../config/passportConfig.js'


const router=Router()


router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

router.post('/signup', upload.single('profilePhoto'),signup)
router.post('/verify-otp',verifyOTP )
router.post('/login',login)
router.get('/chat',verifyToken,initiateChat)
router.get('/payment',verifyToken,payment)
router.get('/matches',verifyToken,getMatches)

export default router