import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import AppContext from './AppContext';

const Title = styled.h1`
  margin-right: 1rem;
  margin-top: 0;
  margin-bottom: 0;
  font-size: medium;
  
  @media (min-width: 768px) {
    font-size: large;
  }
`;

const ListItem = styled.li`
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

const ListContainer = styled.ul`
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
  overflow-y: auto; /* Add scrollbar */
`;


const DaysList = () => {
  const textRef = useRef(null);
  const { setSelectedDayNumber, uniqueDays } = useContext(AppContext);

  return (
    <Scrollbars autoHide>
      <ListContainer>
        <Title ref={textRef}>day</Title>
        {uniqueDays && uniqueDays.length > 0 && uniqueDays.map((el) => {
          return <ListItem onClick={() => setSelectedDayNumber(el)}>{el}</ListItem>;
        })}
      </ListContainer>
    </Scrollbars>
  );
};

export default DaysList;
