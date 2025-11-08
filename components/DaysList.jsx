import React, { useContext } from 'react';
import AppContext from './AppContext';
import { ListContainer, ListItem } from './styled/DaysList/DaysListStyles';


const DaysList = () => {
  const { setSelectedDayNumber, uniqueDays } = useContext(AppContext);

  return (
    <ListContainer aria-label="Available release days">
      <li>day</li>
      {uniqueDays && uniqueDays.length > 0 && uniqueDays.map((el) => {
        return <ListItem key={el} onClick={() => setSelectedDayNumber(el)}>{el}</ListItem>;
      })}
    </ListContainer>
  );
};

export default DaysList;
