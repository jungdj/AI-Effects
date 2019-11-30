import React from "react"
import styled, { css } from "styled-components"

import dj from '../static/dj.jpg';
import gogi from '../static/gogi.jpg';
import yuns from '../static/yuns.jpg';
import ssul from '../static/ssul.jpg';

const pics = { dj, gogi, yuns, ssul }

const Wrapper = styled.div`
	width: 100vw;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	${props => props.loading ? css`
		transition: 0.3s;
		opacity: 0;
	` : ``};
	.profile-button {
		display: block;
    margin: 2em 0 1em 0;
    font-size: 1.3vw;
    a {
			border: 1px solid #808080;
			color: #808080;
			text-transform: uppercase;
			padding: .5em 1.5em;
			letter-spacing: 2px;
			cursor: pointer;
			font-size: .9em;
    }
	}
	
	.list-profiles {
		max-width: 80%;
		background: #141414;
	}
	
	.profile-gate-label {
		width: 100%;
		color: #fff;
		font-size: 3.5vw;
		opacity: 1;
		transition: opacity 400ms ease-out;
		text-align: center;
	}
	
	.choose-profile {
		opacity: 1;
		transition: opacity 400ms ease-out;
		display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    margin: 2em 0;
    li {
    	display: inline-block;
    	vertical-align: top;
    	position: relative;
    }
	}
	
	.profile {
		width: 10vw;
		max-width: 200px;
		min-width: 84px;
		margin: 0 2vw 0 0;
	}
	
	.avatar-wrapper {
		cursor: pointer;
		color: #fff;
		font-size: 0.85vw;	
	}
	
	.profile-link {
		&:hover {
		.profile-name {
			color: #e5e5e5;
		}
		.profile-icon {
			border-color: #e5e5e5;
		}
	}
	.profile-icon {
		height: 10vw;
		width: 10vw;
		max-height: 200px;
		max-width: 200px;
		min-height: 84px;
		min-width: 84px;
		background-size: cover;
		background-color: #333;
		background-repeat: no-repeat;
		box-sizing: border-box;
		border: 0.3em solid rgba(0,0,0,0.4);
	}
	
	.profile-name {
		line-height: 1.2em;
		min-height: 2.4em;
		color: #808080;
		display: block;
    text-align: center;
    font-size: 1.3vw;
    margin: .8em 0;
    text-overflow: ellipsis;
    overflow: hidden;
	}

	//.addProfileIcon {
	//	font-size: 5vw;
    //color: #808080;
    //text-align: center;
    //text-decoration: none;
    //height: 10vw;
    //width: 10vw;
    //max-height: 200px;
    //max-width: 200px;
    //min-height: 84px;
    //min-width: 84px;
    //display: flex;
    //align-items: center;
    //justify-content: center;
    //.icon-tvuiAdd:before {
	//		content: '\\e716';
	//	}
	//}
	
	
`

const ProfileList = ({ selectProfile, loading}) => {
	return (
		<Wrapper loading={loading}>
			<div className="list-profiles">
				<div className="profile-gate-label">Choose Profile</div>
				<ul className="choose-profile">
					{
						[
							{ name: '윤아', key: 'ssul', },
							{ name: '병서', key: 'gogi', },
							{ name: '동진', key: 'dj', },
							{ name: '윤서', key: 'yuns', },
						].map(({ name, key }) => (
							<li className="profile">
								<div>
									<a className="profile-link" tabIndex="0" onClick={() => selectProfile(key)}>
										<div className="avatar-wrapper">
											<img className="profile-icon" src={pics[key]}/>
										</div>
										<span className="profile-name">{name}</span>
									</a>
								</div>
							</li>
						))
					}
					{/*<li>*/}
					{/*	<a role="link" tabIndex="0" href="https://github.com/jungdj">*/}
					{/*		<div className="addProfileIcon icon-tvuiAdd"></div>*/}
					{/*		<span className="profile-name">Add Profile</span>*/}
					{/*	</a>*/}
					{/*</li>*/}
				</ul>
			</div>
			<div className="profile-button preferred-action">
				<a target="_blank" href="https://github.com/jungdj/ml-video-trim-tool-ui">Wanna Be a Member?</a>
			</div>
		</Wrapper>
	)
}

export default ProfileList
