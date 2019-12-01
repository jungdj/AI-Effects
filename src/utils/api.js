import axios from './network'

import {
	knowns_mock,
	subtitle_mock
} from "./mocks"

export const getPeople = formData => Promise.resolve (knowns_mock);
export const getSubtitles = formData => Promise.resolve(subtitle_mock);
