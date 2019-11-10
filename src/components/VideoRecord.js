import React, { useCallback, useEffect, useRef } from 'react'
import 'video.js/dist/video-js.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import 'videojs-record/dist/css/videojs.record.css';
import Record from 'videojs-record/dist/videojs.record.js';

const videoJsOptions = {
	controls: true,
	width: 320,
	height: 240,
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

const VideoRecord = () => {
	let player;
	let videoNode = useRef (null);

	const measuredRef = useCallback(node => {
		if (node !== null) {
			videoNode = node;
			player = videojs (videoNode, videoJsOptions, () => {
				var version_info = 'Using video.js ' + videojs.VERSION +
					' with videojs-record ' + videojs.getPluginVersion('record') +
					' and recordrtc ' + RecordRTC.version;
				videojs.log(version_info);
			})

			player.record ().getDevice ();

			// device is ready
			player.on('deviceReady', () => {
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
			});

			// error handling
			player.on('error', (element, error) => {
				console.warn(error);
			});

			player.on('deviceError', () => {
				console.error('device error:', player.deviceErrorCode);
			});

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
		<>
			<div data-vjs-player>
				<video id="myVideo" ref={measuredRef} className="video-js vjs-default-skin" playsInline></video>
			</div>
			<button onClick={startRecord} >Record</button>
			<button onClick={stopRecord} >Stop</button>
		</>
	);
}

export default VideoRecord;
