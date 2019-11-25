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

router.post('/asdf', upload.single('audio'), (req, res) => {
  const fileName = req.file.path;

  speechToText(fileName).then((wordsList) => {
    if (!wordsList) {
      console.log("No one spoke in video!");
      console.log("nothing to cut");
      res.send('nothing to change');
    }
    else {
      const cuttingList = findWords(wordsList);
      console.log("cuttingList: ", cuttingList);
      // TODO: cut video with given 'cuttingList'
      // TODO: different captions for each speaker with given 'wordsList[i].speakerTag'
      res.send('succeed!');
    }
    // temporary host ip... TODO: need to change python-server host
    request.get('http://127.0.0.1:5000/temp')
    console.log("get - localhost:5000/temp")
  });

})

module.exports = router
