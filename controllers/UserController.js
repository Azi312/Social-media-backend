import User from '../models/User.js'

export const getUsers = async (req, res) => {
	try {
		const { search: search } = req.query

		const filter = {}

		if (search) {
			filter.fullName = {
				$regex: new RegExp(search, 'i'),
			}
		}

		const items = await User.find(filter)

		res.json(items)
	} catch (err) {
		res.status(404).json({ message: err.message })
	}
}

export const getUser = async (req, res) => {
	try {
		const { userId } = req.params
		const user = await User.findById({ _id: userId })
		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}
		res.status(200).json(user)
	} catch (err) {
		res.status(404).json({ message: err.message })
	}
}

export const getUserFriends = async (req, res) => {
	try {
		const { id } = req.params
		const user = await User.findById({ _id: id })

		const friends = await Promise.all(
			user.friends.map(id => User.findById({ _id: id }))
		)
		const formattedFriends = friends.map(
			({ _id, fullName, avatarUrl, age, city, university }) => {
				return { _id, fullName, avatarUrl, age, city, university }
			}
		)
		res.status(200).json(formattedFriends)
	} catch (err) {
		res.status(404).json({ message: err.message })
	}
}

export const addRemoveFriend = async (req, res) => {
	try {
		const { userId, friendId } = req.params
		const user = await User.findById(userId)
		const friend = await User.findById(friendId)
		console.log(userId, friendId)

		if (user.friends.includes(friendId)) {
			user.friends = user.friends.filter(id => id !== friendId)
			friend.friends = friend.friends.filter(id => id !== userId)
		} else {
			user.friends.push(friendId)
			friend.friends.push(userId)
		}
		await user.save()
		await friend.save()

		const friends = await Promise.all(user.friends.map(id => User.findById(id)))
		const formattedFriends = friends.map(
			({ _id, fullName, avatarUrl, age, city, university }) => {
				return { _id, fullName, avatarUrl, age, city, university }
			}
		)

		res.status(200).json(formattedFriends)
	} catch (err) {
		res.status(404).json({ message: err.message })
	}
}
