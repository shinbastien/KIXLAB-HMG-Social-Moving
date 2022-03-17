import * as React from "react";
import { styled, createTheme } from "@mui/material/styles";
import Input from "@mui/material/Input";

export const customTheme = createTheme({
	palette: {
		primary: {
			main: "#151ca2",
			contrastText: "white",
			input: "white",
		},
	},
	typography: {
		fontSize: 20,
	},
	input: {
		width: 300,
		margin: 100,
	},
	//style for font size
	resize: {
		fontSize: 50,
	},
});

export const Item = styled(Input)(({ theme }) => ({
	//responsive
	backgroundColor: theme.palette.input,
	textAlign: "center",
	padding: theme.spacing(3),
	display: "block",
	marginLeft: "auto",
	marginRight: "auto",
}));
