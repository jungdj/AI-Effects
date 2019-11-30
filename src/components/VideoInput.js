import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components'
import {useDropzone} from 'react-dropzone'
import { Player } from 'video-react';

import addToQueue from '../static/icons/add_to_queue-24px.svg'

const Wrapper = styled.div`
	width: ${props => props.width || `100%`};
	height: ${props => props.height || `100%`};
	display: flex;
	justify-content: center;
	align-items: center;
	${props => props.url ? `` : css`
		margin: 20%;
		width: 60%;
		height: 60%;
	`}; 
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

const PrevWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`

const Preview = ({ previewUrl }) => {
	return (
		<PrevWrapper onClick={e => e.stopPropagation()}>
			<Player playsInline src={previewUrl} />
		</PrevWrapper>
	)
}

const sizeLimit = 50000000
const VideoInput = (props) => {
	const [url, setUrl] = useState ('');

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
					<Preview previewUrl={url} />
					:
					<Description />
			}
		</Wrapper>
	)
}

export default VideoInput
