import React from 'react';
import styled from 'styled-components';

import GridLoader from 'react-spinners/GridLoader';

import { SectionWithTitle, Table, TR as BaseTR, TD as BaseTD } from "../../utils/mixins"

import tag from '../../static/icons/tag-solid.svg';
import video from '../../static/icons/video-solid.svg'
import microphone from '../../static/icons/microphone-alt-solid.svg'
import done from '../../static/icons/done_outline-24px.svg'
import download from '../../static/icons/cloud_download-24px.svg'
import faceMask from '../../static/icons/theater-masks-solid.svg'
import userTag from '../../static/icons/user-tag-solid.svg'

const Wrapper = styled.div`
	${SectionWithTitle};
`

const TR = styled(BaseTR)`
	td:first-child { width: 30%; flex: 1; }
	td:nth-child(2) { width: 25px; }
	td:nth-child(3) { width: 60px; }
	td:nth-child(4) { width: 85px; }
	td:nth-child(5) { width: 45px; }
`

const TD = styled(BaseTD)`
	img {
		width: 12px;
		height: 12px;
	}
	img + img {
		margin-left: 6px; 
	}
`

const gridLoading = <GridLoader size={2} color={'#8f8f8f'} css={`
	white-space: pre-wrap;
`}/>

const Features = () => {
	return (
		<Wrapper>
			<Table className={'__section-body'}>
				<Table.Head>
					<TR>
						<TD>Name</TD>
						<TD><img src={tag} /></TD>
						<TD>Type</TD>
						<TD>Requirements</TD>
						<TD>State</TD>
					</TR>
				</Table.Head>

				<Table.Body>
					<TR>
						<TD>Subtitles</TD>
						<TD>X</TD>
						<TD>Voice</TD>
						<TD><img src={microphone} /><img src={video} /></TD>
						<TD><img src={download} /></TD>
					</TR>
					<TR>
						<TD>Known People</TD>
						<TD>X</TD>
						<TD>Face</TD>
						<TD><img src={video} /></TD>
						<TD><img src={done} /></TD>
					</TR>
					<TR>
						<TD>Tongue Slip</TD>
						<TD>X</TD>
						<TD>Voice</TD>
						<TD><img src={microphone} /><img src={video} /></TD>
						<TD><img src={download} /></TD>
					</TR>
					<TR>
						<TD>Face Blur</TD>
						<TD>X</TD>
						<TD>Face</TD>
						<TD><img src={video} /></TD>
						<TD>{gridLoading}</TD>
					</TR>
					<TR>
						<TD>Video Concat</TD>
						<TD>X</TD>
						<TD>Pose</TD>
						<TD><img src={video} /></TD>
						<TD><img src={download} /></TD>
					</TR>
				</Table.Body>

			</Table>
		</Wrapper>
	)
}

export default Features;
