import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components'
import {useDropzone} from 'react-dropzone'

import addToQueue from '../static/icons/add_to_queue-24px.svg'
import uploadImg from '../static/icons/cloud_upload-24px.svg'
import { uploadVideo } from "../utils/api"
import Preview from "./Dashboard/Preview"

const Wrapper = styled.div`
	width: ${props => props.width || `100%`};
	height: ${props => props.height || `100%`};
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	${props => props.url ? `` : css`
		margin: 20%;
		width: 60%;
		height: 60%;
	`}; 
	
	.upload {
		display: flex;
		flex-direction: column;
		color: #8f8f8f;
		font-size: 24px;
		font-weight: bold;
		margin-bottom: 12%;
		img {
			width: 80px;
		}
		
		&:hover {
			cursor: pointer;
			img {
				border: 2px solid rgba(43, 43, 43, 0);
			}
			font-size: 22px;
		}
	}
`
const DescWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: rgb(27, 27, 27);
	border-radius: 1px;
	&:hover {
		cursor: pointer;
		background-color: rgb(37, 37, 37);
		border: 1px solid rgb(43, 43, 43);
	}
	
	p {
		color: rgb(143, 143, 143);
		font-weight: bold;
		margin-top: 20px;
	}
	
	img {
		width: 40%;
		filter: invert(.5);
	}
	svg {
		fill: white;
		color: white;
	}
`

const Description = () => {
	return (
		<DescWrapper>
			<img src={addToQueue} />
			<p>Add Video</p>
		</DescWrapper>
	)
}

const sizeLimit = 50000000
const VideoInput = (props) => {
	const [url, setUrl] = useState ('');
	const [files, setFiles] = useState([]);

	const upload = useCallback ((e) => {
		e.stopPropagation ()
		const formData = new FormData ();
		formData.append ('file', files[files.length - 1])
		//axios.post('http://localhost:5000/upload', formData)
		uploadVideo (formData)
			.then(() => {
				props.cb();
				setUrl ('');
				setFiles([]);
				alert("success")
			})
			.catch(error => console.error(error))
	}, [url])

	const onDrop = useCallback((acceptedFiles) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader()

			reader.onabort = () => console.log('file reading was aborted')
			reader.onerror = () => console.log('file reading has failed')
			reader.onload = () => {
				// Do whatever you want with the file contents
				const dataUrl = reader.result
				console.log(dataUrl)
				setUrl (dataUrl)
			}
			reader.readAsDataURL(file)
		})
		setFiles ([...files, ...acceptedFiles])
	}, [])
	const onDropRejected = useCallback (rejected => {
		const file = rejected[0]
		if (!file) return alert('File Not Found')
		else if (file.type !== 'mp4') return alert("File Type Not Supported")
		else if (file.size > sizeLimit) return alert("File Too Large (> 50MB)")
		else alert("Something Went Wrong")
	}, []);

	const {getRootProps, getInputProps} = useDropzone({
		onDrop,
		onDropRejected,
		maxSize: sizeLimit,
		accept: 'video/mp4'
	})

	return (
		<Wrapper url={url} {...getRootProps()} {...props} >
			<input {...getInputProps()} />
			{
				url ?
					<>
						<Preview previewUrl={url} />
						<div className="upload" onClick={upload}>
							<img src={uploadImg} />
							Upload
						</div>
					</>
					:
					<Description />
			}
		</Wrapper>
	)
}

export default VideoInput
