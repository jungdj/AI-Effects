import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

// import VideoRecord from './VideoRecord';
// import PoseProgress from './PoseProgress';

import PageTemplate from "./PageTemplate"
import Upload from "./Upload"

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
const FaceBlur = () => {
	return (
		<PageTemplate>
			<Wrapper>
				<img src="http://localhost:5000/video_feed" />
				{/* <video id="abc" width="320" height="179" autoPlay controls src={ sampleVideo } ref={inputVideo} onPlay={onPlay}/> */}
				{/* <canvas ref={canvas}/> */}
			</Wrapper>
			<Upload />
		</PageTemplate>
	)
}

export default FaceBlur;
