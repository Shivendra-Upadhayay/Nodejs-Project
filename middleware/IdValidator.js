
import mongoose from "mongoose";


//Adding this code to check ProductId
const productIdValidator = (req, res, next) => {

	const _id = req.params.id;  // extracting id from params

	if (!mongoose.Types.ObjectId.isValid(_id)) {

		return res.status(400).json({
			success: false,
			message: "Invalid Product Id!"
		})
	}

	next();
}

//Added code to validate User Id
const userIdValidator = (req, res, next) => {

	const _id = req.params.id;  // extracting id from params

	if (!mongoose.Types.ObjectId.isValid(_id)) {

		return res.status(400).json({
			success: false,
			message: "Invalid User Id !"
		})
	}

	next();
}

export {
	productIdValidator,
	userIdValidator
}

