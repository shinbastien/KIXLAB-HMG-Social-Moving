import React, { useState, useEffect } from "react";
import Search from "./Search/Search";

import { useLocation } from "react-router-dom";
import { useSocket } from "../lib/socket";

import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { getPositionFromData } from "../Mapwindow/NewMapwindowTest";

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const BarWrapper = styled.div`
	display: flex;

	> div {
		flex-grow: 10;
	}
	> button {
		color: ${(props) => props.theme.color4};
		padding-right: 2%;
		font-size: 2vw;
	}
`;

const BoardWrapper = styled.div`
	padding: 2%;
	.title {
		font-size: 20px;
		color: ${(props) => props.theme.color1};
		padding: 2% 0 2% 0;
	}
`;

export default function Individual({
	individual,
	stateChanger,
	host,
	receiver,
	markerC,
	end,
}) {
	const location = useLocation();
	const [recvideo, setrecvideo] = useState([]);
	const [endrecvideo, setendrecvideo] = useState([]);

	const [share, setShare] = useState("");
	const { groupID, userName } = location.state;
	const [value, setValue] = React.useState(0);
	const { socket, connected } = useSocket();
	const changeToLatLng = markerC.getPosition();
	const endPosition = end && getPositionFromData(end);

	useEffect(async () => {
		//현재 위치
		// navigator.geolocation.getCurrentPosition(function (position) {
		// 	const lat = position.coords.latitude;
		// 	const lng = position.coords.longitude;
		// 	loadpointInfo(lat, lng);
		// });

		//현재 마커 위치
		const lat = changeToLatLng._lat;
		const lng = changeToLatLng._lng;
		const lat_endPosition = end && endPosition._lat;
		const lng_endPosition = end && endPosition._lng;

		loadpointInfo(lat, lng).then((data) => {
			setrecvideo(data);
		});
		loadpointInfo(lat_endPosition, lng_endPosition).then((data) => {
			setendrecvideo(data);
		});

		return () => {
			stateChanger(false);
		};
	}, [individual]);

	useEffect(() => {
		if (host) {
			setShare("host");
		} else {
			if (receiver) {
				setShare("receiver");
			} else {
				setShare("");
			}
		}
		console.log(host, receiver);
	}, [share, host, receiver]);

	useEffect(() => {
		if (socket && connected) {
			if (share == "host") {
				if (recvideo.length > 0) {
					socket.emit("share individual searchlist", recvideo, endrecvideo);
				}
			} else if (share == "receiver") {
				socket.on("receive individual searchlist", (recvideo, endrecvideo) => {
					setrecvideo(recvideo);
					setendrecvideo(endrecvideo);
				});
			}
		}
		return () => {
			if (socket && connected) {
				socket.off("receive individual searchlist");
			}
		};
	}, [socket, connected]);

	const loadpointInfo = async (lat, lng) => {
		try {
			const { data: items } = await axios({
				method: "get",
				url: "https://apis.openapi.sk.com/tmap/pois/search/around?version=1&format=json&callback=result",
				params: {
					categories: "카페;",
					appKey: process.env.REACT_APP_TMAP_API_KEY,
					reqLevel: 15,
					radius: 3,
					centerLon: lng,
					centerLat: lat,
					reqCoordType: "WGS84GEO",
					resCoordType: "WGS84GEO",
					count: 10,
				},
			});

			console.log(items);

			return items.searchPoiInfo.pois.poi;
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Wrapper>
			<BarWrapper>
				<div></div>
				<button
					style={{ cursor: "pointer" }}
					onClick={() => stateChanger(false)}
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</BarWrapper>
			<BoardWrapper>
				<div className="title">
					<strong>Search</strong>
				</div>
				<Search value={recvideo} end={endrecvideo} share={share}></Search>
			</BoardWrapper>
		</Wrapper>
	);
}
