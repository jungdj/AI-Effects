import mongoose from "mongoose"

export const parseJSON = (json) => {
	try {
		return JSON.parse(json)
	} catch(error) {
		console.error(json)
		console.error(error.message)
		return {}
	}
}

export const isValidId = mongoose.Types.ObjectId.isValid
