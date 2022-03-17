import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
	faMugSaucer,
	faBasketShopping,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VideoCard from "./VideoCard";
import { Rnd } from "react-rnd";
import styled from "styled-components";
import ShareVideo from "../ShareVideo/ShareVideo";

const BoardWrapper = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${(props) => props.theme.color4};
	padding: 8px 8px 25px 8px;
	margin-bottom: 5%;
	border-top-right-radius: 16px;
	border-top-left-radius: 16px;
	box-shadow: 0 0 5em -1em black;

	.title {
		display: block;
	}
`;

const DeleteVideoButton = styled.div`
	position: absolute;
	top: -12px;
	right: -12px;
	width: 36px;
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 16px;
	background-color: #dddddd;
	border-radius: 50%;
	z-index: 4;
	svg {
		fill: black;
	}
	&:hover {
		cursor: pointer;
	}
`;

const VideoCardBoard = (props) => {
	const { receiveShare, recvideoLoc, searching, name, pixelPath } = props;
	const [hover, setHover] = useState(false);
	const [loading, setLoading] = useState(true);
	const [open, setOpen] = useState(false);

	const [location, setLocation] = useState();
	const [videoName, setVideoName] = useState();
	console.log(pixelPath);

	const [data, setData] = useState({
		x:
			pixelPath === null
				? 356 + 100 * (Math.random() < 0.5 ? -1 : 1)
				: pixelPath.x,
		y:
			pixelPath === null
				? 357 + 70 * (Math.random() < 0.5 ? -1 : 1)
				: pixelPath.y,
		width: 420,
	});

	console.log("VideoCardBoard receiveShare: ", receiveShare);
	console.log("VideoCardBoard recvideoLoc: ", recvideoLoc);

	return (
		loading && (
			<Rnd
				style={{ zIndex: 9 }}
				default={data}
				enableResizing={{
					top: false,
					right: false,
					bottom: false,
					left: false,
					topRight: false,
					bottomRight: false,
					bottomLeft: false,
					topLeft: false,
				}}
			>
				<BoardWrapper
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<div className="title">
						<FontAwesomeIcon
							icon={name === "카페" ? faMugSaucer : faBasketShopping}
						/>{" "}
						{name}
					</div>
					{receiveShare
						? recvideoLoc.length > 0 &&
						  recvideoLoc.map((list, idx) => (
								<VideoCard
									key={idx}
									info={list}
									setOpen={setOpen}
									open={open}
									setLocation={setLocation}
									setVideoName={setVideoName}
								></VideoCard>
						  ))
						: searching &&
						  recvideoLoc.length > 0 &&
						  recvideoLoc.map((list, idx) => (
								<VideoCard
									key={idx}
									info={list}
									setOpen={setOpen}
									open={open}
									setLocation={setLocation}
									setVideoName={setVideoName}
								></VideoCard>
						  ))}
					{hover && (
						<DeleteVideoButton onClick={() => setLoading(false)}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="8"
								height="8"
								viewBox="0 0 24 24"
							>
								<path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
							</svg>
						</DeleteVideoButton>
					)}
				</BoardWrapper>
				{open && (
					<ShareVideo videoName={videoName} locInfo={location}></ShareVideo>
				)}
			</Rnd>
		)
	);
};

export default VideoCardBoard;
