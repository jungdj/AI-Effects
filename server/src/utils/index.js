import mongoose from "mongoose"
import multer from 'multer';
import path from 'path';

export const parseJSON = (json) => {
	try {
		return JSON.parse(json)
	} catch(error) {
		console.error(json)
		console.error(error.message)
		return {}
	}
}

export const isValidId = mongoose.Types.ObjectId.isValid

export const getTimestamp = () => (new Date().getTime()) / 1000;
export const getFileName = (name, extension) => `${name}-${getTimestamp()}${extension ? `.${extension}` : ''}`
export const getFilePath = (name, extension) => `static/${getFileName(name, extension)}`

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'static');
	},
	filename: (req, file, cb) => {
    if (file.mimetype === 'video/') {
      cb(null, getFileName (req.url.split('/')[1], 'mp4'))
    }
    else {
      cb(null, getFileName (req.url.split('/')[1] , file.fieldName))
    }
	}
})

export const upload = multer ({ storage })
