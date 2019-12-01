import React, { useState, useReducer, useCallback } from 'react';
import styled from 'styled-components';

import VideoInput from "./VideoInput"

import close from '../static/icons/close-24px.svg';
import Subtitles from "./Dashboard/Subtitles"
import KnownPeople from "./Dashboard/KnownPeople"
import Features from "./Dashboard/Features"
import UploadedVideos from "./UploadedVideos"

const Wrapper = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	background-color: rgb(35, 35, 35);
	color: white;
	section {
		display: flex;
	}
`

const Row1 = styled.section`
	width: 100%;
	height: 100vh;
	section {
		padding: 1px;
	}
	> section {
		border: 2px solid rgb(22,22,22);
	}
	.panel-1-1, .panel-3-1 {
		border-bottom: 4px solid rgb(22,22,22);
	}
	
	.panel-1 {
		flex: 1;
		flex-direction: column;
		.panel-1-1 {
			flex: 2;
		}
		.panel-1-2 {
			flex: 2;
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
			height: 50%;
		}
		.panel-3-2 {
			height: 50%;
			overflow: hidden;
		}
	}
`

const Row2 = styled.section`
	display: flex;
	width: 100%;
	height: 30vh;
	> section {
		border: 2px solid rgb(22,22,22);
	}
	.panel-1 {
		flex: 2;
	}
	.panel-2 {
		flex: 3;
	}
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
		display: flex;
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

const PaneWithTabs = ({ tabs, cur, tabAction, uploadCb }) => {
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
				{tabs.map((tab, i) => {
					const Component = tabs[i].component;
					return (
						<div className={`item ${i == cur ? 'active' : 'inactive'}`} key={tab.name}>
							<Component {...tabs[i]} cb={uploadCb} />
						</div>
					)
				})}
			</div>
		</PWTWrapper>
	)
}

const Dashboard = () => {
	const [tick, setTick] = useState(0);
	const uploadCb = useCallback(() => { setTick (tick+1) }, [tick])

	const [tabData, tabAction] = useReducer ((state, action) => {
		switch (action.type) {
			case 'push':
				if (state.tabs.find(x => x.name === action.value.name) != null) return state;
				return { tabs: [...state.tabs, action.value], cur: state.tabs.length };
			case 'delete':
				state.tabs.splice(action.value, 1)
				state.cur = (state.cur + 1) % state.tabs.length
				return { ...state };
			case 'knowns':
				const cur = state.tabs[state.cur];
				if (!cur.knowns) {
					cur.knowns = []
				}
				const index = cur.knowns.findIndex(x => x === action.value)
				console.log('yes knowns', index);
				if (index == -1) cur.knowns.push(action.value)
				else cur.knowns.splice (index, 1);
				console.log('cur', cur)
				state.tabs[state.cur] = cur;
				return { ...state, tabs: [...state.tabs] }
			case 'activate':
				state.cur = action.value;
				return { ...state };
			default:
				return state;
		}
	}, {
		tabs: [
			{ name: 'Upload', type: 'upload', fileName: '', component: VideoInput },
		],
		cur: 0
	})

	const cur = tabData.tabs[tabData.cur]

	return (
		<Wrapper>
			<Row1>
				<section className="panel-1">
					<section className="panel-1-1">
						<UploadedVideos tabAction={tabAction} data={cur} tick={tick} />
					</section>
					<section className="panel-1-2">
						<Features/>
					</section>
				</section>
				<section className="panel-2">
					<PaneWithTabs tabs={tabData.tabs} cur={tabData.cur} tabAction={tabAction} uploadCb={uploadCb} />
				</section>
				<section className="panel-3">
					<section className="panel-3-1">
						<KnownPeople data={cur} tabAction={tabAction} />
					</section>
					<section className="panel-3-2">
						<Subtitles/>
					</section>
				</section>
			</Row1>
			{/*<Row2>*/}
			{/*	<section className="panel-1">*/}
			{/*		<h1>Generated Videos</h1>*/}
			{/*	</section>*/}
			{/*	<section className="panel-2">*/}
			{/*		<h1>Operations on Progress</h1>*/}
			{/*	</section>*/}
			{/*</Row2>*/}
		</Wrapper>
	)
}

export default Dashboard;
