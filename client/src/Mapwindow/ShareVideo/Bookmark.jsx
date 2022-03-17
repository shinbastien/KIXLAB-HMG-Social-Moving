import React, { useState, useEffect } from "react";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { writeToPlaceData } from "../../lib/functions/firebase";

const Bookmark = ({ data }) => {
	console.log(data);
	const [active, setActive] = useState(false);

	useEffect(async () => {
		if (active && data) {
			await writeToPlaceData(data);
		}
		return () => {
			setActive(false);
		};
	}, [active]);

	return (
		<IconButton
			style={{ cursor: "pointer" }}
			onClick={() => setActive(!active)}
		>
			<FontAwesomeIcon
				style={{ color: active ? "red" : "#7B7B7B" }}
				icon={faBookmark}
			/>
		</IconButton>
	);
};

export default Bookmark;
