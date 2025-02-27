import express from "express"
import {
	userSignupInputValidator,
	updateUserDetailsValidator,
	userActivateValidator,
	userDeactivateValidator
} from "../middleware/uservalidation.js" //importing all user validations
import {
	userSignup,
	updateUserDetails,
	deleteUser,
	getAllUsers,
	getUserById,
	activateUser,
	deactivateUser
} from "../controller/user.js";// importing all user controllers

import { userIdValidator } from "../middleware/IdValidator.js"; // importing UserIdValidator

import { userPaginationValidation } from "../middleware/paginationValidation.js" //importing pagination validation

const userRouter = express.Router();

//user signup 
userRouter.post("/signup", userSignupInputValidator, userSignup);

//listing all users
userRouter.get("/listing", userPaginationValidation, getAllUsers)

//update user
userRouter.put("/update/:id", userIdValidator, updateUserDetailsValidator, updateUserDetails)

//delete user
userRouter.delete("/delete/:id", userIdValidator, deleteUser)

// activate user
userRouter.put("/activate/:id", userIdValidator, userActivateValidator, activateUser)

//deactvate user 
userRouter.put("/deactivate/:id", userIdValidator, userDeactivateValidator, deactivateUser)

//getting user by id
userRouter.get("/:id", userIdValidator, getUserById)



export default userRouter;