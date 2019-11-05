import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Main from "./components/Main"
import TongueSlip from "./components/TongueSlip"
import Pose from "./components/Pose"

function App() {

  const [type, setType] = useState("")

  if (type === "pose") {
    return <Pose/>
  } else if (type === "slip") {
    return <TongueSlip/>
  } else {
    return <Main/>
  }
}

export default App;
