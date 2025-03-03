import express from "express"
import {
	uploadFileandValidate,
	uploadFileAndValidateOnUpdate
} from "../middleware/fileUpload.js"  //importing all file validator

import {
	addProductValidator,
	updateProductValidator,
	productActivateValidator,
	productDeactivateValidator,

} from "../middleware/productvalidation.js" //importing all product validator

import {
	addProduct,
	updateProduct,
	getProductById,
	deleteProductById,
	getAllProducts,
	activateProduct,
	deactivateProduct
} from "../controller/product.js"  // importing all product controller

import { productIdValidator } from "../middleware/IdValidator.js"; //importing id validator

import { productPaginationValidation } from "../middleware/paginationValidation.js"; //importing pagination validation




const productRouter = express.Router()

// add product api
productRouter.post("/add", uploadFileandValidate, addProductValidator, addProduct);

//listing product api
productRouter.get("/listing", productPaginationValidation, getAllProducts)

// updating product api
productRouter.put("/update/:id", productIdValidator, uploadFileAndValidateOnUpdate, updateProductValidator, updateProduct)

//Activating Product Api
productRouter.put("/activate/:id", productIdValidator, activateProduct)

//Deactivating Product Api
productRouter.put("/deactivate/:id", productIdValidator, deactivateProduct)

//deleteproductbyid api
productRouter.delete("/delete/:id", productIdValidator, deleteProductById)

//getproductbyid api
productRouter.get("/:id", productIdValidator, getProductById)




export default productRouter