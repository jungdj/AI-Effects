import chalk from "chalk"
import fs from "fs"
import CustomError from "../error"

// Log levels is based on RFC5424
// https://tools.ietf.org/html/rfc5424
const LOG_LEVELS = {
	error: 'ERR ', // level 0
	warn: 'WARN', // level 1
	info: 'INFO', // level 2
	verbose: 'VERV', // level 3
	debug: 'DEBG', // level 4
	silly: 'SILL', // level 5
}

/**
 * Filter out CustomError instances
 * @param {string} info - Log info
 */
export const filterCustomErrors = (info) => {
	if (info instanceof CustomError)
		return false
	return info
}

/**
 * Prevent timestamp overriden by message
 * @param info
 * @returns {*}
 */
export const preventTimestampOverride = info => {
	info.timestamp = undefined
	return info
}
/**
 * Timestamp format for each log printed.
 * @param {string} timestamp - Timestamp string
 */
const timestampFormat = timestamp => timestamp.replace('T', ' ').replace('Z', '')

/**
 *
 * Log text format for server logger.
 * @param name
 * @returns {function(info): string} @param {object} info - Log info
 */
export const serverLogFormat = name => info => {
	const level = LOG_LEVELS[info.level]
	const timestamp = timestampFormat(info.timestamp)

	let colorize = x => x
	let message = info.message

	switch (info.level) {
		case "info": break
		case "warn":
			colorize = chalk.yellow
			break
		case "error":
			colorize = chalk.red
			message = info.stack || info.message
			break
		default:
	}

	return `${timestamp} ${colorize(`[${name}] | [${level}] | ${message}`)}`
}

/**
 * Color up the printed logs for readability.
 * @param {object} info - Log info
 */
export const textColor = info => {
	const splat = Symbol.for('splat')

	try {
		info[splat] = info[splat]
			? info[splat].map(s => chalk.green(JSON.stringify(s)))
			: info[splat]
	} catch (error) {
		console.error("Stringify Error", error)
		console.error("Given Info : ", info)
	}

	return info
}

/**
 * Retrieve standard configuration for log rotation.
 * @param {string} filename - Log filename
 * @param {object} options - Transport options
 */
export const logRotationConfig = (filename, options) => {
	const logDir = 'log'

	// create the log directory if it's not exist
	if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

	return {
		maxSize: '20m',
		// passed options can overwrite the above
		...options,

		// write these last to ensure they won't be overwritten by passed options
		zippedArchive: false, // disable until PM2 cluster mode issue resolved
		datePattern: 'YYYYMMDD',
		filename: `./${logDir}/${filename}-%DATE%.log`,
	}
}
