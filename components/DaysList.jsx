import React, { useContext } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import AppContext from './AppContext';
import { ListContainer, ListItem } from './styled/DaysList/DaysListStyles';


const DaysList = () => {
  const { setSelectedDayNumber, uniqueDays } = useContext(AppContext);

  return (
    <Scrollbars autoHide>
      <ListContainer>
        <li>day</li>
        {uniqueDays && uniqueDays.length > 0 && uniqueDays.map((el) => {
          return <ListItem onClick={() => setSelectedDayNumber(el)}>{el}</ListItem>;
        })}
      </ListContainer>
    </Scrollbars>
  );
};

export default DaysList;
