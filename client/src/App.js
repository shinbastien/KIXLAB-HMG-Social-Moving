import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./index.css";
import Home from "./Home/Home";
// import ChatRoom from "./ChatRoom/ChatRoom";
import Map from "./Pages/Map";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" component={Home} />
					<Route path="/:roomname/map" component={Map} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
