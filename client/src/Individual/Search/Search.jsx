//search YouTube video
import React, { useState, useRef, useMemo, useEffect } from "react";
import useInput from "../../lib/functions/useInput";
import SearchResult from "./SearchResult";
import axios from "axios";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSpinner,
	faMagnifyingGlassLocation,
	faGlobe,
	faImage,
	faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import ShareVideo from "../../Mapwindow/ShareVideo/ShareVideo";

import { Divider } from "@mui/material";
import { SearchImgResult } from "./SearchResult";
import { useSocket } from "../../lib/socket";
import { n_videoList, currentLocList, endLocList } from "../../_data";

const InputWrapper = styled.div`
	margin: 0 0 0 0;
	width: 100%;
	border-radius: 12px;
	padding: 0 13px;
	background-color: ${(props) => props.theme.color3};
	height: 3vw;
	display: flex;
	flex-direction: row;
	margin: 0 5% 0 0;

	> input {
		border: none;
		width: inherit;
		background-color: ${(props) => props.theme.color3};
	}
	> button {
		padding: 0;
		margin: 0;
	}
`;

const KeyWordWrapper = styled.div`
	padding: 3%;
	.title {
		font-size: 18px;
		font-weight: 700;

		padding: 3%;
		color: ${(props) => props.theme.color1};
	}
	.subtitle {
		display: inline-block;
		font-size: 15px;
		font-weight: 700;
		letter-spacing: 0;
		color: white;
		min-width: 6px;
		padding: 1px 8px;
		border-radius: 18px;
		background: #2b5876; /* fallback for old browsers */
		background: -webkit-linear-gradient(
			to right,
			#2b5876,
			#4e4376
		); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to right,
			#2b5876,
			#4e4376
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}

	.searchKeyword {
		display: block;
		padding: 7% 3% 0 1%;
		&: hover {
			color: ${(props) => props.theme.color1};
			font-weight: 700;
		}

		&::before {
			background-color: ${(props) => props.theme.color1};
			display: inline-block;
			width: 4px;
			height: 4px;
			content: "";
			margin: 0 10px;
		}
	}

	.spinner {
		text-align: center;
	}
`;

const ResultWrapper = styled.div`
	padding: 0 5% 5% 5%;
	border-left: solid rgba(0, 0, 0, 0.12);
	border-width: 0 1px;

	margin-block-start: 0.5em;
	margin-block-end: 0.5em;

	.title {
		font-size: 28px;
		font-weight: 700;

		padding: 0 0 3%;
		color: #151ca2;
	}

	> div {
		.subtitle {
			font-size: 18px;
			font-weight: 700;

			padding-bottom: 2%;
			color: ${(props) => props.theme.color1};
		}
	}
`;

