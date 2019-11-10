import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
	width: 100%;
	height: auto;
	max-height: 100vh;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
`

const PageTemplate = ({ children }) => {
	return (
		<Wrapper>
			{children}
		</Wrapper>
	)
}

export default PageTemplate;
