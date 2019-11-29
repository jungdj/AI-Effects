import React, { useState, useCallback } from 'react';
import styled from 'styled-components';

// import VideoRecord from './VideoRecord';
// import PoseProgress from './PoseProgress';

import PageTemplate from "./PageTemplate"

import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const server_addr = 'http://localhost:5000/upload'
const Wrapper = styled.div`
	color: white;
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
	img {
		height: auto;
		width: 200px;
	}
`
const FaceBlur = () => {
	const [uploading, setUpload] = useState(false, []);
	const [videofile, setVideofile] = useState([]);
	const [imagefile, setImagefile] = useState([]);
	const [imageuploaded, setImageuploaded] = useState([]);

	const handleVideoChange = e => {
		setVideofile(e.target.files);
		setUpload(false);
	}
	const handleImageChange = e => {
		setImagefile(e.target.files)
	}
	const uploadVideo = useCallback(async () => {
		if (videofile.length === 1) {
			const data = new FormData();
			data.append('file', videofile[0])
			axios.post(server_addr, data)
				.then(res => {
					console.log("response: ", res)
					toast.success('upload success')
				}).catch(err => {
					console.log(err)
					toast.error('upload fail')
				});
		}
	}, [uploading, videofile])

	const uploadImages = useCallback(async () => {
		const data = new FormData();
		console.log(imagefile)
		for (var x = 0; x < imagefile.length; x++) {
			data.append('file', imagefile[x])
		}
		axios.post(server_addr + '/knowns', data)
			.then(res => {
				console.log("response: ", res)
				toast.success('upload success')
			}).catch(err => {
				console.log(err)
				toast.error('upload fail')
			});
	}, [uploading, imagefile])

	const blurFaces = useCallback(async () => {
		console.log(videofile.length)
		if (videofile.length === 1) {
			window.open(server_addr + videofile[0].name)
		}
	}, [uploading, videofile])

	return (
		<PageTemplate>
			<Wrapper>
				<form className='upload-video'>
					<label>
						Select Video: &nbsp;
					<input type="file" name="videos" accept="video/*" onChange={handleVideoChange} />
					</label>
				</form>
				<button onClick={uploadVideo}>Upload Video</button>

				<form className='upload-image'>
					<label>
						People not to blur: &nbsp;
					<input type="file" name="photos" accept="image/jpeg" multiple onChange={handleImageChange} />
					</label>
				</form>
				<button onClick={uploadImages}>Upload Images</button>

				<img src= {server_addr + "/video_feed"} />
				<button onClick={blurFaces}>blurFaces</button>
			</Wrapper>
		</PageTemplate>
	)
}

export default FaceBlur;
