import React from "react";
import VideoCardBoard from "./VideoCardBoard";
import { storeList } from "../../_data";

const VideoBoardWrapper = (props) => {
	const { receiveShare, recvideoLoc, searching, pixelPath } = props;

	console.log("recvideoLoc", recvideoLoc);
	console.log("pixelpath", pixelPath);

	return (
		<>
			<VideoCardBoard
				receiveShare={receiveShare}
				recvideoLoc={recvideoLoc}
				searching={searching}
				pixelPath={pixelPath ? pixelPath[0] : null}
				name={"카페"}
			></VideoCardBoard>
			<VideoCardBoard
				receiveShare={receiveShare}
				recvideoLoc={recvideoLoc ? storeList : null}
				searching={searching}
				pixelPath={pixelPath ? pixelPath[1] : null}
				name={"쇼핑몰"}
			></VideoCardBoard>
		</>
	);
};

export default VideoBoardWrapper;
