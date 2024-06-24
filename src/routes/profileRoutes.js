import {Router} from 'express'
import {createProfile,deleteProfile,getProfile,updateProfile} from '../controller/profileController.js'
import {verifyToken} from '../middlewares/authMiddleware.js'

const router=Router()
router.get('/',verifyToken, getProfile);
router.post('/',verifyToken, createProfile);
router.put('/',verifyToken,updateProfile);
router.delete('/',verifyToken, deleteProfile);


export default router