/*global YT*/
// Do not delete above comment

import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../lib/socket";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPause,
	faPlay,
	faVolumeHigh,
} from "@fortawesome/free-solid-svg-icons";

import styled from "styled-components";
import { useMemo } from "react";
import axios from "axios";
import Bookmark from "./Bookmark";

const Container = styled.div`
	display: flex;
	width: 100%;
	padding: 3% 0 3% 0;

	flex-direction: column;
`;

// const BarWrapper = styled.div`
// 	display: flex;

// 	> div {
// 		flex-grow: 10;
// 	}
// 	> button {
// 		padding-right: 2%;
// 		font-size: 3vw;
// 	}
// `;

const VideoWrapper = styled.div`
	aspect-ratio: 16 / 9;
	width: 100%;
	pointer-events: none;
`;

const VideoBarWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 2% 0 2% 0;

	&:hover {
		background-color: #f5f5f5;
	}

	> button {
		font-size: 1vw;
		cursor: pointer;
		padding: 3%;
	}
`;

const ProgressBar = styled.span`
	position: relative;
	flex-grow: 10;
	height: 4px;
	background-color: rgb(138, 138, 138);
	cursor: pointer;

	#progress {
		position: absolute;
		width: ${(props) => (props.progress ? props.progress + "%" : "1%")}
		height: 100%;
		z-index: 999;
		background-color: yellow;
		
	}