const Search = (props) => {
	const termInput = useInput("");
	const [submit, setSubmit] = useState(false);
	const [videos, setVideos] = useState({
		locInfo: null,
		videoInfo: null,
	});
	const [keyword, setKeyword] = useState();
	const inputRef = useRef();
	const [sharing, setSharing] = useState(false);
	const [share, setShare] = useState({});
	const [imgs, setImgs] = useState([
		{ url: "/1_img.jpeg" },
		{ url: "/2_img.jpeg" },
		{ url: "/3_img.jpg" },
	]);
	const { socket, connected } = useSocket();

	const filterWords = (data) => {
		const m = currentLocList;
		// const m = data.filter((prop) => prop.name.includes("주차장") === false);
		return m;
	};

	const filterWords_ = (data) => {
		const m = endLocList;
		// const m = data.filter((prop) => prop.name.includes("주차장") === false);
		return m;
	};

	const currentResult = useMemo(() => filterWords(props.value), [props.value]);

	const endResult = useMemo(
		() => props.end && filterWords_(props.end),
		[props.end],
	);

	console.log(endResult);

	const onClickFocus = (event) => {
		event.preventDefault();

		inputRef.current.value = event.target.innerText;
		setKeyword(event.target.innerText);
		inputRef.current.focus();
		setSubmit(false);
		// setSubmit(true);

		if (props.share === "host") {
			if (socket && connected) {
				socket.emit("send keyword individual search", event.target.innerText);
			}
		}
	};

	useEffect(() => {
		if (socket && connected) {
			socket.on("receive keyword individual search", async (keyword) => {
				setKeyword(keyword);
				setSubmit(false);
			});
		}
		return () => {
			socket.off("receive keyword individual search");
		};
	}, [socket, connected]);

	useEffect(() => {
		if (socket && connected) {
			if (props.share === "host") {
				if (videos && Object.keys(videos).length > 0) {
					socket.emit("send searched videos", videos, keyword);
				}

				if (share) {
				}
				console.log("host");
			} else if (props.share === "receiver") {
				socket.on("receive searched videos", async (videos, keyword) => {
					setVideos(videos);
					setKeyword(keyword);
					if (keyword) {
						searchOnYoutube();
					}
				});
			}
		}
		console.log("share", props.share);
		console.log("videos", videos);
	}, [props.share, videos, socket, connected]);

	useEffect(() => {
		if (socket && connected) {
			if (props.share === "host") {
				if (share) {
					socket.emit("start sharevideo", sharing, share);
					console.log("share is :", share);
				}
			} else if (props.share === "receiver") {
				console.log("sharevideo receiver");
				socket.on("receive sharevideo", async (sharing, item) => {
					console.log("received item");
					setSharing(sharing);
					console.log("receiving sharevideo item is:", item);
					setShare(item);
				});
			}
		}

		return () => {
			socket.off("receive sharevideo");
		};
	}, [props.share, share, sharing, socket, connected]);

	async function searchOnYoutube() {
		const API_URL = "https://www.googleapis.com/youtube/v3/search";
		// console.log(inputRef.current.value, keyword);
		try {
			const {
				data: { items },
			} = await axios(API_URL, {
				method: "GET",
				params: {
					key: process.env.REACT_APP_YOUTUBE_API_KEY,
					part: "snippet",
					q:
						`가볼만한 곳 ` + inputRef.current.value
							? inputRef.current.value
							: keyword,
					videoEmbeddable: "true",
					type: "video",
				},
			});

			setVideos(n_videoList);

			//! comment out for dummy data
			// setVideos({
			// 	locInfo: inputRef.current.value
			// 		? await loadlocInfo(inputRef.current.value)
			// 		: currentResult.filter((i) => i.name.includes(keyword)),
			// 	videoInfo: items,
			// });

			setSubmit(true);
			console.log("videos after searchOnYoutube :", videos);
		} catch (err) {
			setVideos(n_videoList);
			setSubmit(true);
			console.log("videos after searchOnYoutube :", videos);

			console.log(err);
		}
	}

	const loadlocInfo = async (keyword) => {
		try {
			const { data: items } = await axios({
				method: "get",
				url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result",
				params: {
					appKey: process.env.REACT_APP_TMAP_API_KEY,
					searchKeyword: keyword,
					reqCoordType: "WGS84GEO",
					resCoordType: "WGS84GEO",
					count: 1,
				},
			});

			return items;
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Stack direction="row">
				<InputWrapper>
					<input
						autoFocus
						ref={inputRef}
						placeholder="검색"
						onKeyDown={(evt) => {
							if (evt.code === "Enter") {
								searchOnYoutube();
							}
						}}
						onChange={(e) => {
							e.preventDefault();
							setKeyword(e.target.value);
						}}
					/>
					<button variant="contained" onClick={searchOnYoutube}>
						<FontAwesomeIcon icon={faMagnifyingGlass} />
					</button>
				</InputWrapper>
			</Stack>
			<Grid container>
				<Grid item>
					<KeyWordWrapper>
						<div className="title">
							<FontAwesomeIcon icon={faMagnifyingGlassLocation} />
							&nbsp; 추천 키워드
						</div>
						<Divider></Divider>
						<div className="subtitle">
							{/* <FontAwesomeIcon icon={faMagnifyingGlassLocation} /> */}
							목적지
						</div>
						{endResult && endResult.length > 0
							? endResult.map((prop, inx) => (
									<button className="searchKeyword" onClick={onClickFocus}>
										{prop.name}
									</button>
							  ))
							: "목적지를 정해주세요"}
						<div className="subtitle">
							{/* <FontAwesomeIcon icon={faMagnifyingGlassLocation} /> */}
							현재 위치
						</div>
						{currentResult && currentResult.length > 0 ? (
							currentResult.map((prop, inx) => (
								<button className="searchKeyword" onClick={onClickFocus}>
									{prop.name}
								</button>
							))
						) : (
							<div className="fa-2x spinner">
								<FontAwesomeIcon className="fa-pulse" icon={faSpinner} />
							</div>
						)}
					</KeyWordWrapper>
				</Grid>

				<Grid item xs={6} md={8} alignItems={"baseline"}>
					<ResultWrapper>
						<div className="title">
							<FontAwesomeIcon icon={faGlobe} />
							{submit ? ` 검색 결과: ` + keyword : null}
						</div>
						{sharing && (
							<ShareVideo
								videoName={Object.keys(share)[0]}
								locInfo={videos.locInfo.searchPoiInfo}
							></ShareVideo>
						)}
						{submit && videos.videoInfo.length > 0 ? (
							<div>
								<div className="subtitle">
									<FontAwesomeIcon icon={faYoutube} />
									&nbsp; Video
								</div>
								<SearchResult
									share={share}
									sharing={sharing}
									setShare={setShare}
									setSharing={setSharing}
									videos={videos.videoInfo}
								></SearchResult>
							</div>
						) : (
							<div>결과 없음</div>
						)}
						<Divider></Divider>
						{submit && imgs.length && (
							<div>
								<div className="subtitle">
									<FontAwesomeIcon icon={faImage} /> &nbsp; Image
								</div>
								<SearchImgResult imgs={imgs}></SearchImgResult>
							</div>
						)}
					</ResultWrapper>
				</Grid>
			</Grid>
		</>
	);
};

export default Search;
