import Post from '../models/Post.js'
import User from '../models/User.js'

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
		).populate('user')

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

		const post = await Post.find({ user: req.userId }).populate('user')

		res.status(201).json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Failed to create post',
		})
	}
}

export const createComment = async (req, res) => {
	try {
		const postId = req.params.id
		const { text } = req.body

		const user = await User.findById(req.userId)

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const comment = {
			text,
			user: {
				id: user._id,
				fullName: user.fullName,
				avatarUrl: user.avatarUrl,
			},
			createdAt: new Date().toLocaleString(),
		}

		const post = await Post.findByIdAndUpdate(
			postId,
			{ $push: { comments: comment } },
			{ new: true }
		).populate('user')

		if (!post) {
			return res.status(404).json({ message: 'Post not found' })
		}

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Failed to create comment' })
	}
}

export const removePost = async (req, res) => {
	try {
		const postId = req.params.id
		const userId = req.userId
		await Post.findOneAndDelete({ _id: postId }).then(doc => {
			if (!doc) {
				return res.status(404).json({ message: 'Filed to delete post' })
			}
		})

		const posts = await Post.find({ user: userId }).populate('user').exec()
		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({
			message: 'Failed to delete post',
		})
	}
}

export const removeComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params

		const post = await Post.findOne({ _id: postId })

		if (!post) {
			return res.status(404).json({ message: 'Post not found' })
		}

		const commentIndex = post.comments.findIndex(
			comment => comment._id.toString() === commentId.toString()
		)

		if (commentIndex === -1) {
			return res.status(404).json({ message: 'Comment not found' })
		}

		post.comments.splice(commentIndex, 1)

		await post.save()

		res.status(200).json({ message: 'Comment deleted successfully' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}