`;

function YTDurationToSeconds(duration) {
	var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

	match = match.slice(1).map(function (x) {
		if (x != null) {
			return x.replace(/\D/, "");
		}
	});

	var hours = parseInt(match[0]) || 0;
	var minutes = parseInt(match[1]) || 0;
	var seconds = parseInt(match[2]) || 0;

	return hours * 3600 + minutes * 60 + seconds;
}

function ShareVideo({ userName, videoName, locInfo }) {
	const { socket, connected } = useSocket();
	const youtubePlayer = useRef();
	const userVideo = useRef();

	const [videoID, setVideoID] = useState(videoName);
	const [peers, setPeers] = useState([]);
	const location = useLocation();
	const [playing, setPlaying] = useState(false);
	const [nextPlaying, setNextPlaying] = useState(false);
	const [videoContent, setVideoContent] = useState(null);
	const [progress, setProgress] = useState(1);
	const [currentT, setCurrentT] = useState(0);
	const [width, setWidth] = useState(1);
	const [start, setStart] = useState(false);
	const [save, setSave] = useState(false);

	console.log(locInfo);

	console.log("videoName is: ", videoID);

	useMemo(() => {
		setVideoID(videoName);
	}, [videoName]);

	useEffect(() => {
		if (!window.YT) {
			const tag = document.createElement("script");
			tag.src = "https://www.youtube.com/iframe_api";
			var firstScriptTag = document.getElementsByTagName("script")[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			window.onYouTubeIframeAPIReady = loadVideoPlayer;
			// console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
		} else {
			loadVideoPlayer();
			// console.log("prepare youtube player", window.onYoutubeIframeAPIReady);
		}
	}, []);

	useEffect(() => {
		if (nextPlaying) {
			handleVideo("pause");
			youtubePlayer.current.cueVideoByUrl(
				`http://www.youtube.com/v/${videoID}?version=3`,
			);
		}

		async function loadVideoOnYouTube(videoID) {
			const API_URL = "https://www.googleapis.com/youtube/v3/videos";
			try {
				const {
					data: { items },
				} = await axios(API_URL, {
					method: "GET",
					params: {
						key: process.env.REACT_APP_YOUTUBE_API_KEY,
						part: "contentDetails, snippet",
						id: videoID,
					},
				});
				return items;
			} catch (err) {
				console.log(err);
			}
		}

		loadVideoOnYouTube(videoID).then((obj) => {
			const { duration } = obj[0].contentDetails;
			const { thumbnails, title } = obj[0].snippet;
			const { id } = obj[0];

			console.log(obj);

			const changeToDate = YTDurationToSeconds(duration);

			setVideoContent({
				id: id,
				duration: changeToDate,
				thumbnails: thumbnails.medium,
				title: title,
				placeID: locInfo.pois.poi[0].id,
				placeName: locInfo.pois.poi[0].name,
				coords: {
					_lat: locInfo.pois.poi[0].noorLat,
					_long: locInfo.pois.poi[0].noorLon,
				},
			});
		});
	}, [videoID]);

	useEffect(() => {
		const handleVideoSocket = (data) => {
			if (data === "play") {
				console.log("play video");
				youtubePlayer.current.playVideo();
				setPlaying(true);
			} else if (data === "pause") {
				console.log("pause video");
				youtubePlayer.current.pauseVideo();
				setCurrentT(youtubePlayer.current.playerInfo.currentTime());
				setPlaying(false);
			} else {
				console.log("load video: ", data);
				youtubePlayer.current.loadVideoById(data.split("=")[1]);
			}
		};

		if (socket && connected) {
			socket.on("ShareVideoAction", handleVideoSocket);
		}
		return () => {
			if (socket && connected) {
				socket.off("ShareVideoAction", handleVideoSocket);
			}
		};
	}, [socket, connected]);

	// useEffect(() => {
	// 	if (start) {
	// 		var totalTime = videoContent.duration;
	// 		var rate = 100 / totalTime;
	// 		console.log(totalTime);
	// 		setInterval(() => {
	// 			setProgress(progress + 1);
	// 			setWidth(rate * progress);
	// 		}, 1000);

	// 		if (progress * rate >= 100) {
	// 			clearInterval();
	// 			setStart(false);
	// 		}
	// 	}
	// 	return () => {
	// 		clearInterval();
	// 		setStart(false);
	// 	};
	// }, [start]);

	function loadVideoPlayer() {
		const player = new YT.Player("player", {
			height: "100%",
			width: "100%",
			videoId: videoID,
			playerVars: {
				playsinline: 1,
				autoplay: 0,
				controls: 0,
				autohide: 1,

				wmode: "opaque",
				origin: "https://www.youtube.com",
			},
		});
		setNextPlaying(true);
		youtubePlayer.current = player;
	}

	function handleVideo(data) {
		if (data === "play") {
			console.log("play video");
			socket.emit("play", userName);
			youtubePlayer.current.playVideo();
			setStart(!start);
			setPlaying(true);
		} else if (data === "pause") {
			console.log("pause video");
			socket.emit("pause", userName);
			youtubePlayer.current.pauseVideo();
			setStart(!start);
			setPlaying(false);
		} else {
			console.log("load video: ", data);
			socket.emit("load", (userName, videoID));
			youtubePlayer.current.loadVideoById(data.split("=")[1]);
			setPlaying(false);
		}
	}

	useMemo(() => videoContent, [videoID]);

	return (
		<>
			<Container>
				<VideoWrapper>
					<div id="player" ref={youtubePlayer} />
				</VideoWrapper>
				<VideoBarWrapper>
					{playing ? (
						<button
							style={{ cursor: "pointer" }}
							onClick={() => handleVideo("pause")}
						>
							<FontAwesomeIcon icon={faPause} />
						</button>
					) : (
						<button
							style={{ cursor: "pointer" }}
							onClick={() => handleVideo("play")}
						>
							<FontAwesomeIcon icon={faPlay} />
						</button>
					)}
					<ProgressBar>
						<div progress={width} id="progress" max="100" value="0"></div>
					</ProgressBar>
					<button>
						<FontAwesomeIcon icon={faVolumeHigh} />
					</button>
					<Bookmark data={videoContent}></Bookmark>
				</VideoBarWrapper>
			</Container>
		</>
	);
}
export default React.memo(ShareVideo);
