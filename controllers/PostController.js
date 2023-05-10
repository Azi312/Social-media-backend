import Post from '../models/Post.js'

export const getAll = async (req, res) => {
	try {
		const posts = await Post.find().populate('user').exec()
		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Failed to get posts',
		})
	}
}

export const getUserPosts = async (req, res) => {
	try {
		const { userId } = req.params
		const post = await Post.find({ user: userId }).populate('user')
		if (post.length === 0) {
			return res.status(404).json({ message: 'User has no posts' })
		}
		res.status(200).json(post)
	} catch (err) {
		res.status(404).json({ message: err.message })
	}
}

export const likePost = async (req, res) => {
	try {
		const { id } = req.params
		const { userId } = req.body
		const post = await Post.findById({ _id: id })
		const isLiked = post.likes.get(userId)

		if (isLiked) {
			post.likes.delete(userId)
		} else {
			post.likes.set(userId, true)
		}

		const updatedPost = await Post.findByIdAndUpdate(
			id,
			{ likes: post.likes },
			{ new: true }
		)

		res.status(200).json(updatedPost)
	} catch (err) {
		res.status(404).json({ message: err.message })
	}
}

export const create = async (req, res) => {
	try {
		const newPost = new Post({
			description: req.body.description,
			likes: {},
			imageUrl: req.body.imageUrl,
			user: req.userId,
		})

		await newPost.save()

		const post = await Post.find()

		res.status(201).json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Failed to create post',
		})
	}
}
