import { Accordion } from "@mantine/core"
import { styled } from "styled-components"

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

export {StyledControl, StyledPanel,Item  }