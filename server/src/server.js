const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		credentials: true,
		methods: ["GET", "POST"],
	},
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const REMOVE_CHAT = "removeChat";

const users = {};
const userInfo = {};

// Socket.io connection for Chatting
io.on("connection", (socket) => {
	// Join a conversation
	// console.log(socket.handshake.query);
	// const {GroupID, userName} = socket.handshake.query;
	// console.log("1", GroupID);
	// console.log("2", userName);
	// socket.join(GroupID);

	socket.on("join", (roomName, userName, color) => {
		socket.join(roomName);
		if (!users[roomName]) {
			users[roomName] = { participants: {}, youtubeLink: "", sharingHost: "" };
		}
		

		socket.roomName = roomName;
		socket.userName = userName;
		socket.color = color;
		socket.share = false;
		users[roomName].participants[userName] = {
			socket: socket.id,
			location: [0, 0],
			color: socket.color,
		};
		console.log(
			"current users after join: ",
			Object.keys(users[roomName].participants),
		);
		console.log(users[roomName].participants);
		io.to(roomName).emit("joinResponse", users[roomName].participants, userName);
		console.log("server sends joinResponse");
	});

	// --------------------PEERCONNECTION-------------------
	// when a peer is created from newbie, the created peer sends a signal by socket and socket sends the signal to existing peers
	socket.on("RTC_offer", (signal, caller, receiver, roomName) => {
		try {
			io.to(roomName).emit("RTC_answer", caller, receiver, signal);
			console.log("signal sended from newbie: ", caller);
			console.log("to: ", receiver);
		} catch (error) {
			console.log(error);
		}
	});

	//  ---------------------------SHAREVIDEO----------------------
	socket.on("start sharevideo", (sharing, item) => {
		console.log("starting sharevideo for room");
		console.log(sharing);
		console.log(item);
		socket.broadcast
			.to(socket.roomName)
			.emit("receive sharevideo", sharing, item);
	});

	socket.on("play", (userName) => {
		console.log("play video act by: ", userName);
		socket.broadcast.to(socket.roomName).emit("ShareVideoAction", "play");
	});

	socket.on("pause", (userName) => {
		console.log("pause video of groupID: ", userName);
		socket.broadcast.to(socket.roomName).emit("ShareVideoAction", "pause");
	});

	socket.on("load", (userName, videoID) => {
		console.log("load video of: ", userName);
		console.log("video Link is : ", videoID);
		socket.broadcast.to(socket.roomName).emit("ShareVideoAction", videoID);
	});

	// ------------------------MAP----------------------

	// socket connection for MapWindow
	socket.on("set StartLocation", (lat, lng) => {
		console.log("latitude is: ", lat);
		console.log("longitude is: ", lng);
		// console.log(users[socket.roomName]);
		if (users[socket.roomName].participants) {
			users[socket.roomName].participants[socket.userName].location = [lat, lng];
		}
		console.log(
			"updated user info of current socket: ",
			users[socket.roomName].participants[socket.userName],
		);

		socket.broadcast.to(socket.roomName).emit("bring userLocationInfo", socket.userName, users[socket.roomName].participants, socket.share);
	});

	socket.on("user moved", (position) => {
		console.log("moved user is: ", socket.userName);
		console.log("position is: ", position);
		if (users[socket.roomName] && socket.userName) {
			users[socket.roomName].participants[socket.userName].location = position;
			socket.broadcast.to(socket.roomName).emit("bring userLocationInfo", socket.userName, users[socket.roomName].participants, socket.share);
		}
	})

	socket.on("set mapCenter", (userName) => {
		socket.emit("get mapCenter", userName);
		console.log("get mapCenter: ", userName);
	})

	// ---------------------------EMOJI---------------------
	// Listen for Emoji sending
	socket.on("send emoji", (emoji, userName, pos, color) => {
		console.log("received emoji is: ", emoji);
		console.log("emoji sneder is: ", userName);
		socket.broadcast.to(socket.roomName).emit("get emoji", emoji, userName, pos, color);
	});

	// ------------------------CANVAS------------------------
	socket.on("start canvas", () => {
		socket.broadcast.to(socket.roomName).emit("open canvas");
		console.log("open canvas");
	});

	socket.on("start drawing", () => {
		console.log("Current user who is drawing: ", socket.userName);
		socket.broadcast.to(socket.roomName).emit("other start drawing");
	});
	socket.on("send paint", (mousePosition, newMousePosition, color) => {
		console.log("send paint of: ", socket.userName);
		socket.broadcast
			.to(socket.roomName)
			.emit("receive paint", mousePosition, newMousePosition, color);
	});

	socket.on("stop drawing", () => {
		console.log("user stopped drawing: ", socket.userName);
		socket.broadcast.to(socket.roomName).emit("other stopped drawing");
	});

	// -----------------------SHARE CONTENTS----------------------------
	socket.on("start sendShare request", () => {
		if (users[socket.roomName].sharingHost === "") {
			users[socket.roomName].sharingHost = socket.userName;
			socket.share = true;
			socket.broadcast
				.to(socket.roomName)
				.emit("start sharemode", socket.userName);
		}
		socket.emit(
			"sendshare response",
			users[socket.roomName].sharingHost,
			socket.userName,
		);
	});

	socket.on("finish sendShare request", () => {
		socket.broadcast
			.to(socket.roomName)
			.emit("finish sharemode", users[socket.roomName].sharingHost);
		users[socket.roomName].sharingHost = "";
		if (socket.share == true) {
			socket.share = false;
		}
	});
	socket.on("sendshare videoLoc", (videoLoc) => {
		console.log(
			"got emit of share videoLoc",
			users[socket.roomName].sharingHost,
		);
		socket.broadcast
			.to(socket.roomName)
			.emit("receive sharedvideoLoc", videoLoc);
	});

	socket.on("sendshare individual", () => {
		socket.broadcast.to(socket.roomName).emit("receive share individual");
	});

	socket.on("share individual searchlist", (recvideo, endrecvideo) => {
		socket.broadcast
			.to(socket.roomName)
			.emit("receive individual searchlist", recvideo, endrecvideo);
	});

	socket.on("send keyword individual search", (keyword) => {
		socket.broadcast
			.to(socket.roomName)
			.emit("receive keyword individual search", keyword);
		console.log("Individual Search, keyword");
	});

	socket.on("send searched videos", (videos, keyword) => {
		socket.broadcast
			.to(socket.roomName)
			.emit("receive searched videos", videos, keyword);
		console.log("Individual Search, videos");
	});
	// Leave the room if the user closes the socket
	socket.on("disconnect", () => {
		console.log("socket disconnected");
		console.log("current socket is: ", socket.id);
		console.log("current socket room is: ", socket.roomName);
		console.log("current socket userName is: ", socket.userName);
		if (socket.roomName && socket.userName && users[socket.roomName].participants) {
			delete users[socket.roomName].participants[socket.userName];
			if (Object.keys(users[socket.roomName].participants).length === 0) {
				delete users[socket.roomName];
			} else {
				io.in(socket.roomName).emit(
					"disconnectResponse",
					users[socket.roomName].participants,
					socket.userName,
				);
			}
		}
		console.log("current users: ", users[socket.roomName]);
	});
});

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`);
});
