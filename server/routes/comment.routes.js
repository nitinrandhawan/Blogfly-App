import { Router } from "express";
import { AddComment, DeleteComment, GetBlogComments, GetReplies } from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router=Router()

router.route('/add-comment').post(verifyJWT,AddComment)
router.route('/get-blog-comment').post(GetBlogComments)
router.route('/get-replies').post(GetReplies)
router.route('/delete-comment').post(verifyJWT,DeleteComment)

export default router