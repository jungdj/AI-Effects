import fs from 'fs';
import express from 'express';
import probe from 'node-ffprobe';

import { upload, getFilePath } from "../utils"

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

const  router = express.Router();

router.get('/mute-audio', upload.single ('video'), function (req, res) {
	const outPath = getFilePath ('output', 'mp4')

	ffmpeg(req.file.path) //Input Video File
		.output(outPath) // Output File
		.noAudio().videoCodec('copy')
		.on('end', function (err) {
			if (err)
				console.error(err)
			else if (!err) {
				console.log("Conversion Done");
				res.json({ url: outPath });
			}
		})
		.on('error', function (err) {
			console.log('error: ', +err);

		}).run();
});

router.get('/remove-video', function (req, res) {
	var url = 'videos/output.mp3';
	fs.exists(url, function (exists) {
		if (exists) {
			fs.unlink(url, function (err, data) {
				if (!err) {
					console.log("Existing File Deleted . . . ");
				}
			});
		}
	});
	ffmpeg('videos/input.mp4') // Input Video File
		.output('videos/output.mp3') // Output  File
		.on('end', function (err) {
			if (!err) {
				console.log("Remove video is done");
				res.send('Remove Video is Done');

			}

		})
		.on('error', function (err) {
			console.log('error: ' + err);
		}).run();

});

router.get('/thumbnail', function (req, res) {

	probe('videos/input.mp4', function (err, probeData) {

		var proc = new ffmpeg('videos/input.mp4');

		proc.screenshots({
			timestamps: ['50%', '80%'],
			folder: 'videos',
			size: '392x220'
		}).on('end', function () {
			console.log('Screenshots taken');
			res.send('Done Thumbnail');
		});

	});
});


router.get('/video-info', function (req, res) {
	ffmpeg.ffprobe('videos/input.mp4', function (err, metadata) {
		if (err) {
			console.log("MetaData not Found. " + err);
		} else {
			res.send(metadata);
		}
	});
});

