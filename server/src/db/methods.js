import { userSchema } from "./schema"

userSchema.virtual('name')
	.get(function () {
		return `${this.lastName} ${this.firstName}`
	})
	.set(function (v) {
		this.lastName = v.substr(0, v.indexOf(' '))
		this.firstName = v.substr(v.indexOf(' ') + 1)
	})

export { userSchema }
