import winston, { format, transports } from "winston"
import "winston-daily-rotate-file"

import { preventTimestampOverride, filterCustomErrors, logRotationConfig, serverLogFormat, textColor } from "./helper"

const { combine, printf, splat, timestamp } = format
const preventTSOverride = format(preventTimestampOverride)
const colorize = format(textColor)
const filter = format(filterCustomErrors)

const createCLogger = (name) => winston.createLogger({
	level: process.env.MINIMUM_LOG_LEVEL || "info",
	format: combine(
		filter(),
		preventTSOverride(),
		colorize(),
		timestamp(),
		splat(),
		printf(serverLogFormat(name)),
	),
	transports: (process.env.NODE_ENV === "development" && !process.env.IS_PM2) ?
		[new transports.Console()]
		:
		[new transports.DailyRotateFile(logRotationConfig('server'))],
})

//export const logger = createCLogger("--")

const logger = createCLogger("--")
logger.db = createCLogger("DB")
logger.api = createCLogger("API")

export { logger }

export * from "./debug"
