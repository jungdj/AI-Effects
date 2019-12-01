import { css } from "styled-components"

export const SectionWithTitle = css`
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	
	.__section-title {
		width: 100%;
		height: 24px;
		font-size: 12px;
		border-bottom: 1px solid rgb(34,34,34);
		padding: 4px 4px;
		background-color: rgb(45,45,45);
		color: rgb(138,138,138);
	}
	
	.__section-body {
		width: 100%;
		flex: 1;
	}
`
