import { BackgroundImage, Center } from "@mantine/core"
import { styled } from "styled-components"

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
`

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LinkButton = styled.a`
  display: inline-block;
  border-radius: 3px;
  padding: 0.5rem 0.5rem;
  margin: 0.5rem 1rem;
  width: 11rem;
  /* background: #ff3800;  */
  background: #deb887;  
  background: white;
  background-image: url("./white1.png");
  color: black;
  border: 2px solid transparent;
  text-align: center;

  &:hover {
    background-color: lightblue;
    color: black;
  }
`;


const Linktree = ({links}) => {
  
    return( 
  //     <BackgroundImage
  //     src="./gradient.png"
  //     radius="sm"
  // >
    <Container>
      <Center>
    <LinkContainer>
      {links.spotify && <LinkButton href={links.spotify} className="w3-button" target="_blank">Spotify</LinkButton>}
      {links.bandcamp && <LinkButton href={links.bandcamp} className="w3-button" target="_blank">Bandcamp</LinkButton>}
      {links.apple_music &&  <LinkButton href="#" className="w3-button w3-round-xlarge w3-theme-l1 w3-border link" target="_blank">Apple Music</LinkButton>}
    </LinkContainer>
    </Center>

  </Container>
  //  </BackgroundImage>
  )
}

export default Linktree