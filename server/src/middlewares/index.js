import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
	const jwtSecret = req.app.get('jwt-secret')
	const token = (req.headers['authorization'] || "").substring(7)
	jwt.verify(token, jwtSecret, (err, decoded) => {
		if (err) {
			console.error(err.message)
			res.status(403).json({
				error: err.message
			})
			return
		}
		req.decoded = decoded
		req.token = token
		next()
	})
}