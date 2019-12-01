import React, { useCallback } from 'react';
import styled, { css } from 'styled-components';

import usePromise from "../../hooks/usePromise"

import Spinner from "../Spinner"

import { getSubtitles } from "../../utils/api"
import { SectionWithTitle, Center } from "../../utils/mixins"

import { Table, TR as BaseTR, TD } from "../../utils/mixins"
import { stt_mock } from "../../utils/mocks"

const Wrapper = styled.div`
	${SectionWithTitle};
`

const TR = styled(BaseTR)`
	td:first-child { width: 30%; }
	td:nth-child(2) { width: 50%; }
	td:nth-child(3) { width: 20%; }
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

const Subtitles = (props) => {
	const key = props.data.fileName
	const getFunc = async () => {
		if (key) return getSubtitles (key);
		return null;
	}
	const [loading, resolved, error] = usePromise(getFunc, [key])

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
				{resolved.data
					.map(({ value, start_secs, ...others }) => ({ word: value, start_time: start_secs, ...others }))
					.reduce((acc, cur, i) => {
							if (!i) return [cur]
							const last = acc[acc.length - 1]
							if (last.speaker_tag != cur.speaker_tag) return [...acc, cur]
							if (last.word.length > 15) return [...acc, cur]
							last.word += ' ' + cur.word
							last.end_time = cur.end_time
							return [...acc.slice(0, acc.length -1), last]
						}, [])
					.map(data => {
							const { word, start_time, speaker_tag } = data
							return (
								<TR>
									<TD>{prettyTime(start_time)}</TD>
									<TD>{word}</TD>
									<TD>{speaker_tag}</TD>
								</TR>
							)
						})
				}
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
