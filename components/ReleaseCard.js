import styled from "@emotion/styled"
import { useContext } from "react";
import AppContext from "./AppContext";

const ReleaseCard = ({ release }) => {
  const { loggedUser, setLoggedUser } = useContext(AppContext)

  const Card = styled.article`
      background: white;
     width: 250px;
     margin: 20px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
   `;

  const CardContainer = styled.section`
      display: flex;
      flex: 1 1 0;
      justify-content:  space-between;
      flex-wrap: wrap;
   `

  const CardContent = styled.div`
      padding: 1.4em;
   `

  const CardHeader = styled.h2`
   margin-top: 0;
	margin-bottom: .5em;
	font-weight: bold;
`

const CardSecondaryText = styled.h3`
margin-top: 0;
margin-bottom: .5em;
`

  const CardImage = styled.img`
   display: block;
	border: 0;
	width: 100%;
	height: 250px;
   `

  const CardParagraph = styled.p`
      font-size: 80%;
   `

  const CardLink = styled.a`
      color: black;
	   text-decoration: none;
      
      &:hover {
         box-shadow: 3px 3px 8px hsl(0, 0%, 80%);
       }
   `

   const getCover = (coverPath) => {
    if (coverPath === "" && loggedUser) {
        return "/no_cover_logged.png"
    } else if (coverPath === "" && !loggedUser) {
        return "/no_cover_unlogged.png"
    }
    return coverPath
}
  return (
        <Card>
          <CardLink href="#">
            <picture className="thumbnail">
              <CardImage src={getCover(release.cover)} alt="album cover"/>
            </picture>
            <CardContent>

              <CardHeader>{`${release.artist}`}</CardHeader>
              <CardSecondaryText>{`${release.album}`}</CardSecondaryText>
              {/* <CardParagraph>TUX re-inventing the wheel, and move the needle. Feature creep dogpile that but diversify kpis but market-facing.</CardParagraph> */}
            </CardContent>
          </CardLink>
        </Card>
  )
}

export default ReleaseCard