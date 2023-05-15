import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { PostController } from '../controllers/index.js'

const router = express.Router()

/* CREATE */
router.post('/', verifyToken, PostController.create)
router.post('/:id/comments', verifyToken, PostController.createComment)

/* READ */
router.get('/', PostController.getAll)
router.get('/:userId/posts', verifyToken, PostController.getUserPosts)

/* UPDATE */
router.patch('/:id/like', verifyToken, PostController.likePost)

/* Delete */
router.delete('/:id', verifyToken, PostController.removePost)
router.delete('/:id/comments', verifyToken, PostController.removeComment)

export default router
