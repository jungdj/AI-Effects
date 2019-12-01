import styled, { css } from "styled-components"

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

export const Table = styled.table`
	position: relative;
	width: 100%;
	height: 100%;
`

Table.Head = styled.thead`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	//height: 24px;	
	background-color: rgb(45,45,45);
	color: rgb(138,138,138);
	padding: 4px 0;
	tr { font-size: 12px; }
	td { 
		border-right: 1px solid rgb(9,9,9);
		padding: 0 4px;
		color: rgb(138,138,138);
		fill: rgb(138,138,138);
	}
`

Table.Body = styled.tbody`
	position: relative;
	display: block;
	width: 100%;
	height: calc(100% - 24px);
	overflow: scroll;
	margin-top: 24px;
	background-color: rgb(34,34,34);
	border-top: 1px solid rgb(28,28,28);

	tr { 
		font-size: 11px; 
		flex: 0 0 20px;
		border-bottom: 1px solid rgb(28,28,28);
		&:hover {
			background-color: rgb(37, 37, 37);
			border: 1px solid rgb(43, 43, 43);
		}
	}
`

export const TR = styled.tr`
	display: flex;
	width: 100%;
	overflow: scroll;
	white-space: nowrap;
	justify-content: flex-start;
`

export const TD = styled.td`
	padding: 2px 4px;
`

export const Center = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	justify-content: center;
	align-items: center;
`
