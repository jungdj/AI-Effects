import mongoose from "mongoose"

export const userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	phoneNumber: String,
}, {
	timestamps: true,
})