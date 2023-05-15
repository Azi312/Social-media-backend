import mongoose from 'mongoose'
import Comment from './Comment.js'

const postSchema = new mongoose.Schema(
	{
		description: { type: String, required: true },
		likes: { type: Map, of: Boolean },
		comments: [Comment.schema],
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		imageUrl: String,
	},
	{ timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
