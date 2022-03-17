import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Styles/source/logo.png";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Item } from "../Styles/themeSytles";

import styled from "styled-components";

const ImgWrapper = styled.img`
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 28%;
`;

const Wrapper = styled.div`
	text-align: center;
	padding-top: 50px;
`;

function Home() {
	// const socket = useSocket();
	const [inputs, setInputs] = useState({
		roomname: "",
		username: "",
	});

	const { roomname, username } = inputs;

	const onChange = (e) => {
		const { value, name } = e.target;
		setInputs({
			...inputs,
			[name]: value,
		});
	};

	return (
		<Grid
			container
			justify="center"
			spacing={0}
			direction="column"
			alignItems="center"
			justifyContent="center"
			style={{ minHeight: "90vh" }}
		>
			<Stack>
				<ImgWrapper src={logo}></ImgWrapper>
			</Stack>
			<Stack direction={"column"}>
				<Item
					type="text"
					name="roomname"
					placeholder="방 이름"
					value={roomname}
					onChange={onChange}
					inputProps={{ style: { fontSize: 25 } }}
				/>

				<Item
					type="text"
					name="username"
					placeholder="참여자 이름"
					value={username}
					onChange={onChange}
					inputProps={{ style: { fontSize: 25 } }}
				/>
			</Stack>
			<Wrapper>
				<Link
					to={`/${roomname}`}
					state={{
						groupID: roomname,
						userName: username,
					}}
				>
					<Button
						variant="contained"
						style={{
							fontSize: "1.5rem",
							backgroundColor: "#007ea7",
						}}
					>
						입장하기
					</Button>
				</Link>
			</Wrapper>
		</Grid>
	);
}

export default Home;
