import React, { useCallback, useState } from "react"
import styled from "styled-components";
import { useHistory } from 'react-router-dom'

import Intro from "./Intro"
import Spinner from "./Spinner"
import ServiceList from "./ServiceList"

const Wrapper = styled.div`
	
`;

const Main = () => {
	const [loading, setLoading] = useState(false);
	const history = useHistory ();
	const setTypeWithLoading = useCallback((type) => {
		setLoading(true);
		setTimeout (() => {
			history.push(`/${type}`);
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
