import express from 'express';
import PostController from "../controllers/post"
import PostMiddleware from '../middlewares/post';

const router = express.Router();

router.post("/", PostMiddleware.inspectPost, PostController.postArticle);
router.get("/", PostController.getPosts)

export default router;