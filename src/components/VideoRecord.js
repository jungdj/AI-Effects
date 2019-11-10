import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components'
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

const videoJsOptions = {
	controls: true,
	//width: 320,
	//height: 240,
	fluid: false,
	plugins: {
		/*
		// wavesurfer section is only needed when recording audio-only
		wavesurfer: {
				src: 'live',
				waveColor: '#36393b',
				progressColor: 'black',
				debug: true,
				cursorWidth: 1,
				msDisplayMax: 20,
				hideScrollbar: true
		},
		*/
		record: {
			audio: true,
			video: true,
			maxLength: 10,
			debug: true
		}
	}
};

const Wrapper = styled.div`
	position: relative;
	width: 100vw;
	min-height: calc(100vh - 70px);
	height: calc(100vh - 70px);
	scroll-snap-align: start;
`

const Overlay = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
	
	.instruction {
		position: absolute;
		top: calc(50% + 40px);
		left: 2%;
		color:#f3f3f3;		
		font-family: 'BebasNeue';
		font-size: 12vmin;
		font-weight: 700;
		font-stretch: 200%;
		letter-spacing: 14px;
	}
	
	${props => props.show ? css`
		.instruction {
			z-index: 10;
		}
	` : css`
		z-index: 0;
	`}
`

const VideoWrapper = styled.video`
	width: 100%;
	height: 100%;
`


const Instructions = {
	first: <>Record Your<br/> First Video</>,
	second: <>Record Your<br/> Second Video</>
}
const VideoRecord = ({ id, appendVideo, done }) => {
	let player;
	let videoNode = useRef (null);

	const [overlay, setOverlay] = useState (true);

	const measuredRef = useCallback(node => {
		if (node !== null) {
			videoNode = node;
			player = videojs (videoNode, videoJsOptions, () => {
				var version_info = 'Using video.js ' + videojs.VERSION +
					' with videojs-record ' + videojs.getPluginVersion('record') +
					' and recordrtc ' + RecordRTC.version;
				videojs.log(version_info);
			})

			// device is ready
			player.on('deviceReady', () => {
				setOverlay (false)
				console.log('device is ready!');
			});

			// user clicked the record button and started recording
			player.on('startRecord', () => {
				console.log('started recording!');
			});

			// user completed recording and stream is available
			player.on('finishRecord', () => {
				// recordedData is a blob object containing the recorded data that
				// can be downloaded by the user, stored on server etc.
				console.log('finished recording: ', player.recordedData);

				done (true);
				appendVideo (id, player.recordedData);

				// Create an instance of FormData and append the video parameter that
				// will be interpreted in the server as a file
				let formData = new FormData();
				formData.append('video', player.recordedData.video);
			});

			// error handling
			player.on('error', (element, error) => {
				console.warn(error);
			});

			player.on('deviceError', () => {
				console.error('device error:', player.deviceErrorCode);
			});

			//player.record ().getDevice ();

			return () => {
				player.dispose ();
			}
		}
	}, []);

	const startRecord = useCallback (() => {
		if (!player) return;
		try {
			player.record().start();
		} catch (error) {
			player.on('deviceReady', () => {
				player.record().start();
			});
		}
	})

	const stopRecord = useCallback (() => {
		if (!player) return;
		player.record ().stop ();
	})

	return (
		<Wrapper>
			<Overlay className="overlay" show={overlay}>
				<div className="instruction">
					{Instructions[id]}
				</div>
				{/*<button onClick={startRecord} >Record</button>*/}
				{/*<button onClick={stopRecord} >Stop</button>*/}
			</Overlay>
			<div data-vjs-player>
				<VideoWrapper ref={measuredRef} className="video-js vjs-default-skin" playsInline></VideoWrapper>
			</div>
		</Wrapper>
	);
}

VideoRecord.propTypes = {
	id: PropTypes.string.isRequired,
}

export default VideoRecord;
