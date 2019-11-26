import React, {useState, useCallback} from "react";
import styled from 'styled-components';

import VideoRecord from './VideoRecord';
import PageTemplate from './PageTemplate';

import axios from 'axios';
import { readFile } from "fs";

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
  
  .file-upload {
    color: white;
    margin-bottom: 50px;
  }
`

const TongueSlip = () => {
  const [src, setSrc] = useState('')
  const [uploading, setUpload] = useState (false, []);
  const [videofile, setVideofile] = useState('');

  let formData = null;

  const processVideo = (id, video) => {
    setSrc(window.URL.createObjectURL(video));
    setVideofile('')
    setUpload(false);
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
      // return [offlineAudioContext.startRendering(), duration];
    }).then( renderedBuffer => {
      return [toWav(renderedBuffer), renderedBuffer.duration]
    })
    .catch(err => console.log('Rendering failed: ', err));
  }

  const upload = useCallback(async () => {
    
    extractAudio().then(data => {
      // data[0]: audioBuffer
      // data[1]: audio duration(time)

      const blob = new Blob([data[0]], {type: 'audio/wav'});
      let formData = new FormData();
      formData.append('audio', blob)
      formData.append('duration', data[1])
      
      axios.post('http://localhost:6001/audio', formData)
      .then(res => {
        const message = res.data;
        // success if 문에 들어가야함... 일단 Temp
        setUpload(true);
        
        if (message == 'success') {
          
        }
        else {
          // audio is empty: no one spoke in given video file..
          console.log(res.data);
        }
      })
      .catch(err => console.log(err));
    });
    // setUpload(false);
  }, [uploading, src])

  const handleChange = e => {
    setVideofile(e.target.value);
    setSrc(window.URL.createObjectURL(e.target.files[0]));
    setUpload(false);
  }

	return (
		<PageTemplate>
      <VideoRecord id="tongueSlip" processVideo={processVideo} />
      {uploading
      ? (
      <Wrapper>

      </Wrapper>
      ) : (
      <Wrapper>
        <form className='file-upload'>
          <label>
            Video File: &nbsp;
            <input type="file" name="videos" accept="video/*" value={videofile} onChange={handleChange} />
          </label>
          {/* <input type="submit" value="Submit" /> */}
        </form>
        <button onClick={upload}>Upload</button>
      </Wrapper>
      )}
		</PageTemplate>
	)
}

export default TongueSlip;
