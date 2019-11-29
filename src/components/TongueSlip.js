import React, {useState, useCallback} from "react";
import styled from 'styled-components';
import VideoRecord from './VideoRecord';
import PageTemplate from './PageTemplate';
import { Progress } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
//   const [src, setSrc] = useState('');
//   const [video, setVideo] = useState('');
  const [uploading, setUpload] = useState (false, []);
  const [videofile, setVideofile] = useState([]);

//   const processVideo = (id, video) => {
//     setVideo(video);
//     setSrc(window.URL.createObjectURL(video));
//     setVideofile('');
//     setUpload(false);
//     // console.log("video: ", video)
//   }

  const upload = useCallback(async () => {
    const data = new FormData();
    for (var x = 0; x < videofile.length; x++) {
      data.append('file', videofile[x])
    }
    axios.post('http://localhost:5000/video_crop', data)
    .then(res => {
      console.log("response: ", res)
      toast.success('upload success')
    }).catch(err => {
        console.log(err)
        toast.error('upload fail')
    });
    
  }, [uploading, videofile])

  const handleChange = e => {
    setVideofile(e.target.files);
    // const blob = new Blob([e.target.files[0]], {type: 'video/'});
    // setVideo(blob);
    // setSrc(window.URL.createObjectURL(e.target.files[0]));
    setUpload(false);
  }

	return (
    <PageTemplate>
      {/* <VideoRecord id="tongueSlip" processVideo={processVideo} /> */}
      {uploading
      ? (
      <Wrapper>
        <button onClick={upload}>Upload</button>
      </Wrapper>
      ) : (
      <Wrapper>
        <form className='file-upload'>
          <label>
            Video File: &nbsp;
            <input type="file" name="videos" accept="video/*" onChange={handleChange} />
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
