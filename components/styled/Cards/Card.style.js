import Image from "next/image";
import { styled } from "styled-components";

export const Card = styled.article`
    background: white;
    width: 250px;
    margin: 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 3px 7px 29px 0px;
    position: relative;
    @media (max-width: 500px) {
    width: 140px;
    margin: 5px;
    }
`; 

export const CardContent = styled.div`
padding: 1.4em;

`

export const CardHeader = styled.h2`
margin-top: 0;
margin-bottom: .5em;
text-align: center;
`

export const CardSecondaryText = styled.h3`
margin-top: 0;
margin-bottom: .5em;
text-align: center;
`

export const CardImage = styled(Image)`
display: block;
border: 0;
width: 100%;
`

export const CardLink = styled.div`
color: black;
 text-decoration: none;

&:hover {
   box-shadow: 3px 3px 8px hsl(0, 0%, 80%);
 }
`

