import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { UserController } from '../controllers/index.js'

const router = express.Router()

/* READ */
router.get('/', UserController.getUsers)

router.get('/:userId', verifyToken, UserController.getUser)
router.get('/:id/friends', verifyToken, UserController.getUserFriends)

/* UPDATE */
router.patch('/:userId/:friendId', verifyToken, UserController.addRemoveFriend)

export default router
