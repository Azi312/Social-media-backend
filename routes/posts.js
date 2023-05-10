import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { PostController } from '../controllers/index.js'

const router = express.Router()

/* CREATE */

/* READ */
// router.get('/', verifyToken, getFeedPosts)
// router.get('/:userId/posts', verifyToken, getUserPosts)

router.get('/:userId/posts', verifyToken, PostController.getUserPosts)
/* UPDATE */
router.patch('/:id/like', verifyToken, PostController.likePost)
// router.patch('/:id/like', verifyToken, likePost)

export default router
