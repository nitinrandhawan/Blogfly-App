import { Router } from "express";
import { AllLatestBlogsCount, GetBlog, createBlog, LatestBlogs, SearchBlogs, SearchBlogsCount, SearchProfile, SearchUsers, TrendingBlogs, LikeBlog, isLikedByUser } from "../controllers/blog.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = Router();

router.route("/create-blog").post(verifyJWT, createBlog);
router.route("/latest-blogs").post(LatestBlogs)
router.route("/all-latest-blogs-count").post(AllLatestBlogsCount)
router.route("/trending-blogs").get(TrendingBlogs)
router.route("/search-blogs").post(SearchBlogs)
router.route("/search-blogs-count").post(SearchBlogsCount)
router.route("/search-user").post(SearchUsers)
router.route("/search-profile").post(SearchProfile)
router.route("/get-blog").post(GetBlog)
router.route("/like-blog").post(verifyJWT,LikeBlog)
router.route("/isliked-by-user").post(verifyJWT,isLikedByUser)

export default router;
