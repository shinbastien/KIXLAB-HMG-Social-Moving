// //search YouTube video
// import React, { useState, useEffect, useCallback } from "react";
// import { readFromFirebase } from "../../lib/functions/firebase";
// import KeepCard from "./KeepCard";
// import Typography from "@mui/material/Typography";
// import Grid from "@mui/material/Grid";

// const Keep = () => {
// 	const [keep, setKeep] = useState(false);
// 	const [keepPlace, setKeepPlace] = useState({ visited: "", notVisited: "" });

// 	useCallback(async () => {
// 		const photos = await readFromFirebase("photos");
// 		const visited = photos.filter((photo) => photo.visited === true);
// 		const notVisited = photos.filter((photo) => photo.visited === false);
// 		setKeepPlace((keepPlace) => ({ ...keepPlace, visited: visited }));
// 		setKeepPlace((keepPlace) => ({ ...keepPlace, notVisited: notVisited }));
// 	}, []);

// 	return (
// 		<div>
// 			<Typography variant="h3" component="span">
// 				Keep
// 			</Typography>
// 			<Grid item container>
// 				<Grid item>
// 					<Typography variant="h5" component="span">
// 						오늘 방문한 장소
// 					</Typography>
// 					{keepPlace.notVisited.length > 0
// 						? keepPlace.notVisited.map((list, index) => (
// 								<KeepCard key={index} place={list.title}></KeepCard>
// 						  ))
// 						: null}
// 				</Grid>
// 				<Grid item>
// 					<Typography variant="h5" component="span">
// 						과거 방문한 장소
// 					</Typography>
// 					{keepPlace.visited.length > 0
// 						? keepPlace.visited.map((list, index) => (
// 								<KeepCard key={index} place={list.title}></KeepCard>
// 						  ))
// 						: null}
// 				</Grid>
// 			</Grid>
// 		</div>
// 	);
// };

// export default Keep;
