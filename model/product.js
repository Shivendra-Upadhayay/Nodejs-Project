import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	price: {
		type: Number,
		required: true
	},
	category: {
		type: String,
		enum: ["Men's cloth", "Women's cloth"],
		required: true
	},
	description: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true,
		trim: true
	},
	isActive: {
		type: Boolean,
		default: true
	}

}, { versionKey: false, timestamps: true })

const Product = mongoose.model("Product", productSchema)

export {
	Product
}