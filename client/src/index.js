import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SocketProvider } from "./lib/socket";
import "./index.css";
import Home from "./Home/Home";
// import Main from "./Main/Main";
import Map from "./Pages/Map";
import reportWebVitals from "./reportWebVitals";
import GlobalStyles from "./Styles/globalStyles";
import { ThemeProvider } from "styled-components";

// "http://localhost:4000"
// "https://social-moving.herokuapp.com/"

const theme = {
	primaryColor: "#003249",
	color1: "#007ea7",
	color2: "#80ced7",
	color3: "#9ad1d4",
	color4: "#ccdbdc",
};

ReactDOM.render(
	<BrowserRouter>
		<GlobalStyles />
		<ThemeProvider theme={theme}>
			<SocketProvider url="https://social-moving.herokuapp.com/">
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route exact path=":roomID" element={<Map />} />
				</Routes>
			</SocketProvider>
		</ThemeProvider>
	</BrowserRouter>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
