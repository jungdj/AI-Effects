import React, { useCallback, useState } from "react"
import styled from "styled-components";
import { useHistory } from 'react-router-dom'
import storage from "../utils/storage"

import Intro from "./Intro"
import Spinner from "./Spinner"
import ProfileList from "./ProfileList"

const Wrapper = styled.div`
	
`;

const Main = () => {
	const [loading, setLoading] = useState(false);
	const history = useHistory ();
	const setProfileWithLoading = useCallback((name) => {
		setLoading(true);
		setTimeout (() => {
			storage.setItem ('profile', name)
			history.push(`/main`);
			setLoading(false);
		}, 1500);
	}, []);

	return (
		<Wrapper>
			<Intro key={0} />
			{loading && <Spinner/>}
			<ProfileList selectProfile={setProfileWithLoading} loading={loading}/>
		</Wrapper>
	)
}

export default Main;
