import React from "react"
import styled, { css } from "styled-components"

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
		&:first-child {
			.profile-icon {
				background-image: url("https://www.edgee.co.uk/demo/posenet/demo.jpg");
			}
		}
		&:nth-child(2) {
			.profile-icon {
				background-image: url("https://is2-ssl.mzstatic.com/image/thumb/Purple113/v4/b0/52/52/b05252a6-4a35-51bb-9ba8-50d4452a0f05/AppIcon-0-1x_U007emarketing-0-0-GLES2_U002c0-512MB-sRGB-0-0-0-85-220-0-0-0-7.png/246x0w.jpg");
			}
		}
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

const ServiceList = ({ setType, loading}) => {
	return (
		<Wrapper loading={loading}>
			<div className="list-profiles">
				<div className="profile-gate-label">Choose Menu</div>
				<ul className="choose-profile">
					<li className="profile">
						<div>
							<a className="profile-link" tabIndex="0" onClick={() => setType('pose')}>
								<div className="avatar-wrapper">
									<div className="profile-icon"/>
								</div>
								<span className="profile-name">Pose</span>
							</a>
						</div>
					</li>
					<li className="profile">
						<div>
							<a className="profile-link" tabIndex="0" href="#" onClick={() => setType('voice')}>
								<div className="avatar-wrapper">
									<div className="profile-icon"/>
								</div>
								<span className="profile-name">Voice</span>
							</a>
						</div>
					</li>
					<li className="profile">
						<div>
							<a className="profile-link" tabIndex="0" href="#" onClick={() => setType('face')}>
								<div className="avatar-wrapper">
									<div className="profile-icon"/>
								</div>
								<span className="profile-name">Face Blur</span>
							</a>
						</div>
					</li>
					{/*<li>*/}
					{/*	<a role="link" tabIndex="0" href="https://github.com/jungdj">*/}
					{/*		<div className="addProfileIcon icon-tvuiAdd"></div>*/}
					{/*		<span className="profile-name">Add Profile</span>*/}
					{/*	</a>*/}
					{/*</li>*/}
				</ul>
			</div>
			<div className="profile-button preferred-action">
				<a target="_blank" href="https://github.com/jungdj/ml-video-trim-tool-ui">Wanna Contribute?</a>
			</div>
		</Wrapper>
	)
}

export default ServiceList
