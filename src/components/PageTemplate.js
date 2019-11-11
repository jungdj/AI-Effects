import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	width: 100%;
	height: 100vh;
	overflow: scroll;
	display: flex;
	flex-direction: column;
	scroll-snap-type: y mandatory;
`

const PageTemplate = ({ children }) => {
	return (
		<Wrapper className="animated fadeIn">
			{children}
		</Wrapper>
	)
}

export default PageTemplate;
