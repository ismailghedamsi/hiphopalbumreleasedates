import {  Center } from "@mantine/core"
import Head from "next/head";
import { Accordion } from '@mantine/core';
import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { v4 as uuidv4 } from 'uuid';
import Container from "./styled/Linktree/Container";
import LinkContainer from "./styled/Linktree/LinkContainer";
import LinkButton from "./styled/Linktree/LinkButton";
import { StyledControl, StyledPanel } from "./styled/Linktree/LinkAccordion";


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

  let temp = { ...urls }
  const [updateUuid, setUpdateUuid]  = useState('')


  const { register, handleSubmit, errors } = useForm(

  );
  const onSubmit = async data =>  {
 
    Object.entries(data).map(([key, value]) => {
      temp[key] = value
    })

   
     await supabase
      .from('releases')
      .update({ links: temp })
      .eq('id', id)

      setUrls({...temp})

      setUpdateUuid(uuidv4())

  };

  const emptyStringCount = Object.entries(urls).filter(([key, value]) => value === '').length;
  
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
              <Center sx={{marginTop : "20px"}}>
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
                  <Center>
                    <input className="mt-5 " disabled={emptyStringCount === 0} type="submit" value="Add links" />
                    </Center>
                </form>
                  </Center>
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