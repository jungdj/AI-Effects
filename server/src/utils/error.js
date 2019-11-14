import _ from "lodash"

const ErrorTemplates = {
	'HEADER_MISSING': {
		errorCode: 401,
		status: 401,
		message: 'Missing Header',
	},
	"NOT_FOUND": {
		errorCode: 404,
		status: 404,
		message: "Not Found",
	},
}

const UnknownError = {
	status: 500,
	errorCode: 500,
	message: 'serverError',
}
export default class CustomError extends Error {
	constructor(key) {
		const errorData = ErrorTemplates[key] || UnknownError
		super(errorData.message)
		Error.captureStackTrace(this, this.constructor)
		this.name = this.constructor.name
		this.status = errorData.status || 500
		this.errorCode = errorData.errorCode || 500
	}
}

const errorObject = _.mapValues(ErrorTemplates, (value, key) => () => new CustomError(key))

export const errorGenerator = new Proxy(errorObject, {
	get(target, prop, receiver) {
		return errorObject[prop]()
	},
})

export function errorHandler(error, res) {
	if (error instanceof CustomError) {
		res.status(error.status).json({
			errorCode: error.errorCode,
			message: error.message,
		})
	} else {
		res.status(500).json({
			errorCode: 500,
			message: 'Unexpected Error',
		})
	}
}
