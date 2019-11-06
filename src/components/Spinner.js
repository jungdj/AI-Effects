import React from 'react';
import styled from 'styled-components';

const Spinner = styled.div`
	width:50px;
	height:50px;
	background:url(https://i.hizliresim.com/rJJNm3.png);
	background-size:100%;
	margin:auto;
	position:fixed;
	left:0;
	right:0;
	bottom:0;
	top:0;
	animation:animasyon 2s linear infinite;
	
	@keyframes animasyon{
		from{transform: rotate(0deg)}
		to{transform: rotate(360deg)}
	}
`

export default Spinner;
