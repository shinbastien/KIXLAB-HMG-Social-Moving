import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NewMapwindow from "../Mapwindow/NewMapwindowTest";
import VideoCall from "../VideoCall/VideoCall";
import Grid from "@mui/material/Grid";
import { LocationContext } from "../lib/Context/LocationContext";
import { ReceiveContext } from "../lib/Context/ReceiveContext";

import Snackbar from "@mui/material/Snackbar";

import { useSocket } from "../lib/socket";
import styled from "styled-components";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export { Alert };

function Map() {
	const location = useLocation();
	const [onloading, setonLoading] = useState(false);
	// const [otherLocation, setOtherLocation] = useState(null);
	const [sendShare, setSendShare] = useState(false);
	const [receiveShare, setReceiveShare] = useState(false);
	const [receiveUser, setReceiveUser] = useState(null);

	const { groupID, userName } = location.state;
	// console.log("groupID obtained from Home is: ", groupID);
	// console.log("userName obtained from Home is: ", userName);

	const { socket, connected } = useSocket();
	console.log("connected is: ", connected);
	const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

	useEffect(() => {
		if (socket && connected) {
			console.log("socket id is:", socket.id);

			socket.emit("join", groupID, userName, randomColor);
			console.log("joining group");
		}
	}, [connected, socket]);

	return (
		<>
			<ReceiveContext.Provider
				value={{
					receiveShare,
					setReceiveShare,
					setReceiveUser,
					receiveUser,
					sendShare,
					setSendShare,
				}}
			>
				<Grid container spacing={2}>
					<Grid item xs={6} md={9}>
						<NewMapwindow userName={userName} color={randomColor} />
					</Grid>
					<Grid item xs={6} md={3}>
						<VideoCall
							roomName={groupID}
							userName={userName}
							userColor={randomColor ? randomColor : '#bc2020'}
							loading={onloading}
						></VideoCall>
					</Grid>
				</Grid>
				{sendShare && (
					<Snackbar
						anchorOrigin={{ vertical: "top", horizontal: "center" }}
						open={sendShare}
					>
						<Alert severity="success" sx={{ width: "100%" }}>
							지금 화면을 공유하고 있습니다.
						</Alert>
					</Snackbar>
				)}
				{receiveShare && (
					<Snackbar
						anchorOrigin={{ vertical: "top", horizontal: "center" }}
						open={receiveShare}
					>
						<Alert severity="info" sx={{ width: "100%" }}>
							{receiveUser} 님이 화면을 공유하고 있습니다.
						</Alert>
					</Snackbar>
				)}
			</ReceiveContext.Provider>
		</>
	);
}

export default Map;
