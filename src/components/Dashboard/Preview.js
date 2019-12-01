import styled from "styled-components"
import { Player } from "video-react"
import React from "react"

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

export default Preview;
