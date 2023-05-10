import mongoose from 'mongoose'

const postSchema = new mongoose.Schema(
	{
		description: { type: String, required: true },
		likes: { type: Map, of: Boolean },
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		imageUrl: String,
	},
	{ timestamps: true }
)

const Post = mongoose.model('Post', postSchema)

export default Post
