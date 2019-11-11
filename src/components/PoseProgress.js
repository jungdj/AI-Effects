import React, { useCallback, useState } from 'react'
import styled, { css } from 'styled-components';

import VideoWithOverlay from "./VideoWIthOverlay"
const Wrapper = styled.div`
	scroll-snap-align: start;
	width: 100vw;
	padding: 70px 0 200px 0;
	min-height: 100vh;
	${props => props.hasBoth ? css`
	` : css`
		//min-height: calc(100vh - 70px);
	`};
	
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	
	.videos {
		position: relative;
		display: flex;
		width: 90%;
		height: auto;
		flex-direction: row;
		@media (min-width: 1080px) {
			flex-direction: row;
		}	
	}
	
	.video-with-overlay {
		position: absolute;
		transition: all 1s;
		width: 50%;
		min-height: 300px;
		top: 0;
		&:nth-child(1) {
			left: 0;
			padding-right: 20px;
		}
		&:nth-child(2) {
			right: 0;
			padding-left: 20px;
		}
		&.overlay-placeholder {
			position: relative !important;
			visibility: hidden;
		}
	}
	
	&.uploading {
		.video-with-overlay {
			opacity: 0.5;
			padding: 0;
			&:nth-child(1) {
				left: 50%;
				margin: 0;
				transform: translateX(-50%);
			}
			&:nth-child(2) {
				right: 50%;
				margin: 0;
				transform: translateX(50%);
			}
		}
	}
`

const PoseProgress = (props) => {
	const inst1 = props.srcs[0] ? '' : <>Record Your<br/> First Video</>
	const inst2 = props.srcs[1] ? '' : <>Record Your<br/> Second Video</>
	const hasBoth = props.srcs[0] && props.srcs[1]

	const [uploading, setUpload] = useState (false, []);

	const upload = useCallback(async () => {
		setUpload(true);
		try {
			await props.upload()
			//setUpload (false);
		} catch (error) {
			//setUpload (false);
		}

	}, [uploading])

	return (
		<Wrapper hasBoth={hasBoth} uploading={uploading} className={uploading ? 'uploading' : ''}>
			<div className="videos">
				<VideoWithOverlay src={props.srcs[0]} instruction={inst1} />
				<VideoWithOverlay src={props.srcs[1]} instruction={inst2} />
				<VideoWithOverlay src={props.srcs[0] || props.srcs[1]} instruction={inst2} className={'overlay-placeholder'}/>
			</div>

			<button onClick={upload} >Upload</button>
		</Wrapper>
	)
}

export default PoseProgress
