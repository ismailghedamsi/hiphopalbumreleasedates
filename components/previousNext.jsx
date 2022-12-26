import styled from "@emotion/styled";
import { Button, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import moment from "moment";
import { useContext, useEffect } from "react";
import AppContext from "./AppContext";


const PreviousNext = ({additionId }) => {
    const { year,setMonth, month, setYear} = useContext(AppContext)
    const matches = useMediaQuery('(min-width: 500px)');

   useEffect(() => {
     moment( new Date(year,month-1,1)).format("MMMM")
   },[month,year,additionId])

   const MonthChangeButton = styled.button`
    border-radius: 20px;
    height : 5vh;
    background-color : #00A881;
    width: 20vh;
    border-style: solid;
   `

    return (
        <Group position="center" spacing="sm">
            <MonthChangeButton onClick={handlePreviousMonth()} variant="outline">Previous</MonthChangeButton>
            <div>{moment( new Date(year,month-1,1)).format(matches ? "MMMM" : "MMM")}</div>
            <MonthChangeButton variant="outline" onClick={handleNextMonth()}>Next</MonthChangeButton>
        </Group>
    )

    function handleNextMonth() {
        return () => {
            if (month - 1 === 11) {
                setMonth(1);
                setYear(year + 1);
            } else {
                setMonth(month + 1);
            }
        };
    }

    function handlePreviousMonth() {
        return () => {
            if (month - 1 === 0) {
                setMonth(12);
                setYear(year - 1);
            } else {
                setMonth(month - 1);
            }
        };
    }
}

export default PreviousNext