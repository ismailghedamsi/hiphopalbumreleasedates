import { BackgroundImage, Button, Center } from "@mantine/core"
import Head from "next/head";
import { styled } from "styled-components"
import { Accordion } from '@mantine/core';
import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { linkClasses } from "@mui/material";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { identity } from "lodash";
import { v4 as uuidv4 } from 'uuid';


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
  a:last-of-type {
    margin-bottom: 2rem;
  }
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

const StyledControl = styled(Accordion.Control)`
  background-image: url("./white1.png");
  width: 20rem;

`

const StyledPanel = styled(Accordion.Panel)`
  background-image: url("./white1.png");
  width: 20rem;

`

const Item = styled(Accordion.Item)`
  background-image: none;

`

function InputField({ label, name, register, error }) {
  return (
    <>
      <label htmlFor={name}>{label}:</label>
      <br />
      <input type="text" name={name} id={name} {...register(name)} />
      {error && <span>{label} URL is required</span>}
      <br />
    </>
  );
}


const Linktree = ({ release }) => {
  let { links, id } = release;
  const [urls, setUrls] = useState(links)
  // const [emptyStringCount, setEmptyStringCount] = useState(Object.entries(links).filter(([key, value]) => value === '').length)
  let temp = { ...urls }
  const [updateUuid, setUpdateUuid]  = useState('')


  const { register, handleSubmit, errors } = useForm(
    //   {
    //   resolver: yupResolver(musicFormSchema)
    // }
  );
  const onSubmit = async data =>  {
    // Send the form data to your backend server or perform some other action
    console.log("beofre mod ", links);

    Object.entries(data).map(([key, value]) => {
      temp[key] = value
    })

   
    const { error } = await supabase
      .from('releases_duplicate')
      .update({ links: temp })
      .eq('id', id)

      console.log("after mod ", links);

      setUrls({...temp})

      setUpdateUuid(uuidv4())

  };

  const emptyStringCount = Object.entries(urls).filter(([key, value]) => value === '').length;
  console.log("emptyStringCount ",emptyStringCount)
  console.log("Object.entries(links).length", Object.entries(urls).length)
  return (
    <Container>
      <Head>
        <meta name="description" content="This is the page for showing links to stream the release on various platforms." />
      </Head>
      <Center>
        <LinkContainer>
          {urls.spotify &&  urls.spotify != "" && <LinkButton href={urls.spotify} className="w3-button" target="_blank">Spotify</LinkButton>}
          {urls.bandcamp && <LinkButton href={urls.bandcamp} className="w3-button" target="_blank">Bandcamp</LinkButton>}
          {urls.apple_music && <LinkButton href={urls.apple_music} className="w3-button w3-round-xlarge w3-theme-l1 w3-border link" target="_blank">Apple Music</LinkButton>}
          <Accordion defaultValue="customization">
          { emptyStringCount != ''  && <Item value="customization">
              <StyledControl>Add links</StyledControl>
              <StyledPanel>
                <form onSubmit={handleSubmit((data) => onSubmit(data))}>
                  {urls.spotify === "" && <InputField
                    label="Spotify"
                    name="spotify"
                    register={register}
                    error={errors?.spotify.message}
                  />
                  }
                  {urls.bandcamp === "" && <InputField
                    label="Bandcamp"
                    name="bandcamp"
                    register={register}
                    error={errors?.bandcamp.message}
                  />
                  }
                  { urls.apple_music === "" && <InputField
                    label="Apple Music"
                    name="apple_music"
                    register={register}
                    error={errors?.apple_music.message}
                  />
                  }
                  <input disabled={emptyStringCount === 0} type="submit" value="Submit" />
                </form>
              </StyledPanel>
            </Item>
          }
          </Accordion>
        </LinkContainer>

      </Center>

    </Container>
  )
}

export default Linktree