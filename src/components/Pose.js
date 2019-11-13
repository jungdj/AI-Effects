import React, { useState, useCallback, useEffect } from "react"
import useSetState from "../hooks/useSetState"
import axios from 'axios';
import daredevil from "../static/daredevil.mp3";
import houseofcards from '../static/houseofcards.mp3';
import strangerthings from '../static/strangerthings.mp3';

import PageTemplate from "./PageTemplate"
import VideoRecord from "./VideoRecord"
import PoseProgress from "./PoseProgress"

const audios = [daredevil, houseofcards, strangerthings]

const Pose = () => {
	let formData = null;
	let audio;

	const [{ done1, done2 }, setDone] = useState ({ done1: false, done2: false })
	const [{ src1, src2 }, setState] = useSetState({ src1: '', src2: '' });

	useEffect(() => {
		formData = new FormData ();
		audio = new Audio (audios[Math.floor(Math.random() * 3)]);

		return () => {
			audio.pause();
		}
	}, [])

	const processVideo = useCallback ((id, blob) => {
		let num = 1;
		if (id === 'second') num = 2;
		const key = `video${num}`
		setDone ({ [`done${num}`]: true })

		formData.delete (key);
		formData.append (key, blob)
		setState({ [`src${num}`]: window.URL.createObjectURL(blob) })
	}, [])

	const upload = useCallback(() => {
		audio.play ();
		//if (!done1 || !done2) return alert ('Record videos first');
		//axios.post ('localhost:3000', formData, {
		//	onUploadProgress: (progressEvent => {
		//		const percentCompleted = Math.round(progressEvent.loaded  / progressEvent.total * 10000)/ 100
		//		console.log(percentCompleted);
		//	})
		//});
	}, [done1, done2, src1, src2])

	return (
		<PageTemplate>
			<VideoRecord id={'first'} processVideo={processVideo}/>
			<VideoRecord id='second' processVideo={processVideo} />

			<PoseProgress srcs={[src1, src2]} upload={upload} />
		</PageTemplate>
	)
}

export default Pose;
