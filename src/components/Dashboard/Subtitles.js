import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import usePromise from "../../hooks/usePromise"

import Spinner from "../Spinner"

import { getSubtitles } from "../../utils/api"
import { SectionWithTitle } from "../../utils/mixins"

const Wrapper = styled.div`
	${SectionWithTitle};
`

const Table = styled.table`
	position: relative;
	width: 100%;
	height: 100%;
`

Table.Head = styled.thead`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	//height: 24px;	
	background-color: rgb(45,45,45);
	color: rgb(138,138,138);
	padding: 4px 0;
	tr { font-size: 12px; }
	td { 
		border-right: 1px solid rgb(9,9,9);
		padding: 0 4px;
		color: rgb(138,138,138);
	}
`

Table.Body = styled.tbody`
	position: relative;
	display: block;
	width: 100%;
	height: calc(100% - 24px);
	overflow: scroll;
	margin-top: 24px;
	background-color: rgb(34,34,34);
	border-top: 1px solid rgb(28,28,28);

	tr { 
		font-size: 11px; 
		flex: 0 0 20px;
		border-bottom: 1px solid rgb(28,28,28);
	}
`

const TR = styled.tr`
	display: flex;
	width: 100%;
	overflow: scroll;
	td:first-child { width: 30%; }
	td:nth-child(2) { width: 50%; }
	td:nth-child(3) { width: 20%; }
	//td:nth-child(4) { width: 20%; }
	white-space: nowrap;
	justify-content: flex-start;
`

const TD = styled.td`
	padding: 2px 4px;
`

const twoDigit = (num) => {
	if (num >= 10) return num;
	else return '0' + num;
}
const prettyTime = time => {
	const total = parseInt(time)
	const hour = Math.floor(total / 3600)
	const min = Math.floor((total % 3600) / 60)
	const sec = (total % 60)
	return `${twoDigit(hour)}:${twoDigit(min)}:${twoDigit(sec)}`
}

const Subtitles = () => {
	const key = 'tmp'
	const [loading, resolved, error] = usePromise(getSubtitles, [key])

	let body = null
	if (loading) body = <Spinner />
	else if (error) {
		console.error(error);
		body = <div>Error occured!</div>
	}
	else if (!resolved) body = <div>Nothing to show</div>
	else {
		body =
			<>
				{resolved.map(data => {
					const { word, start_time, speaker_tag } = data
					return (
						<TR>
							<TD>{prettyTime(start_time)}</TD>
							<TD>{word}</TD>
							<TD>{speaker_tag}</TD>
						</TR>
					)
				})}
			</>
	}

	return (
		<Wrapper>
			<Table className={'__section-body'}>
				<Table.Head>
					<TR>
						<TD>Timestamp</TD>
						<TD>Body</TD>
						<TD>Speaker</TD>
					</TR>
				</Table.Head>

				<Table.Body>
					{body}
				</Table.Body>

			</Table>
		</Wrapper>
	)
}

export default Subtitles;
