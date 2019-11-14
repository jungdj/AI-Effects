import express from "express"
import userRoutes from "./user"

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
	res.json({})
})

router.get("/hc", (req, res) => {
	res.sendStatus(200);
})

router.use("/user", userRoutes)

module.exports = router
