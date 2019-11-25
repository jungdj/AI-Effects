import React, {useState, useCallback} from "react";
import styled from 'styled-components';

import VideoRecord from './VideoRecord';
import PageTemplate from './PageTemplate';

import axios from 'axios';

var toWav = require('audiobuffer-to-wav')

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
  const [uploading, setUpload] = useState (false, []);

  let formData = null;

  const processVideo = (id, video) => {
    setSrc(window.URL.createObjectURL(video));
    // console.log("video: ", video)
  }

  const extractAudio = () => {
    var audioContext = new(window.AudioContext || window.webkitAudioContext)();
    var myBuffer;

    const sampleRate = 16000;
    const numberOfChannels = 1;

    return fetch(src).then(res => res.arrayBuffer()
    ).then(videoFileAsBuffer => audioContext.decodeAudioData(videoFileAsBuffer)
    ).then(decodedAudioData => {
    
      var duration = decodedAudioData.duration;

      var offlineAudioContext = new OfflineAudioContext(numberOfChannels, sampleRate * duration, sampleRate);
      var soundSource = offlineAudioContext.createBufferSource();

      myBuffer = decodedAudioData;
      soundSource.buffer = myBuffer;
      soundSource.connect(offlineAudioContext.destination);
      soundSource.start();

      return offlineAudioContext.startRendering();
    }).then( renderedBuffer => toWav(renderedBuffer))
    .catch(err => console.log('Rendering failed: ', err));
  }

  const upload = useCallback(async () => {
    setUpload(true);
    
    extractAudio().then(audioBuffer => {
      const blob = new Blob([audioBuffer], {type: 'audio/wav'});
      let formData = new FormData();
      formData.append('audio', blob)
      console.log("audioblob: ", formData.get('audio'));

      axios.post('http://localhost:6001/audio', formData)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    });
    // setUpload(false);
  }, [uploading, src])

	return (
		<PageTemplate>
      <VideoRecord id="tongSlip" processVideo={processVideo} />
      <Wrapper>
        <button onClick={upload}>Upload</button>
      </Wrapper>
		</PageTemplate>
	)
}

export default TongueSlip;
