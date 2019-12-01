import axios from './network'

import {
	knowns_mock,
	subtitle_mock, uploaded_mock,
} from "./mocks"

//export const getPeople = formData => Promise.resolve (knowns_mock);
export const getPeople = fileName => axios.get(`/extract_faces/${fileName}`)
export const getSubtitles = formData => Promise.resolve (subtitle_mock);
export const getUploaded = () => axios.get('/get_upload').then(res => res.data.map(x => {
	const tmp = x.split('/');
	return tmp[tmp.length - 1]
}))

export const blurVideo = (fileName, ids) => {
	const formData = new FormData ();
	formData.append ('knowns', ids.join (','))
	return axios.post(`/blur/${fileName}`, formData)
}
export const uploadVideo = formData => axios.post('/upload', formData)
