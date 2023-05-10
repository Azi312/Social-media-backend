import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
	{
		fullName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		friends: { type: Array, default: [] },
		city: String,
		age: String,
		university: String,
		avatarUrl: String,
	},
	{ timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User
