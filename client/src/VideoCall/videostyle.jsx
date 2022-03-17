import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
	// padding: 20px;
	// display: flex;
	// height: 100vh;
	// width: 90%;
	// margin: auto;
	// flex-wrap: wrap;
`;

const StyledVideo = styled.video`
	// height: 40%;
	width: 100%;
	border-radius: 25px;
	overflow: hidden;
`;

const Video = (props) => {
	const ref = useRef();

	useEffect(() => {
		props.peer.on("stream", (stream) => {
			ref.current.srcObject = stream;
			console.log("stream is ", stream);
		});
	}, []);

	return <StyledVideo playsInline autoPlay ref={ref} id={props.userName} />;
};

const videoConstraints = {
	height: window.innerHeight / 2,
	width: window.innerWidth / 2,
};

export { Video, videoConstraints, Container, StyledVideo };
