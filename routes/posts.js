import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { PostController } from '../controllers/index.js'

const router = express.Router()

/* READ */

router.get('/:userId/posts', verifyToken, PostController.getUserPosts)
/* UPDATE */
router.patch('/:id/like', verifyToken, PostController.likePost)

export default router
