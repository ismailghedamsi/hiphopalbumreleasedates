import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import AppContext from './AppContext';

const Title = styled.h1`
  margin-right : 3vw;
  font-size: medium;
` 

const ListContainer = styled.ul`
  list-style-type: none; /* remove bullet points */
  padding: 0; /* remove default padding */
  margin: 0; /* remove default margin */
  display: flex; /* display items in a row */
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  position: sticky; /* make the container sticky */
  top: 0; /* set the container to stick to the top of the viewport */
  height: 800px;
  margin-top: 50vh;
  min-width: 50px;
`;


const ListItem = styled.li`
  width: 40px; /* set width */
  height: 40px; /* set height */
  padding: 0.5em; /* add some padding */
  margin: 0.5em; /* add some margin */
  border-radius: 0.5em; /* add rounded corners */
  font-size: x-small;
  background-color: lightgreen; /* set background color to shiny white */
  display: flex;
  align-items: center;
  justify-content: center;
`;


const Button = styled.button` text-decoration: none; /* remove underline */ 
  all: unset;
  cursor: pointer;
color: black; /* set text color */ 
width: 2em; /* set width of each list item */ 
text-align: center; /* center align the text */ 
display: block; /* display the link as a block */;
`

const DaysList = () => {
  const textRef = useRef(null);
  const {setSelectedDayNumber, uniqueDays} = useContext(AppContext)
 
  return (
    <ListContainer>
          <Title ref={textRef}>day</Title>
      <Scrollbars>
        {uniqueDays && uniqueDays.length > 0 && uniqueDays.map((el) => {
            return <ListItem onClick={() =>    setSelectedDayNumber(el)}>{el}</ListItem>
        })}
      </Scrollbars>
    </ListContainer>
  );
};

export default DaysList;