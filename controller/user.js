import mongoose from "mongoose";
import { User } from "../model/user.js";

// Signup user
const userSignup = async (req, res) => {

	try {
		let { firstName, lastName, username, email, password, role, isActive } = req.body; //extracting data from body

		const user = await User.findOne({
			$or: [
				{ username },
				{ email }
			]
		})  //checking user already exist

		if (user) {
			return res.status(400).json({
				success: false,
				message: "User already Signed up!"
			})
		}
		const savedUser = await new User({
			firstName,
			lastName,
			username,
			email,
			password,
			role
		}).save();

		const newUser = await User.findOne({ email }, { password: 0, createdAt: 0, updatedAt: 0 })
		return res.status(201).json({
			success: true,
			message: "User Signup Successfully!",
			newUser
		})
	} catch (error) {

		console.log(error.message)
		return res.status(500).json({
			success: false,
			message: "Getting error while creating user"
		})
	}
}

//Update User 
const updateUserDetails = async (req, res) => {

	try {
		const _id = req.params.id //extracting id from params

		const updateUser = await User.findByIdAndUpdate(
			{ _id, isActive: true },
			req.body,
			{ new: true }
		)

		if (!updateUser) {
			return res.status(404).json({
				success: false,
				message: `No Active user found with this user ID:${_id}`
			})
		}

		const updatedUser = await User.findById(_id,
			{ password: 0, createdAt: 0, updatedAt: 0 }) //removing password createdAt and updatedAt from updatedUser

		return res.status(200).json({
			success: true,
			message: "User Updated successfully !",
			updatedUser
		})
	} catch (error) {
		console.error(error.message)
		return res.status(500).json({
			success: false,
			message: "Getting Error When updating user!"
		})
	}
}
// delete user 
const deleteUser = async (req, res) => {

	try {
		const _id = req.params.id;  //extracting userid from params

		const deleteUser = await User.findByIdAndDelete(_id) //deleting user

		//checking user exist or not
		if (!deleteUser) {
			return res.status(404).json({
				success: false,
				message: `No user found to delete with this UserID: ${_id}`
			})
		}
		//success response
		return res.status(200).json({
			success: true,
			message: "User deleted Successfully!"
		})
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			message: "getting error in deleting user!"
		})
	}

}
// listing users
const getAllUsers = async (req, res) => {

	try {
		let page = Number(req.query.page) || 1;
		const totalUsers = await User.countDocuments();
		let limit = Number(req.query.limit) || 2;
		limit = limit > 50 ? 5 : Number(req.query.limit)
		const totalPage = Math.floor(totalUsers / limit)
		const offset = (page - 1) * limit;
		var sortingKey = req.query.sortingKey;
		var sortingOrder = req.query.sortingOrder;
		let allUsers;
		if (req.query.sortingKey && req.query.sortingOrder) {
			allUsers = await User.find({ "isActive": true }, { password: 0, createdAt: 0, updatedAt: 0 }).sort({ [sortingKey]: sortingOrder }).skip(offset).limit(limit)
		} else {
			allUsers = await User.find({ "isActive": true }, { password: 0, createdAt: 0, updatedAt: 0 }).skip(offset).limit(limit)
		}

		if (!allUsers) {
			return res.status(404).json({
				success: false,
				message: "No user found"
			})
		}
		//success response
		return res.status(200).json({
			success: true,
			message: "Users fetched Successfully!",
			allUsers
		})
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			message: 'Getting error when fetching users!'
		})
	}

}
// getUser by id
const getUserById = async (req, res) => {
	try {
		const _id = req.params.id;

		const user = await User.findById(_id, { password: 0, createdAt: 0, updatedAt: 0 });

		//user exist or not
		if (!user) {
			return res.status(404).json({
				success: false,
				message: `No user found with this userId ${_id}`
			})
		}
		//success
		return res.status(200).json({
			success: true,
			message: "User fetched successfully",
			user
		})
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			message: `Getting error when fetching user by userId:${_id}`
		})
	}

}

// activate user
const activateUser = async (req, res) => {
	const _id = req.params.id; //extracting id from params


	const user = await User.findOne({ _id, isActive: true })

	if (user) {
		return res.status(200).json({
			success: false,
			message: "User is already activate"
		})
	}
	const activateUser = await User.findByIdAndUpdate(
		{ _id },
		{
			$set: {
				"isActive": true
			}
		}
	)

	if (!activateUser) {
		return res.status(404).json({
			success: false,
			message: `No user found to activate with this userID: ${_id}`
		})
	}
	return res.status(200).json({
		success: true,
		message: "User activated successfully!"
	})


}

//deactivating user
const deactivateUser = async (req, res) => {
	try {
		const _id = req.params.id;
		const user = await User.findOne({ _id, isActive: false });

		if (user) {
			return res.status(400).json({
				success: false,
				message: "User is already deactivate!"
			})
		}

		const deactivateUser = await User.findByIdAndUpdate({ _id },
			{
				$set: {
					"isActive": false
				}
			}
		)
		if (!deactivateUser) {
			return res.status(404).json({
				success: false,
				message: `No user found to deactivate with this userId: ${_id}`
			})
		}
		return res.status(200).json({
			success: true,
			message: "User deactivate successfully!"
		})


	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			message: "getting error in deactivating user!"
		})
	}

}
export {
	userSignup,
	updateUserDetails,
	deleteUser,
	getAllUsers,
	getUserById,
	activateUser,
	deactivateUser
}




