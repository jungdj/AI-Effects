import React from 'react';
import styled from 'styled-components';

import PageTemplate from "./PageTemplate"
const Wrapper = styled.div`
// CSS 여기에 Sass 쓰면됨
	display: flex;
	flex-direction: column; 
	width: 100vw;
	height: 100vh;
	padding-top: 70px;
`

const FaceBlur = () => {
	return (
		<PageTemplate>
			<Wrapper>
				{/*	여기에 리엑트*/}
			</Wrapper>
		</PageTemplate>
	)
}

export default FaceBlur;
