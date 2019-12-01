import React from 'react';
import styled from 'styled-components'

import { SectionWithTitle, TR as BaseTR, TD as BaseTD } from "../utils/mixins"
import { getUploaded } from "../utils/api"
import usePromise from "../hooks/usePromise"

import Spinner from "./Spinner"

import mp4 from '../static/icons/FileIcon_MP4.png'
import VideoEdit from "./Dashboard/VideoEdit"
import { getSrcUrl } from "../variables"

const Wrapper = styled.div`
	${SectionWithTitle};
`

const TR = styled(BaseTR)`
	height: 32px;
	&:hover {
		background-color: rgb(37, 37, 37);
		border: 1px solid rgb(43, 43, 43);
		td { color: white; }
		cursor: pointer;
	}
	&.active {
		td { color: white; }
	}
`

const TD = styled(BaseTD)`
	height: 32px;
	color: #8f8f8f;
	border-bottom: 1px solid rgb(28,28,28);
	
	img {
		width: auto;
		height: 24px;
	}
`

const UploadedVideos = (props) => {
	const [loading, resolved, error] = usePromise (getUploaded, [props.tick])
	console.log('render UploadedVideos');
	let body = null
	if (loading) body = <Spinner />
	else if (error) {
		console.error(error);
		body = <div>Error occured!</div>
	}
	else if (!resolved) body = <div>Nothing to show</div>
	else {
		body =
			resolved.map(fileName => {
				return (
					<TR onClick={() => {
						props.tabAction({ type: 'push', value: { name: fileName, type: 'uploaded', fileName: fileName, component: VideoEdit }})
					}}>
						<TD>
							<img src={mp4} alt="" />
							{fileName}
						</TD>
					</TR>
				)
			})
	}

	return (
		<Wrapper>
			<div className={'__section-title'}>Uploaded Videos</div>
			<div className="__section-body">
				{body}
			</div>
		</Wrapper>
	)
}

export default UploadedVideos;
