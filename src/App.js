import React, { useState } from 'react';
import styled from "styled-components";

import Main from "./components/Main"
import TongueSlip from "./components/TongueSlip"
import Pose from "./components/Pose"

const Wrapper = styled.div`
  background-color: rgb(20, 20, 20);
  min-height: 100vh;
 
`

function App() {
  const [type, setType] = useState("")

  const Content = () => {
    if (type === "pose") {
      return <Pose/>
    } else if (type === "slip") {
      return <TongueSlip/>
    } else {
      return <Main setType={setType}/>
    }
  }

  return (
    <Wrapper>
      <Content />
    </Wrapper>
  )
}

export default App;
