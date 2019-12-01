import dj from '../static/dj.jpg'
import gogi from '../static/gogi.jpg';
import seol from '../static/seol.jpg';
import youns from '../static/youns.jpeg';

export const knowns_mock = [dj, gogi, seol, youns]

const stt_result_mock = `
Word: by, start_time: 0.1, end_time: 0.5, speaker_tag: 2
Word: the, start_time: 0.5, end_time: 0.6000000000000001, speaker_tag: 2
Word: way, start_time: 0.6000000000000001, end_time: 0.8, speaker_tag: 2
Word: guys, start_time: 0.8, end_time: 1.8, speaker_tag: 2
Word: you, start_time: 1.8, end_time: 2.4, speaker_tag: 3
Word: have, start_time: 2.4, end_time: 2.5, speaker_tag: 3
Word: to, start_time: 2.5, end_time: 2.7, speaker_tag: 3
Word: tell, start_time: 2.7, end_time: 2.9, speaker_tag: 3
Word: me, start_time: 2.9, end_time: 3.0, speaker_tag: 3
Word: I, start_time: 3.0, end_time: 3.2, speaker_tag: 3
Word: noticed, start_time: 3.2, end_time: 4.5, speaker_tag: 3
Word: that, start_time: 4.5, end_time: 4.5, speaker_tag: 3
Word: I, start_time: 4.5, end_time: 4.7, speaker_tag: 3
Word: have, start_time: 4.7, end_time: 4.9, speaker_tag: 3
Word: this, start_time: 4.9, end_time: 5.0, speaker_tag: 3
Word: pattern, start_time: 5.0, end_time: 5.5, speaker_tag: 3
Word: of, start_time: 5.5, end_time: 5.5, speaker_tag: 3
Word: saying, start_time: 5.5, end_time: 5.8, speaker_tag: 3
Word: you, start_time: 5.8, end_time: 6.0, speaker_tag: 3
Word: know, start_time: 6.0, end_time: 6.2, speaker_tag: 3
Word: everything., start_time: 6.2, end_time: 6.9, speaker_tag: 1
Word: Oh, start_time: 17.5, end_time: 17.9, speaker_tag: 2
Word: and, start_time: 17.9, end_time: 18.3, speaker_tag: 2
Word: I, start_time: 18.3, end_time: 18.4, speaker_tag: 2
Word: forgot, start_time: 18.4, end_time: 18.5, speaker_tag: 2
Word: to, start_time: 18.5, end_time: 18.8, speaker_tag: 1
Word: do, start_time: 18.8, end_time: 18.9, speaker_tag: 1
Word: what, start_time: 18.9, end_time: 19.2, speaker_tag: 1
Word: I, start_time: 19.2, end_time: 19.3, speaker_tag: 1
Word: say, start_time: 19.3, end_time: 19.4, speaker_tag: 1
Word: no, start_time: 19.4, end_time: 19.9, speaker_tag: 1
Word: and, start_time: 19.9, end_time: 20.3, speaker_tag: 1
Word: it's, start_time: 20.3, end_time: 20.7, speaker_tag: 1
Word: well, start_time: 24.7, end_time: 25.2, speaker_tag: 1
Word: I, start_time: 25.2, end_time: 25.3, speaker_tag: 1
Word: seen, start_time: 25.3, end_time: 25.7, speaker_tag: 1
Word: the, start_time: 25.7, end_time: 25.7, speaker_tag: 1
Word: video, start_time: 25.7, end_time: 25.9, speaker_tag: 1
Word: also, start_time: 25.9, end_time: 26.3, speaker_tag: 1
Word: where, start_time: 26.3, end_time: 26.5, speaker_tag: 1
Word: I, start_time: 26.5, end_time: 26.6, speaker_tag: 1
Word: say, start_time: 26.6, end_time: 26.8, speaker_tag: 1
Word: you, start_time: 26.8, end_time: 26.8, speaker_tag: 1
Word: know, start_time: 26.8, end_time: 27.0, speaker_tag: 1
Word: and, start_time: 27.0, end_time: 27.3, speaker_tag: 1
Word: then, start_time: 27.3, end_time: 27.3, speaker_tag: 1
Word: speed, start_time: 27.3, end_time: 28.0, speaker_tag: 1
Word: it, start_time: 28.0, end_time: 28.1, speaker_tag: 1
Word: up, start_time: 28.1, end_time: 28.4, speaker_tag: 1
Word: and, start_time: 28.4, end_time: 30.6, speaker_tag: 1
Word: now, start_time: 30.6, end_time: 30.9, speaker_tag: 1
Word: and, start_time: 30.9, end_time: 31.2, speaker_tag: 1
Word: we, start_time: 31.2, end_time: 31.4, speaker_tag: 1
Word: have, start_time: 31.4, end_time: 31.5, speaker_tag: 1
Word: to, start_time: 31.5, end_time: 31.7, speaker_tag: 1
Word: have, start_time: 31.7, end_time: 31.8, speaker_tag: 1
Word: some, start_time: 31.8, end_time: 32.0, speaker_tag: 1
Word: kind, start_time: 32.0, end_time: 32.0, speaker_tag: 1
Word: of, start_time: 32.0, end_time: 32.2, speaker_tag: 1
Word: code, start_time: 32.2, end_time: 32.6, speaker_tag: 1
Word: like, start_time: 32.6, end_time: 32.9, speaker_tag: 1
Word: okay, start_time: 32.9, end_time: 33.2, speaker_tag: 1
Word: maybe, start_time: 33.2, end_time: 33.4, speaker_tag: 1
Word: I'm, start_time: 37.0, end_time: 37.4, speaker_tag: 1
Word: going, start_time: 37.4, end_time: 37.5, speaker_tag: 1
Word: to, start_time: 37.5, end_time: 37.6, speaker_tag: 1
Word: know, start_time: 37.6, end_time: 37.9, speaker_tag: 1
Word: I'm, start_time: 37.9, end_time: 38.4, speaker_tag: 1
Word: going, start_time: 38.4, end_time: 39.3, speaker_tag: 1
Word: to, start_time: 39.3, end_time: 39.3, speaker_tag: 1
Word: work, start_time: 39.3, end_time: 39.5, speaker_tag: 1
Word: on, start_time: 39.5, end_time: 39.6, speaker_tag: 1
Word: it, start_time: 39.6, end_time: 39.7, speaker_tag: 1
Word: you, start_time: 39.7, end_time: 40.0, speaker_tag: 1
Word: know, start_time: 40.0, end_time: 40.2, speaker_tag: 1
Word: what, start_time: 40.2, end_time: 40.3, speaker_tag: 1
Word: you, start_time: 40.3, end_time: 40.5, speaker_tag: 1
Word: made, start_time: 40.5, end_time: 40.7, speaker_tag: 1
Word: me, start_time: 40.7, end_time: 40.8, speaker_tag: 1
Word: do, start_time: 40.8, end_time: 40.9, speaker_tag: 1
Word: stop, start_time: 42.6, end_time: 44.8, speaker_tag: 1
`
const parseSTTLine = line => line.split(',').map(x => x.trim()).map(x => x.split(':').map(x => x.trim().toLowerCase() )).reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})
/**
 * shape: [{ word: xx, start_time: xx, end_time: xx, speaker_tag: xx }]
 * */
export const stt_mock = stt_result_mock.split('\n').filter(x => x).map(parseSTTLine)
export const subtitle_mock = stt_mock.reduce((acc, cur, i) => {
	if (!i) return [cur]
	const last = acc[acc.length - 1]
	if (last.speaker_tag != cur.speaker_tag) return [...acc, cur]
	if (last.word.length > 15) return [...acc, cur]
	last.word += ' ' + cur.word
	last.end_time = cur.end_time
	return [...acc.slice(0, acc.length -1), last]
}, [])