router.post('/video-crop', upload.single('video'), function (req, res) {
  const fileName = req.file.path;
  console.log("fileName: ", fileName);
  const cuttingList = JSON.parse(req.body.cuttingList);
  const duration = req.body.duration;

  console.log("video duration: ", duration);

  console.log('cuttingList video: ', cuttingList);
  console.log('cuttingList length: ', cuttingList.length);
  // console.log("cuttingList[0].cut_start: ", cuttingList[0].cut_start);

  let cut_start, cut_end, time;
  for (let i=0; i <= cuttingList.length; i+=1) {
    console.log("i: ", i)
    if (i == 0) {
      cut_start = 0;
      cut_end = cuttingList[i].cut_start;
    }
    else if (i == cuttingList.length) {
      cut_start = cuttingList[i-1].cut_end;
      cut_end = duration;
    }
    else {
      cut_start = cuttingList[i-1].cut_end;
      cut_end = cuttingList[i].cut_start;
    }
    time = cut_end - cut_start;
    console.log("time: ", time);

    ffmpeg(fileName) //Input Video File
    .format('mp4')
    .save(fileName+'.mp4')
    .output(fileName + '-cut-' + String(i) +'.mp4') // Output File
    // .audioCodec('libmp3lame') // Audio Codec
    // .videoCodec('libx264') // Video Codec
    .toFormat('mp4')
    .setStartTime(cut_start) // Start Position
    .withDuration(time) // Duration
    .run();

    console.log("check");

    // if (i == 1) {
    //   ffmpeg(fileName + '-cut-' + '0' +'.mp4')
    //   .input(fileName + '-cut-' + '1' +'.mp4')
    //   .mergeToFile(fileName + 'merge.mp4', 'static/merge');
    // }
    // else if (i > 1) {
    //   ffmpeg(fileName + 'merge.mp4')
    //   .input(fileName + '-cut-' + String(i) +'.mp4')
    //   .mergeToFile(fileName + 'merge.mp4', 'static/merge');
    // }
  }
  ffmpeg(fileName + '-cut-' + '0' +'.mp4')
    .input(fileName + '-cut-' + '1' +'.mp4')
    .on('error', function(err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function() {
      console.log('Merging finished !');
    })
    .mergeToFile(fileName + 'merge.mp4', 'static/merge');

  res.send('Crop done');
  // TODO: also need to merge!
});

router.get('/effect-fadein', function (req, res) {

	ffmpeg('videos/input.mp4')
		.audioCodec('libmp3lame') // Audio Codec
		.videoCodec('libx264')
		.videoFilters('fade=in:0:200')
		.output('videos/fadein.mp4')

		.on('end', function (err) {
			if (!err)
				res.send("Successfull");
		})
		.on('progress', function (data) {
			console.log(data.percent);

		})
		.on('error', function (err) {
			console.log('error: ' + err);
		}).run();
});

router.get('/effect-fadeout', function (req, res) {

	ffmpeg('videos/input.mp4')
		.audioCodec('libmp3lame') // Audio Codec
		.videoCodec('libx264')
		.videoFilters('fade=out:70:10')
		.output('videos/fadeout.mp4')

		.on('end', function (err) {
			if (!err)
				res.send("Successfull");
		})
		.on('error', function (err) {
			console.log('error: ' + err);
		}).run();
});

router.get('/effect-blur', function (req, res) {

	ffmpeg('./videos/input.mp4')
		.audioCodec('libmp3lame') // Audio Codec
		.videoCodec('libx264')
		.videoFilters('unsharp=7:7:-2:7:7:-2')
		.output('videos/blur.mp4')

		.on('end', function (err) {
			if (!err)
				res.send("Successfull");
		})
		.on('progress', function (data) {
			console.log(Math.floor(data.percent) + " %");

		})
		.on('error', function (err) {
			console.log('error: ' + err);
		}).run();
});

router.get('/effect-sharpen', function (req, res) {

	ffmpeg('videos/input.mp4')
		.audioCodec('libmp3lame') // Audio Codec
		.videoCodec('libx264')
		.videoFilters('unsharp=7:7:-2:7:7:-2')
		.output('videos/sharpen.mp4')

		.on('end', function (err) {
			if (!err)
				res.send("Successfull");
		})
		.on('progress', function (data) {
			console.log(Math.floor(data.percent) + " %");

		})
		.on('error', function (err) {
			console.log('error: ' + err);
			//callback(err);
		}).run();
});

router.get('/video-subtitle', function (req, res) {
	console.log("Title ......", __dirname);
	if (fs.existsSync('../videos/input.mp4')) {
		console.log('Found file');
	} else {
		console.log("Not Found File");
	}

	ffmpeg('../videos/input.mp4')
		.audioCodec('libmp3lame')
		.videoCodec('libx264')
		.videoFilters({
			filter: 'drawtext',
			options: {
				fontfile: './DINLight.ttf',
				text: "Bilash & Lopa",
				fontsize: 20,
				fontcolor: '#ccc',
				x: '(main_w/2-text_w/2)',
				y: 50,
				shadowcolor: 'black',
				shadowx: 2,
				shadowy: 2
			}
		})
		.output('videos/subtitle.mp4')

		.on('end', function () {
			console.log("Done")

		})
		.on('error', function (err) {
			console.log('error: ', +err);

		}).run();

});

router.get('/watermark', function (req, res) {
	console.log("Watermark");
	if (fs.existsSync(__dirname + 'videos/input.mp4')) {
		console.log('Found file');
	} else {
		console.log("Not Found File");
	}
	//var ffmpeg = require('fluent-ffmpeg');
	ffmpeg(__dirname + 'videos/input.mp4')
		.videoFilters({
			filter: 'drawtext',
			options: {
				fontfile:'videos/LucidaGrande.ttc',
				text: 'THIS IS TEXT',
				fontsize: 20,
				fontcolor: 'white',
				x: '(main_w/2-text_w/2)',
				y: 50,
				shadowcolor: 'black',
				shadowx: 2,
				shadowy: 2
			}
		})
		.output('./videos/watermark.mp4')

		.on('end', function (err) {
			if (!err) {
				console.log('Title Save successfully');
				//res.send('videos/effect/test.mp4')
			}

		})
		.on('error', function (err) {
			console.log('error: ', +err);
			//callback(err);
		}).run();
});

module.exports = router
