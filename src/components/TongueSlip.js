import React, {useState} from "react";
import styled from 'styled-components';

import VideoRecord from './VideoRecord';
// import PoseProgress from './PoseProgress';

import PageTemplate from './PageTemplate';

const Wrapper = styled.div`
// CSS 여기에 Sass 쓰면됨
  scroll-snap-align: start;
	width: 100vw;
	padding: 70px 0 200px 0;
	min-height: 100vh;	
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
`

const TongueSlip = () => {
  const [src, setSrc] = useState ('')

  const processVideo = (id, video) => {
		setSrc(window.URL.createObjectURL(video));
		console.log('videoObject', window.URL.createObjectURL(video))
	}

	return (
		<PageTemplate>
      <VideoRecord id="tongSlip" processVideo={processVideo} />
      <Wrapper>
        <button>Upload</button>
      </Wrapper>
		</PageTemplate>
	)
}

export default TongueSlip;
