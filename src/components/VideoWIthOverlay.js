import React from 'react';
import styled from 'styled-components';
import "video-react/dist/video-react.css"; // import css
import { Player } from 'video-react';

const Wrapper = styled.div`
	position: relative;
		
	video {
		width: 100%;
		height: 100%;
	}
`
const Overlay = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	
	.instruction {
		position: absolute;
		top: calc(50% + 10px);
		left: 2%;
		color:#f3f3f3;		
		font-family: 'BebasNeue';
		font-size: 6vmin;
		font-weight: 700;
		font-stretch: 200%;
		letter-spacing: 14px;
		z-index: 10;
	}
`

const VideoWithOverlay = (props) => {
	const { src } = props;
	return (
		<Wrapper className={'video-with-overlay ' + (props.className || '')}>
			{
				src ?
					<Player
						playsInline
						//poster="/assets/poster.png"
						src={src}
					/>
					:
					<Overlay>
						<div className="instruction">{props.instruction}</div>
					</Overlay>
			}
		</Wrapper>
	)
}

export default VideoWithOverlay;
