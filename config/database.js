
import mongoose from "mongoose";

const connectDatabase = async () => {
	try {
		const Db_Url = "mongodb://127.0.0.1/27017/";
		await mongoose.connect(Db_Url, {
			dbName: 'BrainmobiUser'
		})
		console.log("Database Connected Successfully!")
	} catch (error) {
		console.error(error)
		process.exit(1)
	}
}

export {
	connectDatabase
}