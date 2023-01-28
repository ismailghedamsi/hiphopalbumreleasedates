import dayjs from 'dayjs';
import React, { useContext, useEffect, useRef, useState } from 'react';
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
  height: 500px; /* set a fixed height for the container */

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
  const [titleWidth, setTitleWidth] = useState(-1)
  const textRef = useRef(null);
  const daysInCurrentMonth = dayjs().endOf('month').date();
  const {selectedDayNumber,setSelectedDayNumber, uniqueDays} = useContext(AppContext)
 

  useEffect(() => {
    console.log("uniquedats ", uniqueDays)
    if(textRef && textRef.current){
      console.log(textRef.current.getBoundingClientRect().width)
    }
  },[textRef])
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