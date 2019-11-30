import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
} from "react-router-dom";

import Main from "./components/Main"
import TongueSlip from "./components/TongueSlip"
import Pose from "./components/Pose"
import FaceBlur from "./components/FaceBlur"

import "animate.css"

import logo from "./static/logo.png";

const Wrapper = styled.div`
  background-color: rgb(20, 20, 20);
  min-height: 100vh;
 header {
 	display: flex;
 	align-items: center;
 	position: fixed;
 	top: 0;
 	left: 0;
 	width: 100%;
 	z-index: 999;
 	overflow: hidden;
	transition: all 0.3s;
	text-align:center;
	padding: 0 4%;
	height: 70px;
	img {
		width: auto;
		height: 31px;
	}
	background-color: rgba(15, 15, 15, 0);
	
	&.shrink {
		background-color: rgba(15, 15, 15, 1);
	}
 }
`

function App() {
	const [shrinked, setShrinked] = useState(false);
	useEffect(() => {
		var shrinkHeader = 100;
		function getCurrentScroll() {
			return window.pageYOffset || document.documentElement.scrollTop;
		}
		window.addEventListener('scroll', () => {
			var scroll = getCurrentScroll();
			if ( scroll >= shrinkHeader ) {
				setShrinked(true);
			}
			else {
				setShrinked(false);
			}
		})
	}, [])

  return (
		<Router>
			<Wrapper>
				<header className={shrinked ? 'shrink' : ''}>
					<Link to={"/"}>
						<img src={logo} style={{ cursor: 'pointer' }}/>
					</Link>
				</header>

				<Switch>
					<Route path="/pose">
						<Pose />
					</Route>
					<Route path="/voice">
						<TongueSlip />
					</Route>
					<Route path="/">
						<Main />
					</Route>
				</Switch>
			</Wrapper>
		</Router>
  )
}

export default App;
