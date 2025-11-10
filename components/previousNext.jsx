import { Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";
import styles from '../styles/previousNext.module.css'
import MonthYearPicker from "./MonthPicker";

const PreviousNext = ({additionId }) => {
    const { year,setMonth, month, setYear} = useContext(AppContext)
    const matches = useMediaQuery('(min-width: 500px)');
    const [pickerValue, setPickerValue] = useState(new Date(year, month - 1, 1));

   useEffect(() => {
     setPickerValue(new Date(year, month - 1, 1));
   },[month,year,additionId])

    return (
        <Flex
      mih={50}
      gap="md"
      justify="center"
      align="center"
      direction={matches ? "row" : "column"}
      wrap="nowrap"
    >
            <button type="button" className={styles.monthChangeButton} onClick={handlePreviousMonth}>Previous</button>
            <div className={styles.monthLabel}>{moment( new Date(year,month-1,1)).format(matches ? "MMMM" : "MMM")}</div>
            <button type="button" className={styles.monthChangeButton} onClick={handleNextMonth}>Next</button>
            <div className={styles.monthPickerWrapper}>
              <MonthYearPicker
                startDate={pickerValue}
                setStartDate={setPickerValue}
                setMonth={setMonth}
                setYear={setYear}
              />
            </div>
        </Flex>
    )

    function handleNextMonth() {
        if (month - 1 === 11) {
            setMonth(1);
            setYear(year + 1);
        } else {
            setMonth(month + 1);
        }
    }

    function handlePreviousMonth() {
        if (month - 1 === 0) {
            setMonth(12);
            setYear(year - 1);
        } else {
            setMonth(month - 1);
        }
    }
}

export default PreviousNext