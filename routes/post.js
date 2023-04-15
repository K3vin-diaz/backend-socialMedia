import express from 'express';
import { getFeedPosts, getUserPost, likePost} from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

/* READ */

router.get("/",verifyToken, getFeedPosts);
router.get("/:userId/post", verifyToken, getUserPost);

/* UPDATE */
router.patch("/:id/like",verifyToken, likePost);


export default router;