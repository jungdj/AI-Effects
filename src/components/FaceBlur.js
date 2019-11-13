import React, { useState } from 'react';
import styled from 'styled-components';

import VideoRecord from './VideoRecord';
import PoseProgress from './PoseProgress'

import PageTemplate from "./PageTemplate"

const Wrapper = styled.div`
// CSS 여기에 Sass 쓰면됨
	display: flex;
	flex-direction: column; 
	width: 100vw;
	height: 100vh;
	padding-top: 70px;
`

const postProcess = x => x

const FaceBlur = () => {
	const [src, setSrc] = useState ('')
	const processVideo = (id, video) => {
		setSrc(window.URL.createObjectURL(video));
		console.log('asdf', window.URL.createObjectURL(video))
	}

	return (
		<PageTemplate>
			<Wrapper>
				<VideoRecord id="faceBlur1" processVideo={processVideo}/>
				<PoseProgress srcs={[src, src]} />
			</Wrapper>
		</PageTemplate>
	)
}

export default FaceBlur;
