import React, { useReducer } from 'react';
import styled from 'styled-components';

import VideoInput from "./VideoInput"

import close from '../static/icons/close-24px.svg';

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
	section {
		padding: 1px;
	}
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
		overflow: hidden;
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

const PWTWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	.tabs {
		padding: 8px;
		display: flex;
		width: 100%;
		overflow: scroll;
		.tab {
			cursor: default;
			display: flex;
			align-items: center;
			font-size: 10px;
			position: relative;
			height: 24px;
			padding: 2px 6px 2px 8px;
			margin-right: 8px;
			
			.name {
				color: white;
				min-width: 30px;
				max-width: 130px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			background-color: rgb(60,63,65);
			&.active {
				background-color: rgb(80,80,80);
			}
			&:hover {
				background-color: rgb(40,40,40);
			}
			.close-button {
				margin-left: 6px;
				right: 0;
				width: 10px;
				height: 100%;
			}
		}
	}
	.pane {
		position: relative;
		width: 100%;
		height: 100%;
		.item {
			&.inactive {
				order: 1;
				flex: 1 0 100%;
				height: 100%;
				visibility: hidden;
			}
			&.active {
				order: 0;
				flex: 1 0 100%;
				height: 100%;
				visibility: visible;
			}
		}
	}
`

const PaneWithTabs = ({ tabs, cur, tabAction }) => {
	return (
		<PWTWrapper>
			<div className="tabs">
				{tabs.map((tab, i) => (
					<div className={`tab ${i == cur ? 'active' : 'inactive'}`} key={tab.name}
							 onClick={e => {
							 	tabAction({ type: 'activate', value: i })
							 }}
					>
						<div className='name'>{tab.name}</div>
						{i ? <img src={close} alt="" className="close-button" onClick={e => {
							tabAction({
								type: 'delete',
								value: i,
							})
							e.stopPropagation();
						}}/> : null}
					</div>
				))}
			</div>
			<div className="pane">
				{tabs.map((tab, i) => (
					<div className={`item ${i == cur ? 'active' : 'inactive'}`} key={tab.name}>
						{tabs[i].component}
					</div>
				))}
			</div>
		</PWTWrapper>
	)
}

const Dashboard = () => {
	const [tabData, tabAction] = useReducer ((state, action) => {
		switch (action.type) {
			case 'push':
				return { tabs: [...state.tabs, action.value], cur: state.cur + 1 }
			case 'delete':
				state.tabs.splice(action.value, 1)
				state.cur = (state.cur + 1) % state.tabs.length
				return { ...state };
			case 'activate':
				state.cur = action.value;
				return { ...state };
			default:
				return state;
		}
	}, { tabs: [{ name: 'Upload', type: 'upload', component: <VideoInput /> },
			{ name: 'Upload 2 Name is Too Long, Upload 2 Name is Too Long, Upload 2 Name is Too Long, Upload 2 Name is Too Long, ', type: 'upload', component: <h1>sasf</h1> }], cur: 0 })

	return (
		<Wrapper>
			<Row1>
				<section className="panel-1">
					<section className="panel-1-1"></section>
					<section className="panel-1-2"></section>
				</section>
				<section className="panel-2">

					<PaneWithTabs tabs={tabData.tabs} cur={tabData.cur} tabAction={tabAction}/>
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
