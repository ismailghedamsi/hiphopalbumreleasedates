import { styled } from "styled-components";

export const ListItem = styled.li`
  width: 30px;
  height: 20px;
  padding: 0.5em;
  margin: 0.3em;
  border-radius: 0.5em;
  font-size: x-small;
  background-color: lightgreen;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    width: 30px;
    height: 25px;
    font-size: small;
    margin: 0.2em;
    padding: 1em;
  }
`;

export const ListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  position: fixed;
  top: 120px;
  right: 16vw;
  height: 75vh;
  margin-right: 4vw;
  margin-bottom: 5vh;
  padding-bottom: 1%;
  min-width: 50px;
  flex-direction: column;
  overflow-y: auto;

  @media (min-width: 768px) {
     right: 5vw;
  }

`;
