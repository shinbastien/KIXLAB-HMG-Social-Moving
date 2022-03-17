import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { e_videoList } from "../../_data";

const VideoWrapper = styled.div`
	aspect-ratio: 16 / 9;
	width: 100%;

	> div {
		display: flex;
		justify-content: flex-end;

		> button {
			display: flex;
			font-size: 25px;
			&:active {
				color: #151ca2;
			}
			&.active {
				color: #151ca2;
			}
		}
	}
`;

export const SearchImgResult = ({ imgs }) => {
	return (
		<>
			<Grid container spacing={2}>
				{imgs.map((img, idx) => (
					<Grid item xs={6}>
						<VideoWrapper>
							<img
								key={idx}
								src={process.env.PUBLIC_URL + img.url}
								width="100%"
							></img>
							<div>
								<button>공유하기</button>
							</div>
						</VideoWrapper>
					</Grid>
				))}
			</Grid>
		</>
	);
};

const SearchResult = ({ share, sharing, setShare, setSharing, videos }) => {
	function onClickShare(element) {
		const { etag, id, snippet } = element;
		setShare((share) => ({ [id.videoId]: true }));

		setSharing(!sharing);
	}

	console.log(videos);

	return (
		<>
			<Grid container spacing={2}>
				{videos.map((video) => (
					<Grid item xs={6} key={video.id.videoId}>
						<VideoWrapper>
							<iframe
								title="youtubeTrailer"
								width="100%"
								height="100%"
								src={`https://www.youtube.com/embed/${video.id.videoId}`}
								frameBorder="1"
							/>
							<div>
								<button
									className={
										share &&
										Object.keys(share)[0] === video.id.videoId &&
										"active"
									}
									style={{ cursor: "pointer" }}
									onClick={() => onClickShare(video)}
								>
									{sharing && Object.keys(share)[0] === video.id.videoId
										? "공유 중지"
										: "공유하기"}
								</button>
							</div>
						</VideoWrapper>
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default React.memo(SearchResult);
