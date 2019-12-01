import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import {
	Switch,
	Route,
	Link,
	useLocation,
	Redirect
} from "react-router-dom";
import "animate.css"
import "video-react/dist/video-react.css"; // import css

import Main from "./components/Main"
import TongueSlip from "./components/TongueSlip"
import Pose from "./components/Pose"
import FaceBlur from "./components/FaceBlur"
import ProfileCheck from "./components/ProfileCheck"

import logo from "./static/logo.png";
import Dashboard from "./components/Dashboard"

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
	const location = useLocation ();
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
		<Wrapper>
			{
				location.pathname != '/dashboard' &&
				<header className={shrinked ? 'shrink' : ''}>
					<Link to={"/"}>
						<img src={logo} style={{ cursor: 'pointer' }}/>
					</Link>
				</header>
			}

			<ProfileCheck />

			<Switch>
				{/*<Route path="/pose">*/}
				{/*	<Pose />*/}
				{/*</Route>*/}
				{/*<Route path="/voice">*/}
				{/*	<TongueSlip />*/}
				{/*</Route>*/}
				<Route path="/main">
					<Redirect to={'/dashboard'}/>
				</Route>
				<Route path="/dashboard">
					<Dashboard />
				</Route>
				<Route path="/">
					<Main />
				</Route>
			</Switch>
		</Wrapper>
  )
}

export default App;
