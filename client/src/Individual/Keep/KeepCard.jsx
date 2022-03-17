import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const KeepCard = (props) => {
	const card = (
		<React.Fragment>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					{props.place}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">Learn More</Button>
			</CardActions>
		</React.Fragment>
	);
	return (
		<Box sx={{ minWidth: 275 }}>
			<Card variant="outlined">{card}</Card>
		</Box>
	);
};

export default KeepCard;

{
	/* <Typography variant="h5" component="div"></Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					adjective
				</Typography>
				<Typography variant="body2">
					well meaning and kindly.
					<br />
					{'"a benevolent smile"'}
				</Typography> */
}
