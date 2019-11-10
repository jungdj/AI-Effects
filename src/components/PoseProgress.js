import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	scroll-snap-align: start;
	width: 100vw;
	min-height: calc(100vh - 70px);
	height: calc(100vh - 70px);
`

const PoseProgress = (props) => {
	return (
		<Wrapper>
			<video src={props.srcs[0]} />
			<video src={props.srcs[1]} />
			<button onClick={props.upload} >Upload</button>
		</Wrapper>
	)
}

export default PoseProgress
