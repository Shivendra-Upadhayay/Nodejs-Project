import fs from "fs"

// Added function to unlink file 
const unlinkFile = async (file) => {
	fs.unlink(file, (err) => {
		console.log("err", err)
		console.log("file deleted!")
		return;
	})
}

export {
	unlinkFile

}