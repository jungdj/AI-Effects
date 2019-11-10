import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	width: 100%;
	height: 100vh;
	overflow: scroll;
	display: flex;
	flex-direction: column;
	padding-top: 70px;
	
	scroll-snap-type: y mandatory;
`

const PageTemplate = ({ children }) => {
	return (
		<Wrapper>
			{children}
		</Wrapper>
	)
}

export default PageTemplate;
