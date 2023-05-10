import express from 'express'
import { AuthController } from '../controllers/index.js'

const router = express.Router()

router.post('/login', AuthController.login)
router.post(
	'/register',
	// registerValidation,
	// handleValidationErrors,
	AuthController.register
)

export default router
