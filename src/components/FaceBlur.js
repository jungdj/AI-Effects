import React, { useRef } from 'react';
import styled from 'styled-components';

import VideoRecord from './VideoRecord';
import PoseProgress from './PoseProgress';

import PageTemplate from "./PageTemplate" 
import * as faceapi from 'face-api.js';
import sampleVideo from "./face_video.mp4"

const Wrapper = styled.div`
	display: flex;
	flex-direction: column; 
	position: relative;
	width: 100vw;
	height: 100vh;
	padding-top: 70px;
	video {
		height: auto;
	}
	canvas {
		position: absolute;
		width: 320px;
		height: auto;
	}
`

async function faceDetect(inputVideo, canvas) {
	// await faceapi.loadMtcnnModel('/models')
	// await faceapi.loadFaceRecognitionModel('/models')
	await faceapi.loadSsdMobilenetv1Model('/models')
	console.log('FACE DETECT ')
	console.log(inputVideo)
	const displaySize = { width: inputVideo.width, height: inputVideo.height };
	console.log(displaySize)
	faceapi.matchDimensions(canvas, displaySize);

	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(inputVideo)
		console.log(detections)
		const resizedDetections = faceapi.resizeResults(detections, displaySize);
		console.log(resizedDetections)
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
		canvas.getContext('2d').drawImage(inputVideo, 0, 0, displaySize.width, displaySize.height)
		faceapi.draw.drawDetections(canvas, resizedDetections)
	}, 100);
}

const FaceBlur = () => {
	const inputVideo = useRef(null)
	const canvas = useRef(null)
	const onPlay = () => {
		faceDetect(inputVideo.current, canvas.current)
	}

	return (
		<PageTemplate>
			<Wrapper>
				<video id="abc" width="320" height="179" autoPlay controls src={ sampleVideo } ref={inputVideo} onPlay={onPlay}/>
				<canvas ref={canvas}/>
			</Wrapper>
		</PageTemplate>
	)
}

export default FaceBlur;
