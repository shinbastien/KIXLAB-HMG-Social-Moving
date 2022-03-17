import { initializeApp } from "firebase/app";
import "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
// import data from "../../data";

import axios from "axios";

function firebaseInstance() {
	const firebaseConfig = {
		apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
		authDomain: "hmgproject-bb41b.firebaseapp.com",
		databaseURL:
			"https://hmgproject-bb41b-default-rtdb.asia-southeast1.firebasedatabase.app",
		projectId: "hmgproject-bb41b",
		storageBucket: "hmgproject-bb41b.appspot.com",
		messagingSenderId: "83682231706",
		appId: "1:83682231706:web:c6ac86a66ddad04293e623",
		measurementId: "G-F9L1D0QFS8",
	};

	return initializeApp(firebaseConfig);
}

async function writeToPlaceData(element) {
	const { coords, duration, id, placeID, placeName, thumbnails, title } =
		element;
	const app = firebaseInstance();
	const db = getDatabase(app);

	try {
		set(ref(db, "keeps/" + id), {
			placeName: placeName,
			coords: coords,
			placeID: placeID,
			videoInfo: {
				id: id,
				title: title,
				thumnails: thumbnails,
				duration: duration,
			},
			visited: false,
		});
		console.log("uploaded");
	} catch (error) {
		console.log(error);
	}
}

async function readFromFirebase(dbRef) {
	firebaseInstance();
	const db = getDatabase();
	const dataInstance = [];

	try {
		const dbRef = await ref(db, `keeps/`);
		onValue(dbRef, (snapshot) => {
			const docRef = snapshot.val();
			Object.entries(docRef).forEach((doc) => {
				dataInstance.push(doc);
			});
		});
		console.log("I am loading");
		return dataInstance;
	} catch (error) {
		console.log(error);
	}
}

async function searchOnYoutube(props) {
	const API_URL = "https://www.googleapis.com/youtube/v3/search";

	try {
		const {
			data: { items },
		} = await axios(API_URL, {
			method: "GET",
			params: {
				key: process.env.REACT_APP_YOUTUBE_API_KEY,
				part: "snippet",
				q: props,
				maxResults: 1,
				videoEmbeddable: "true",
				type: "video",
			},
		});

		// console.log(items);

		return items[0];
	} catch (err) {
		console.log(err);

		return null;
	}
}

export {
	readFromFirebase,
	writeToPlaceData,
	searchOnYoutube,
	firebaseInstance,
};

// {
// 	groups: {
// 		memebers: INT,
//		name: String
// 	},
//  photos: [
// 	{
// 		id: String,
// 		title: String,
// 		date: Date,
// 		url: String,
//		coords: [
// 			lat: Float,
// 			lng: Float,
//		]

// 	}
// ]
//	Place: [
// 			{
//		title: String,
//		coords: [
// 			lat: Float,
// 			lng: Float,
//			]
// 		}
//  ]

// }

// {
// 		id: 1,
// 		name: "place 1",
// 		coords: {
// 			lat: 36.368258636020634,
// 			lng: 127.36385086076758,
// 		},
// 	},
// 	{
// 		id: 2,
// 		name: "place 2",
// 		coords: {
// 			lat: 36.3737905724698,
// 			lng: 127.36720858751144,
// 		},
// 	},

// 	{
// 		id: 3,
// 		name: "place 3",
// 		coords: {
// 			lat: 37.52852967338524,
// 			lng: 126.96922791179354,
// 		},
// 	},
// 	{
// 		id: 4,
// 		name: "place 4",
// 		coords: {
// 			lat: 37.42812509478836,
// 			lng: 126.99524348235616,
// 		},
// 	},
// 	{
// 		id: 5,
// 		name: "place 5",
// 		coords: {
// 			lat: 37.42887299230859,
// 			lng: 126.99683648886092,
// 		},
// 	},
