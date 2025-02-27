import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({

	firstName: {
		type: String,
		required: true,
		trim: true
	},

	lastName: {
		type: String,
		required: true,
		trime: true
	},
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	role: {
		type: String,
		enum: ["developer", "tester"],
		required: true
	},
	isActive: {
		type: Boolean,
		default: true
	}
},
	{ versionKey: false, timestamps: true }

)
userSchema.pre('save', async function (next) {
	var user = this;
	if (this.isModified(user.password)) {
		return next();
	}
	const hashedPassword = await bcrypt.hash(user.password, 10)
	user.password = hashedPassword;
	next()
})

const User = mongoose.model("User", userSchema)

export {
	User
}