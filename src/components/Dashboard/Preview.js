import styled from "styled-components"
import { Player } from "video-react"
import React from "react"

import download from '../../static/icons/cloud_download-24px.svg'

const PrevWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 80%;
`

const Preview = ({ previewUrl }) => {
	return (
		<PrevWrapper onClick={e => e.stopPropagation()}>
			<Player playsInline src={previewUrl} fluid={false} />
			<a href={previewUrl}><img src={download} /></a>
		</PrevWrapper>
	)
}

export default Preview;
