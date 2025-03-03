import joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const joiPassword = joi.extend(joiPasswordExtendCore);

//usersignup validator
const userSignupInputValidator = async (req, res, next) => {

	const userSchema = joi.object({
		firstName: joi.string().required().min(3).max(15),
		lastName: joi.string().required().min(3).max(20),
		username: joi.string().alphanum().max(15).required().min(4),
		email: joi.string().email().required().min(12).max(25),
		password: joiPassword
			.string()
			.minOfSpecialCharacters(1)
			.minOfLowercase(2)
			.minOfUppercase(2)
			.minOfNumeric(1)
			.noWhiteSpaces()
			.onlyLatinCharacters()
			.doesNotInclude(['password'])
			.required().min(6).max(20),
		role: joi.string().valid("developer", "tester").required(),
		isActive: joi.boolean().optional()
	})

	const { error } = userSchema.validate(req.body, { abortEarly: false })

	if (error) {
		return res.status(400).json({
			success: false,
			message: error?.name,
			error: error?.details.map(detail => detail.message.replace(/"/g, ""))
		})
	}

	next();

}
//userupdate validator
const updateUserDetailsValidator = async (req, res, next) => {

	const updateUserSchema = joi.object({
		firstName: joi.string().min(3).max(15).optional(),
		lastName: joi.string().min(3).max(20).optional(),
		role: joi.string().valid("developer", "tester").optional()

	})

	const { error } = updateUserSchema.validate(req.body, { abortEarly: false })
	if (error) {
		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map(detail => detail.message.replace(/"/g, ""))
		})
	}

	next();
}
// userActivate Validator
const userActivateValidator = async (req, res, next) => {
	const activateUserSchema = joi.object({
		isActive: joi.boolean().valid(true).required()
	})
	const { error } = activateUserSchema.validate(req.body, { abortEarly: false });
	if (error) {
		return res.status(400).json({
			success: false,
			message: error.name,
			error: error.details.map(error => error.message.replace(/"/g, "").replace(/\[true\]/g, "true"))
		})
	}
	next()
}
// userdeactivate Validator
const userDeactivateValidator = async (req, res, next) => {

	const userDeactivateSchema = joi.object({
		isActive: joi.boolean().valid(false).required()
	})
	const { error } = userDeactivateSchema.validate(req.body, { abortEarly: false });
	if (error) {
		return res.status(400).json({
			success: false,
			message: error.name,
			errror: error.details.map(detail => detail.message.replace(/"/g, "").replace(/\[false\]/g, "false"))
		})
	}
	next()
}


export {
	userSignupInputValidator,
	updateUserDetailsValidator,
	userActivateValidator,
	userDeactivateValidator

}