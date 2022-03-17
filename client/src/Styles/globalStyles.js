import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    *{
        box-sizing: border-box;
    }
    html{
		@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;600&display=swap');
		@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap");

        font-size: 20px;
		
        width: 100%;
		height: 101%;
		overflow: -moz-scrollbars-vertical; 
		overflow-y:scroll;
        &:lang(ko) {
            font-family: 'Open Sans', sans-serif;
        }
        &:lang(en){
            font-family: 'Open Sans', sans-serif;
        }
    }
    body{
		margin: 0;
		font-family: "Noto Sans KR", sans-serif;
		

        width: 100%;
		overflow: scroll; /* Show scrollbars */
    }
    a{
        text-decoration: none;
    }
    input:focus{
        outline: none;
    }
	button{
		
		background-color: transparent;
   	 	background-repeat: no-repeat;
    	border: none;
    	cursor: pointer;
    	overflow: hidden;
    	outline: none;
	}
	button:focus {outline:0 !important;}
	
	.clickable {
	cursor: pointer;
	}

`;

export default GlobalStyles;
