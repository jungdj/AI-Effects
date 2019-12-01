import axios from './network'

import {
	knowns_mock,
	subtitle_mock, uploaded_mock,
} from "./mocks"

//export const getPeople = formData => Promise.resolve (knowns_mock);
export const getPeople = fileName => axios.get(`/extract_faces/${fileName}`)
export const getSubtitles = formData => Promise.resolve (subtitle_mock);
export const getUploaded = () => Promise.resolve (uploaded_mock);


export const uploadVideo = formData => axios.post('/upload', formData)
