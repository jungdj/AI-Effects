import React from 'react';

import styled from 'styled-components';

import usePromise from "../../hooks/usePromise"
import { getPeople } from "../../utils/api"

import Spinner from "../Spinner"
import { SectionWithTitle, Center } from "../../utils/mixins"
import { getSrcUrl } from "../../variables"

const Wrapper = styled.div`
	${SectionWithTitle};
`

const HorScroller = styled.div`
	display: flex;
	flex-wrap: wrap;
	
	width: 100%;
	height: auto;
	padding: 10px;
  
	.item {
		width: 100px;
		height: 100px;
		margin-right: 10px;
		margin-bottom: 10px;
		&.known {
			border: 5px solid rgb(144,144,144);
		}
		&:hover {
			cursor: pointer;
			border: 5px solid #8f8f8f;
		}
  	
		img {
			width: 100px;
			height: 100px;
		}
	}
`


const KnownPeople = (props) => {
	const key = props.data.fileName
	const knowns = props.data.knowns || []
	console.log("known people", knowns)

	const toggle = (name) => {
		console.log('toggle', name);
		props.tabAction({
			type: 'knowns',
			value: name
		})
	}

	const getPeopleIfFile = async () => {
		if (key) return getPeople (key);
		return null;
	}
	const [loading, resolved, error] = usePromise (getPeopleIfFile, [key])
	console.log({ resolved })

	let body = null
	if (loading) body = <Center><Spinner.inline /></Center>
	else if (error) {
		console.error(error);
		body = <div>Error occured!</div>
	}
	else if (!resolved) body = <div>Nothing to show</div>
	else {
		body =
			<HorScroller>
				{resolved.data.map(src => {
					const srcNames = src.split('/')
					const srcName = srcNames[srcNames.length - 1].split('.')[0];
					const known = knowns.find(x => x === srcName);

					return (
						<div className={`item ${known ? 'known' : ''}`} onClick={() => toggle(srcName)}>
							<img src={`${getSrcUrl (src)}`} key={src} />
						</div>
					)
				})}
			</HorScroller>
	}

	return (
		<Wrapper>
			<div className={'__section-title'}>Known People</div>
			<div className="__section-body">
				{body}
			</div>
		</Wrapper>
	)
}

export default KnownPeople;
