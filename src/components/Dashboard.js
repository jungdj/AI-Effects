import React from 'react';
import styled from 'styled-components';

import VideoInput from "./VideoInput"

const Wrapper = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: rgb(35, 35, 35);
	* {
		display: flex;
	}
	section {
		border: 0.1px solid lightslategrey;
	}
`

const Row1 = styled.section`
	width: 100%;
	flex: 7;
	
	.panel-1 {
		flex: 1;
		flex-direction: column;
		.panel-1-1 {
			flex: 2;
		}
		.panel-1-2 {
			flex: 1;
		}
	}
	.panel-2 {
		flex: 3;
		align-items: center;
		justify-content: center;
	}
	.panel-3 {
		flex: 1;
		flex-direction: column;
		.panel-3-1 {
			flex: 1;
		}
		.panel-3-2 {
			flex: 1;
		}
	}
`

const Row2 = styled.section`
	display: flex;
	width: 100%;
	flex: 3;
`

const Dashboard = () => {
	return (
		<Wrapper>
			<Row1>
				<section className="panel-1">
					<section className="panel-1-1"></section>
					<section className="panel-1-2"></section>
				</section>
				<section className="panel-2">

					<VideoInput />
				</section>
				<section className="panel-3">
					<section className="panel-3-1"></section>
					<section className="panel-3-2"></section>
				</section>
			</Row1>
			<Row2>

			</Row2>
		</Wrapper>
	)
}

export default Dashboard;
