import express from 'express'
import mongoose from 'mongoose'
import cloudinary from './utils/cloudinary.js'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

import { PostController, UserController } from './controllers/index.js'

import { verifyToken } from './middleware/auth.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB')
	})
	.catch(err => {
		console.log('Error MongoDB', err)
	})

const app = express()
const port = 4444

const upload = multer({ dest: 'uploads/' })

app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(morgan('common'))
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use('/uploads', express.static('uploads'))

/* ROUTES */
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

app.post('/upload-coverPicture', upload.single('cover'), async (req, res) => {
	try {
		const result = await cloudinary.uploader.upload(req.file.path)
		res.json({ url: result.secure_url })
	} catch (error) {
		res.status(500).json({ message: 'Failed to upload avatar' })
	}
})

app.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
	try {
		const result = await cloudinary.uploader.upload(req.file.path)
		res.json({ url: result.secure_url })
	} catch (error) {
		res.status(500).json({ message: 'Failed to upload avatar' })
	}
})

app.post('/upload', upload.single('image'), async (req, res) => {
	try {
		const result = await cloudinary.uploader.upload(req.file.path)
		res.json({ url: result.secure_url })
	} catch (err) {
		console.error(err)
		res.status(500).json({ message: 'Failed to upload image' })
	}
})

app.listen(process.env.PORT || 4444, err => {
	if (err) {
		return console.log('something bad happened', err)
	}
	console.log(`App listening on port ${port}`)
})
