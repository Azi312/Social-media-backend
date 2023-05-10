import express from 'express'
import { verifyToken } from '../middleware/auth.js'
import { UserController } from '../controllers/index.js'

const router = express.Router()

/* READ */
// router.get('/:id', verifyToken, getUser)
// router.get('/:id/friends', verifyToken, getUserFriends)

router.get('/:userId', verifyToken, UserController.getUser)
router.get('/:id/friends', verifyToken, UserController.getUserFriends)

/* UPDATE */
router.patch('/:userId/:friendId', verifyToken, UserController.addRemoveFriend)
// router.patch('/:id/:friendId', verifyToken, addRemoveFriend)

export default router
