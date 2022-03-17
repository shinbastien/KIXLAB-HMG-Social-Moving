/*global Tmapv2*/
// Do not delete above comment

import React, { useState, useEffect, useMemo } from "react";
import { Divider } from "@mui/material";
import styled from "styled-components";
import point2 from "../../Styles/source/point2.png";
// import youtubelogo from "../../Styles/source/youtube-square-brands.svg";
import storelogo from "../../Styles/source/location-pin-solid_store.svg";
import cuplogo from "../../Styles/source/location-pin-solid_cup.svg";

import {
	faAngleDown,
	faAngleUp,
	faCircleInfo,
	faLocationDot,
	faSync,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Draggable from "react-draggable"; // The default
import { firebaseInstance } from "../../lib/functions/firebase";
import { ref, getDatabase } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import { useCallback } from "react";

const MenuWrapper = styled.div`
	width: ${(props) => (props.keepOpen ? "400px" : "600px")};
	height: 90%;
	overflow-y: scroll;
	margin: 20px 40px;
	padding: 1% 2%;
	background-color: #f6f9fa;
	border-radius: 12px;
	-webkit-box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
	box-shadow: 6px 7px 7px 0px rgba(0, 0, 0, 0.47);
`;

const TitleWrapper = styled.div`
	display: flex;
	justify-content: space-evenly;
	.title {
		font-weight: 600;
		color: ${(props) => props.theme.color1};
		margin: 20px;
		// margin: auto;
	}

	.short {
		font-size: 0.8vw;
		font-weight: 300;
		color: ${(props) => props.theme.primaryColor};
		margin: auto;
	}

	.info {
		font-size: 1.7vw;
		margin: auto;
	}
	.badge {
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		color: white;
		text-align: center;
		min-width: 6px;
		padding: 0 6px;
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

	> button {
		border-radius: 50%;
		width: 30px;
		height: 30px;
		background-color: ${(props) => props.theme.color3};
		margin: auto;

		&: hover {
			background-color: ${(props) => props.theme.color2};
		}
	}
`;

const SubmenuWrapper = styled.div`
	font-weight: 300;
	width: auto;

	.info {
		font-size: 17px;
		margin: 20px;
		color: #707070;
	}
`;

const SubsubmenuWrapper = styled.div`
	> span {
		display: flex;
		justify-content: space-between;
		font-size: 1vw;
		font-weight: 700;
	}
	.badge {
		display: inline-block;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0;
		color: white;
		min-width: 6px;
		padding: 0 6px;
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
	> div {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		width: 100%;

		> button {
			display: inline-block;
			padding-left: 2%;
			&:hover {
				transition: all 0.5s;
				transform: scale(0.9);
			}

			> img {
				padding: 5%;
				width: 75px;
				height: 75px;
			}
		}
	}
`;

const VisitedWrapper = styled.div`
	width: 10px;
	height: 10px;
	border-radius: 50px;
	background-color: ${(props) =>
		props.visited === true ? "#e56b6f" : "#0081a7"};
`;

const firebaseApp = firebaseInstance();
const database = getDatabase(firebaseApp);

const KeepPlaceCard = (props) => {
	const { coords, date, id, title, videoInfo, visited } = props.info;
	const { map } = props;

	const onClickKeep = (coords, title) => {
		const { _lat, _long } = coords;
		const keepLocation = new Tmapv2.LatLng(_lat, _long);

		map.setCenter(keepLocation);
	};

	return (
		<button
			variant="outlined"
			style={{ cursor: "pointer" }}
			onClick={() => onClickKeep(coords, title)}
		>
			<img src={videoInfo.thumnails.url} width="100%" height="auto"></img>
			<VisitedWrapper visited={visited}></VisitedWrapper>
		</button>
	);
};

const MemoKeepPlaceCard = React.memo(KeepPlaceCard);

const InfoMenu = (props) => {
	const { map, totalDaytime, start, end } = props;
	const [keepOpen, setKeepOpen] = useState(false);
	const [snapshots, loading, error] = useList(ref(database, "keeps"));
	const [keepMarkerList, setKeepMarkerList] = useState([]);

	useEffect(() => {
		if (start || end) {
			setKeepOpen(true);
		}
	}, [start, end]);

	useEffect(() => {
		let active = true;
		mapping();
		return () => {
			active = false;
		};

		function mapping() {
			if (keepMarkerList) {
				keepMarkerList.map((point) => {
					point.setMap(null);
				});
				setKeepMarkerList([]);
			}
			snapshots.forEach((v) => {
				const { coords, date, id, placeName, videoInfo, visited } = v.val();

				if (visited) {
					const { _lat, _long } = coords;
					const keepLocation = new Tmapv2.LatLng(_lat, _long);

					const newMarker = new Tmapv2.Marker({
						position: keepLocation,
						icon: storelogo,
						iconSize: new Tmapv2.Size(50, 50),
						map: map,
						title: videoInfo.title,
						label:
							"<span style='border-radius: 12px; padding: 2px; font-size: 20px; background-color:#ff6f00; color:white'>" +
							placeName +
							"</span>",
					});
					newMarker.setMap(map);

					const createInfo = new Tmapv2.InfoWindow({
						position: keepLocation,
						content: `<img src=${videoInfo.thumnails.url} width="300px" height="auto"></img>`,
						type: 2,
						map: map,
						visible: false,
						zIndex: 3,
					});

					newMarker.addListener("mouseenter", function (evt) {
						createInfo.setVisible(true);
					});

					newMarker.addListener("mouseleave", function (evt) {
						createInfo.setVisible(false);
					});

					setKeepMarkerList((keepMarkerList) => [...keepMarkerList, newMarker]);
				} else {
					const { _lat, _long } = coords;
					const keepLocation = new Tmapv2.LatLng(_lat, _long);

					const newMarker = new Tmapv2.Marker({
						position: keepLocation,
						icon: cuplogo,
						iconSize: new Tmapv2.Size(50, 50),
						map: map,
						title: videoInfo.title,
						label:
							"<span style='border-radius: 12px; padding: 2px; font-size: 20px; background-color:#ff6f00; color:white'>" +
							placeName +
							"</span>",
					});
					newMarker.setMap(map);

					const createInfo = new Tmapv2.InfoWindow({
						position: keepLocation,
						content: `<img src=${videoInfo.thumnails.url} width="300px" height="auto"></img>`,
						type: 2,
						map: map,
						visible: false,
						zIndex: 3,
					});

					newMarker.addListener("mouseenter", function (evt) {
						createInfo.setVisible(true);
					});

					newMarker.addListener("mouseleave", function (evt) {
						createInfo.setVisible(false);
					});
					setKeepMarkerList((keepMarkerList) => [...keepMarkerList, newMarker]);
				}
			});
			if (!active) {
				return;
			}
		}
	}, [snapshots]);

	return (
		<Draggable>
			<MenuWrapper keepOpen={keepOpen}>
				<TitleWrapper>
					<div className="title">
						<FontAwesomeIcon icon={faCircleInfo} />
						&nbsp;Information
					</div>
					{keepOpen ? null : (
						<>
							<div className="title short">
								{start || end ? (
									<div>
										<div>{start && start.name}</div>
										<div>{end && end.name}</div>
									</div>
								) : (
									<div>
										<FontAwesomeIcon icon={faLocationDot} />
										&nbsp;목적지를 정해주세요
									</div>
								)}
							</div>
							<div className="title info">
								<span role="img" aria-label="Woman Running">
									🏃🏻‍♀️
								</span>{" "}
								<div className="badge">{snapshots && snapshots.length}</div>
							</div>
						</>
					)}
					<button
						style={{ cursor: "pointer" }}
						onClick={() => setKeepOpen(!keepOpen)}
					>
						<FontAwesomeIcon icon={keepOpen ? faAngleUp : faAngleDown} />
					</button>
				</TitleWrapper>
				<Divider></Divider>
				{keepOpen ? (
					<SubmenuWrapper>
						{start || end ? (
							<div className="info result">
								<li>출발: {start ? start.name : "출발지를 정해주세요"}</li>
								<li>도착: {end ? end.name : "도착지를 정해주세요"}</li>
							</div>
						) : (
							<div className="info destination">
								<FontAwesomeIcon icon={faLocationDot} />
								&nbsp;목적지를 정해주세요
							</div>
						)}
						<Divider></Divider>
						{totalDaytime.totalD ? (
							<div className="info destination">
								<li>
									총 거리:{" "}
									{totalDaytime.totalD < 1
										? totalDaytime.totalD * 1000 + "m"
										: totalDaytime.totalD + "km"}
								</li>
								<li>총 시간: {totalDaytime.totalTime} 분</li>
							</div>
						) : null}
						<Divider></Divider>
						<SubsubmenuWrapper>
							<span pt={3} pb={3}>
								<div className="info">
									<span role="img" aria-label="Woman Running">
										🏃🏻‍♀️
									</span>{" "}
									Keep&nbsp;{" "}
									<div className="badge">{snapshots && snapshots.length}</div>
								</div>
								{loading ? (
									<div className="fa-3x info">
										<FontAwesomeIcon className="fa-spin" icon={faSync} />
									</div>
								) : null}
							</span>
							<img
								src={storelogo}
								style={{ width: "30px", height: "30px" }}
							></img>{" "}
							쇼핑몰
							<div style={{ display: keepOpen ? "inline-block" : "none" }}>
								{snapshots !== undefined &&
									snapshots.map(
										(list) =>
											list.val().visited && (
												<MemoKeepPlaceCard
													key={list.key}
													map={map}
													info={list.val()}
												></MemoKeepPlaceCard>
											),
									)}
							</div>
							<img
								src={cuplogo}
								style={{ width: "30px", height: "30px" }}
							></img>{" "}
							카페
							<div style={{ display: keepOpen ? "inline-block" : "none" }}>
								{snapshots !== undefined &&
									snapshots.map(
										(list) =>
											list.val().visited === false && (
												<MemoKeepPlaceCard
													key={list.key}
													map={map}
													info={list.val()}
												></MemoKeepPlaceCard>
											),
									)}
							</div>
						</SubsubmenuWrapper>
					</SubmenuWrapper>
				) : null}
			</MenuWrapper>
		</Draggable>
	);
};

export default React.memo(InfoMenu);
