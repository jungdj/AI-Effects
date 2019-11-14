import mongoose from "mongoose"
import { userSchema } from "./methods"
import { logger } from "../utils/logger"

mongoose.connect(process.env.MONGODB_CONNECTION_URL, {
	useNewUrlParser: true,
	autoIndex: process.env.NODE_ENV !== "production",
	useFindAndModify: false,
	useCreateIndex: true,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
	const boldBlue = text => `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`
	logger.info(`${boldBlue(`Mongo db successfully connected!!`)}`)
})

export const User = mongoose.model("User", userSchema)
