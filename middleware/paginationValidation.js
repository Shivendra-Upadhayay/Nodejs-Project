import joi from "joi"


//Added code to validate pagination, sorting to product
const userPaginationValidation = (req, res, next) => {
	const paginationSchema = joi.object({
		page: joi.number().min(0).optional(),
		limit: joi.number().min(0).optional(),
		sortingKey: joi.string().valid("firstName", "username").optional(),
		sortingOrder: joi.string().valid("asc", "desc")

	})

	const { error } = paginationSchema.validate(req.query, { abortEarly: false })

	if (error) {

		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map((detail) => detail.message.replace(/"/g, ""))
		})
	}
	next()
}


//Added code to validate pagination , sorting to product
const productPaginationValidation = (req, res, next) => {
	const paginationSchema = joi.object({
		page: joi.number().min(0).optional(),
		limit: joi.number().min(0).optional(),
		sortingKey: joi.string().valid("name", "price").optional(),
		sortingOrder: joi.string().valid("asc", "desc", "ascending", "descending")

	})

	const { error } = paginationSchema.validate(req.query, { abortEarly: false })

	if (error) {

		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map((detail) => detail.message.replace(/"/g, ""))
		})
	}
	next()
}
export {
	userPaginationValidation,
	productPaginationValidation
}