
import mongoose from "mongoose";
import { Product } from "../model/product.js";
import { unlinkFile } from "../utility/fileUnlink.js";



// add Product handler
const addProduct = async (req, res) => {

	try {
		const { name, price, category, description, isActive } = req.body; //extracting data from body

		const product = await Product.findOne({ name }) //checking product already added

		if (product) {
			if (req.file) {
				unlinkFile(req.file.path) //calling to unlink file
			}
			return res.status(400).json({
				success: false,
				message: "Product already added!"
			})
		}

		console.log(req.file.filename)
		//ImageUrl
		const imageUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}`

		const image = req.file.filename
		const data = new Product({
			name,
			price,
			category,
			description,
			image,
			isActive
		})
		//saving new product in db
		const addProduct = await data.save()

		// Updating Product by Id
		const newProduct = await Product.findById({ _id: addProduct._id }, { createdAt: 0, updatedAt: 0 }, { new: true })

		// Appending imageURL in image
		newProduct.image = imageUrl

		return res.status(201).json({
			success: true,
			message: "Product added Successfully!",
			newProduct
		})

	} catch (error) {

		console.error(error.message)
		if (req.file) {
			unlinkFile(req.file.path)
		}
		return res.status(500).json({
			success: false,
			message: "Getting error when adding Product"
		})
	}

}

// Update product Controller
const updateProduct = async (req, res) => {
	try {
		const _id = req.params.id; //extracting id from params

		// Check if the product exists before updating
		const product = await Product.findById({ _id, isActive: true });
		if (!product) {
			if (req.file && req.file.path) {
				unlinkFile(req.file.path)
			}
			return res.status(404).json({
				success: false,
				message: `No Active product found to update with this product ID: ${_id}`,
			});
		}

		// Preparing update data
		let updateData = { ...req.body };
		if (req.file) {
			updateData.image = req.file.filename; // Use filename for security
			const imageUrl = `${req.protocol}://${req.get("host")}/upload/${req.file.filename}}`
		}


		// Update product
		const updatedProduct = await Product.findByIdAndUpdate({ _id, isActive: true }, updateData, {
			new: true,
			projection: { createdAt: 0, updatedAt: 0 },
		});

		// Unlinking file when file is updating
		if (updateData.image) {
			unlinkFile(`public/images/${product.image}`)
		}
		// Sending  success response
		return res.status(200).json({
			success: true,
			message: "Product updated successfully!",
			updatedProduct
		});
	} catch (error) {
		console.error("Update Error:", error.message);

		//unlinking file when any error occurs
		if (req.file && req.file.path) {
			await unlinkFile(req.file.path).catch(console.error);
		}
		// Send error response only once	
		return res.status(500).json({
			success: false,
			message: "An error occurred while updating the product.",
		});
	}
};

// Get Product By Id
const getProductById = async (req, res) => {

	try {
		const _id = req.params.id // extracting id from params

		const product = await Product.findById(_id, { createdAt: 0, updatedAt: 0 })

		if (!product) {
			return res.status(404).json({
				success: false,
				message: `No product found with this product Id ${_id} `
			})
		}

		return res.status(200).json({
			success: true,
			message: "Product fetched successfully!",
			product
		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "getting error when fetching product by id!"
		})
	}


}

//delete product by id
const deleteProductById = async (req, res) => {
	try {
		const _id = req.params.id // extracting id from params

		const product = await Product.findById(_id)
		if (product) {
			await unlinkFile(`public/images/${product.image}`)

		}
		const deletproduct = await Product.findByIdAndDelete(_id, { createdAt: 0, updatedAt: 0 })

		if (!product) {
			return res.status(404).json({
				success: false,
				message: `No product found to delete with this product Id: ${_id}`
			})
		}

		return res.status(200).json({
			success: true,
			message: "Product deleted successfully!",

		})
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "getting error when fetching product by id!"
		})
	}
}

//get all product
const getAllProducts = async (req, res) => {

	try {
		let page = Number(req.query.page) || 1;
		const totalProducts = await Product.countDocuments();
		const limit = Number(req.query.limit) || 2;
		const totalPage = Math.floor(totalProducts / limit)
		const skip = (page - 1) * limit;
		var sortingKey = req.query.sortingKey;
		var sortingOrder = req.query.sortingOrder;
		let allProducts;

		//fetching Products using pagination,sorting in ascending order by productname and also added limit and also will sort 
		if (sortingKey && sortingOrder) {
			allProducts = await Product.find({ isActive: true }, { createdAt: 0, updatedAt: 0 }).sort({ [sortingKey]: sortingOrder }).skip(skip).limit(limit);
		} else {
			//fetching Products using pagination and also added limit
			allProducts = await Product.find({ isActive: true }, { createdAt: 0, updatedAt: 0 }).skip(skip).limit(limit);
		}

		//checking any product is available or not 
		if (!allProducts) {
			return res.status(404).json({
				success: false,
				message: "No Product Found!"
			})
		}

		return res.status(200).json({
			success: false,
			message: "Product fetched Successfully !",
			allProducts

		})

	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			success: false,
			message: "getting error when fetching product!"
		})
	}
}

//Activate Product Controller
const activateProduct = async (req, res) => {

	try {
		const _id = req.params.id; 	//extracting id from params

		const productStatus = await Product.findOne({ _id, isActive: true })

		// checking product is already activate or not
		if (productStatus) {

			return res.status(400).json({
				success: false,
				message: "Product already activate !"
			})
		}

		const updateStatus = await Product.findByIdAndUpdate(
			{ _id },
			{
				$set: {
					"isActive": true
				}
			}
		)

		if (!updateStatus) {

			return res.status(404).json({
				success: false,
				message: `No inActive product found to activate with this product ID: ${_id} `
			})
		}

		//success response
		return res.status(400).json({
			success: false,
			message: "Product Activated Successfully !"
		})
	} catch (error) {

		console.error(error.message)

		return res.status(500).json({
			success: false,
			message: "getting error when activating product !"
		})

	}
}

//Deactivating Product Controller
const deactivateProduct = async (req, res) => {

	const _id = req.params.id; 	//extracting id from params

	const productStatus = await Product.findOne({ _id, isActive: false })

	// checking product is already deactivate or not
	if (productStatus) {

		return res.status(400).json({
			success: false,
			message: "Product already deactivate !"
		})
	}

	const updateStatus = await Product.findByIdAndUpdate(
		{ _id, isActive: true },
		{
			$set: {
				"isActive": false
			}
		})

	if (!updateStatus) {

		return res.status(404).json({
			success: false,
			message: `No Active product found to deactivate with this product ID: ${_id} `
		})
	}

	//success response
	return res.status(400).json({
		success: false,
		message: "Product Deactivate Successfully !"
	})
}




export {
	addProduct,
	updateProduct,
	getProductById,
	deleteProductById,
	getAllProducts,
	activateProduct,
	deactivateProduct
}
