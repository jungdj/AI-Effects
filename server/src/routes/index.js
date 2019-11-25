import express from "express"
import videoRoutes from './video';
import {speechToText, findWords} from '../utils/ml.utils'
import { upload } from "../utils"

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
	res.json({})
})

router.get("/hc", (req, res) => {
	res.sendStatus(200);
})

router.use("/video", videoRoutes)

router.post('/audio', upload.single('audio'), (req, res) => {
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
