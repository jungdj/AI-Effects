import axios from './network'

import { subtitle_mock } from "./mocks"

//export const getSubtitles = formData => axios.post('/xxxx', formData)
export const getSubtitles = formData => Promise.resolve(subtitle_mock);
