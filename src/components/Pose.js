import React, { useState, useCallback, useEffect } from "react"
import useSetState from "../hooks/useSetState"
import axios from 'axios';

import PageTemplate from "./PageTemplate"
import VideoRecord from "./VideoRecord"
import PoseProgress from "./PoseProgress"

const Pose = () => {
	let formData = null;

	const [done1, setDone1] = useState (false);
	const [done2, setDone2] = useState (false);
	const [{ src1, src2 }, setState] = useSetState({ src1: '', src2: '' });

	useEffect(() => {
		formData = new FormData ();
	}, [])

	const appendVideo = useCallback ((id, blob) => {
		let num = 1;
		if (id === 'second') num = 2;
		const key = `video${num}`

		formData.delete (key);
		formData.append (key, blob)
		setState({ [`src${num}`]: window.URL.createObjectURL(blob) })
	}, [])

	const upload = useCallback(() => {
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
			<VideoRecord id={'first'} appendVideo={appendVideo} done={setDone1} />
			<VideoRecord id='second' appendVideo={appendVideo} done={setDone2} />

			<PoseProgress srcs={[src1, src2]} upload={upload} />
		</PageTemplate>
	)
}

export default Pose;
