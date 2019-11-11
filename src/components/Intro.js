import React, { useEffect } from "react";
import styled from "styled-components";

const makeLongShadow = (length, angle) => {
	let string = '';
	for (let i = 1; i <= length; i++) {
		string += `0px 0px transparent, ${i}px ${i * angle}px #aaa`;
		if (i !== length) string += ', ';
	}
	return string;
}

const Wrapper = styled.div`
	@function makelongshadow($length,$angle) {
		$val: 0px 0px transparent;
		@for $i from 1 through $length {
			$val: #{$val}, #{$i}px #{$i*$angle}px #aaa;
		}
		@return $val;
	}

	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	width: 100vw;
	height: 100vh;
	background: radial-gradient(#fff, #aaa);
	background-size: 100vw 100vh; 
	min-height: 100vh;
	overflow: hidden;
	padding-top: 40vh;
	animation: hide 4s;
	animation-fill-mode: forwards;  
	
	@keyframes hide {
		70% {
			opacity: 1;
		}
		
		99% {
			opacity: 0;
			z-index: 1000;
			min-height: 100vh;
			max-height: 100vh;
			padding-top: 40vh;
		}
		100% {
			min-height: 0;
			max-height: 0;
			padding: 0;
			opacity: 0;
			z-index: -1;
			display: none;
		}
	}
	
	.txt {
		text-align: center;
		font-family: 'BebasNeue';
		font-size: 12vmin;
		font-weight: 700;
		font-stretch: 200%;
		letter-spacing: 14px;
		animation: netflix_style 3.5s;
		animation-fill-mode: forwards;  
		outline: none;
		white-space: nowrap;
	}
	
	@keyframes netflix_style {
		0% {
			color:#e90418;
			text-shadow: none;
		}
		
		5% {
			text-shadow: ${makeLongShadow(60, 1)};
			color:#f3f3f3;
			transform: scale(1.5, 1.5);
		}
		10% {
			text-shadow: ${makeLongShadow(60, 1.5)};
			color:#f3f3f3;
			transform: scale(1.5, 1.5);
		}
		15% {
			 color:#f3f3f3;
		}
		20% {    
			color:#e90418;
			text-shadow: none;
			transform: scale(1.1, 1.1);
		}
		75% {
			opacity: 1;
		}
		80% {
			opacity: 0;    
			color:#e90418;
			transform: scale(0.85, 0.9);
		}
		
		100% {
			opacity: 0;
		}
	}
`

const Intro = () => {
	return (
		<Wrapper>
			<div className="txt" contentEditable="true">Project 7</div>
		</Wrapper>
	)
}

export default Intro;
