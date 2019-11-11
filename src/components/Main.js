import React, { useCallback, useState } from "react"
import styled from "styled-components";

import Intro from "./Intro"
import Spinner from "./Spinner"
import ServiceList from "./ServiceList"

const Wrapper = styled.div`
	
`;

const Main = ({ setType }) => {
	const [loading, setLoading] = useState(false);
	const setTypeWithLoading = useCallback((type) => {
		setLoading(true);
		setTimeout (() => {
			setType(type)
			setLoading(false);
		}, 1500);
	}, []);

	return (
		<Wrapper>
			<Intro key={0} />
			{loading && <Spinner/>}
			<ServiceList setType={setTypeWithLoading} loading={loading}/>
		</Wrapper>
	)
}

export default Main;
