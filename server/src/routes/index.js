import express from "express"
import userRoutes from "./user"
import {speechToText, findWords} from '../utils/ml.utils'

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

  speechToText(fileName).then((wordsList) => {
    const cuttingList = findWords(wordsList);
    console.log("cuttingList: ", cuttingList);
    // TODO: cut video with given 'cuttingList'
    // TODO: different captions for each speaker with given 'wordsList[i].speakerTag'
    res.send('succeed!');
  });

})

module.exports = router
