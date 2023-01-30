import { styled } from "styled-components";

const AddReleaseButton = styled.button`
     border-radius: 20px;
     background-color: #FFD700;
     margin-bottom: 4vh;
     margin-top : 4vh;
     border-style: solid;
     height : 5vh;
     width: 20vh;
     :hover {
        background-image: linear-gradient(rgb(0 0 0/30%) 0 0);
     }
`;

const LoginToUploadButton = styled.button`
     border-radius: 20px;
     background-color: #FFD700;
     margin-bottom: 4vh;
     margin-top : 4vh;
     border-style: solid;
     height : 5vh;
     width: 20vh;
     :hover {
         background-image: linear-gradient(rgb(0 0 0/40%) 0 0);
     }

     animation: pulse 2s 5;

    @keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(2);
    }
    100% {
        transform: scale(1);
    }
    }
`;


export {AddReleaseButton,LoginToUploadButton}