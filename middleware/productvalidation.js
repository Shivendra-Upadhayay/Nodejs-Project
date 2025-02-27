import joi from "joi"
import { unlinkFile } from "../utility/fileUnlink.js";
import path from "path"

// Added validation to check product at the time of adding product
const addProductValidator = async (req, res, next) => {

	const addProductSchema = joi.object({
		name: joi.string().min(4).max(20).required(),
		price: joi.number().min(0).max(10000).required(),
		category: joi.string().valid("Men's cloth", "Women's cloth").required(),
		description: joi.string().min(4).max(100).required(),
		isActive: joi.boolean().optional(),

	})
	const { error } = addProductSchema.validate(req.body, { abortEarly: false });

	let errors = [];

	if (error) {
		errors = error.details.map(detail => { return detail.message.replace(/"/g, '') })
	}
	// if (req.isValidFile === 1) {
	// 	errors.push({ name: "Only(jpg,jpeg,png) file are allowed!" })
	// } else if (!req.file) {
	// 	errors.push({ name: "Image is required" })
	// }


	if (errors.length > 0) {
		if (req.file) {
			unlinkFile(req.file.path)
		}
		return res.status(400).json({
			message: error?.name,
			success: false,
			errors
		})
	}

	next();
}

// Added validation to check product at the time of updating product details
const updateProductValidator = async (req, res, next) => {

	const updatedProductSchema = joi.object({
		price: joi.number().min(0).max(10000).optional(),
		category: joi.string().valid("Men's cloth", "Women's cloth").optional(),
		description: joi.string().min(4).max(100).optional(),
		isActive: joi.boolean().optional(),
	})

	const { error } = updatedProductSchema.validate(req.body)
	if (error) {
		if (req.file && req.file.path) {
			unlinkFile(req.file.path)
		}
		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map(detail => detail.message.replace(/"/g, ""))
		})
	}
	next()
}

//Adding Code to validate product input on the time of activation
const productActivateValidator = async (req, res, next) => {

	const productActivateSchema = joi.object({
		isActive: joi.boolean().valid(true).required()
	})

	const { error } = productActivateSchema.validate(req.body, { abortEarly: false })

	if (error) {
		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map(detail => detail.message.replace(/"/g, ""))
		})
	}

	next();

}

// Deactivating Product Validator
const productDeactivateValidator = async (req, res, next) => {

	const deactivateProductSchema = joi.object({
		isActive: joi.boolean().validate(false).required()
	})

	const { error } = deactivateProductSchema.validate(req.body, { abortEarly: false });

	if (error) {
		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map(detail => detail.message.replace(/"/g, ""))
		})
	}
}



export {
	addProductValidator,
	updateProductValidator,
	productActivateValidator,
	productDeactivateValidator
}