import { Router } from "express";
import { googleAuth, signIn, signUp, uploadBanner } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route('/sign-up').post(signUp)
router.route('/sign-in').post(signIn)
router.route('/google-auth').post(googleAuth)
router.route('/get-upload-url').post(
    upload.single('image'),
    uploadBanner)
export default router