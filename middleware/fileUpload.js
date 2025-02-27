import multer, { MulterError } from "multer";
import path from "path";
import { unlinkFile } from "../utility/fileUnlink.js";

// Added code to store file and setting filename 
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images")
	},

	filename: function (req, file, cb) {
		let filename = `${Date.now()}_${file.originalname}`
		console.log(filename.split(" "))
		console.log(filename.split(" ").join("_"))
		cb(null, filename.split(" ").join("_"))
	}
})

const upload = multer({
	storage
})

// Added code to upload  and validate file 
const uploadFileandValidate = async (req, res, next) => {

	await upload.single('image')(req, res, (err) => {

		if (err instanceof multer.MulterError) {
			// A Multer error occurred when uploading.
			if (err && err.field !== "image") {
				if (err.field !== "image") {
					return res.status(400).json({
						success: false,
						error: `${err.field} is not allowed!`
					})
				}
			} else {
				return res.status(400).json({
					success: false,
					error: err
				})
			}
		}

		const allowedFileType = [
			'image/png',
			'image/jpeg',
			'image/jpg'
		]

		const maxFileSize = 5 * 1024 * 1024;

		let errors = []

		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: "Image is required!"
			})
		}

		if (!allowedFileType.includes(req.file.mimetype)) {

			errors.push({ message: "Only jpg,jpeg,png type file is allowed!" })

		}

		if (req.file.size > maxFileSize) {
			errors.push({ message: "Only 5Mb size file is allowed!" })
		}

		if (errors.length > 0) {
			if (req.file) {
				unlinkFile(req.file.path)
			}

			return res.status(400).json({
				success: false,
				error: errors
			})
		}
		next();
	})
}

const uploadFileAndValidateOnUpdate = async (req, res, next) => {

	await upload.single('image')(req, res, (err) => {
		if (err instanceof MulterError) {
			if (err.field !== "image") {

				return res.status(400).json({
					success: false,
					error: `${err.field} is not allowed!`
				})
			} else {

				return res.status(400).json({
					success: false,
					error: err
				})

			}
		}

		const allowedFileType = [
			'image/png',
			'image/jpeg',
			'image/jpg'
		]

		const maxFileSize = 5 * 1024 * 1024; //5Mb filesize

		let errors = [];
		if (req.file) {
			if (!allowedFileType.includes(req?.file?.mimetype)) {

				errors.push({ message: "Only jpg,jpeg,png type file is allowed!" })

			}

			if (req?.file?.size > maxFileSize) {
				errors.push({ message: "Only 5Mb size file is allowed!" })
			}

			if (errors.length > 0) {
				if (req.file && req.file.path) {
					unlinkFile(req.file.path)
				}
				return res.status(400).json({
					success: false,
					error: errors
				})
			}

		}
		next();
	})
}


export {

	uploadFileandValidate,
	uploadFileAndValidateOnUpdate
}

