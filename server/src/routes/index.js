import express from "express"
import userRoutes from "./user"
import {speechToText, findWords} from '../utils/ml.utils'
import request from 'request'

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

router.post('/audio', upload.single('audio'), (req, res) => {
  const fileName = req.file.path;
  const duration = req.body.duration;

  speechToText(fileName, duration).then((wordsList) => {
    if (!wordsList) {
      console.log("No one spoke in video!");
      res.status(200).send('nothing to cut');
    }
    else {
      const cuttingList = findWords(wordsList);
      console.log("cuttingList: ", cuttingList);
      // TODO: cut video with given 'cuttingList' -> cuttingList가 empty list가 아닐때 잘라주기(length 이용)
      // TODO: different captions for each speaker with given 'wordsList[i].speakerTag'
      res.status(200).send('success');
    }
    // temporary host ip... TODO: need to change python-server host
    request.get('http://127.0.0.1:5000/temp')
    console.log("get - localhost:5000/temp")
  });

})

module.exports = router
