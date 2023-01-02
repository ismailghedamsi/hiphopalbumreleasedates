import Image from "next/image";
import { styled } from "styled-components";

export const Card = styled.article`
    background: white;
    :hover {
        box-shadow: 10px 10px 11px rgba(33,33,33,.2); 
    }
    width: 250px;
    margin: 20px;
    box-shadow: rgba(100, 100, 111, 0.2) 3px 7px 29px 0px;
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
font-weight: bold;
`

export const CardSecondaryText = styled.h3`
margin-top: 0;
margin-bottom: .5em;
`

export const CardImage = styled(Image)`
display: block;
border: 0;
width: 100%;
`

export const CardLink = styled.a`
color: black;
 text-decoration: none;

&:hover {
   box-shadow: 3px 3px 8px hsl(0, 0%, 80%);
 }
`
