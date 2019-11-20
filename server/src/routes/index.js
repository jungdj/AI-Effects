import express from "express"
import userRoutes from "./user"
import speechToText from '../../../src/utils/ml.utils'

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
	res.json({})
})

router.get("/hc", (req, res) => {
	res.sendStatus(200);
})

router.use("/user", userRoutes)

router.post('/asdf', upload.single('audio'), (req, res) => {
  const fileName = req.file.path;

  speechToText(fileName).then(() => {
    res.send('succeed!');
  });

})

module.exports = router
