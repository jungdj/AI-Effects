import React, { useCallback, useState } from 'react'
import styled from 'styled-components';

import Preview from "./Preview"
import { getSrcUrl } from "../../variables"

import { blurVideo, getPeople } from "../../utils/api"

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
`

const Menus = styled.div`
	width: 100%;
	justify-self: flex-end;
	border-top: 1px solid rgb(8,8,8);
	height: 60px;
	padding: 6px 24px;
	
	.face-blur {
		box-sizing: content-box;
		width: auto;
		height: 100%;
		&:hover {
			cursor: pointer;
			border: 1px solid #e5e5e5;
		}
		&.loading {
			opacity: 0.3;
			border: 1px solid #e5e5e5;
		}
	}
`

const Blur = (props) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const process = props.blurSrc ? props.toggle : async () => {
		setLoading(true);
		try {
			const result = await blurVideo (props.fileName, props.knowns || []);
			props.setResolved (result.data);
		} catch (e) {
			setError(e);
		}
		setLoading(false);
	};

	return <img
							onClick={process}
							src='http://www.jigzone.com/p/jz/jzM/Mozaic_Face_5310.jpg'
							className={`face-blur ${loading ? 'loading' : ''}`}
						/>
}

const VideoEdit = (props) => {
	console.log('video edit', props);
	const { fileName } = props;
	const defSrc = `/uploads/${fileName}`

	const [src, setSrc] = useState (defSrc)
	const [blurSrc, setBlurSrc] = useState ('');

	const toggle = useCallback (() => {
		console.log(src)
		if (src != blurSrc) setSrc (blurSrc)
		else setSrc (defSrc)
	}, [src, blurSrc])

	return (
		<Wrapper>
			<Preview previewUrl={getSrcUrl(src)} />
			<Menus>
				<Blur fileName={fileName} setResolved={setBlurSrc} blurSrc={blurSrc} toggle={toggle} knowns={props.knowns}/>
			</Menus>
		</Wrapper>
	)
}

export default VideoEdit;
