import { Button, Group } from "@mantine/core";
import moment from "moment";
import { useContext, useEffect } from "react";
import AppContext from "./AppContext";


const PreviousNext = ({additionId }) => {
    const { year,setMonth, month, setYear} = useContext(AppContext)

   useEffect(() => {
     moment( new Date(year,month-1,1)).format("MMMM")
   },[month,year,additionId])

    return (
        <Group position="apart" spacing="xl">
            <Button onClick={handlePreviousMonth()} variant="outline">Previous month</Button>
            <div>{moment( new Date(year,month-1,1)).format("MMMM")}</div>
            <Button variant="outline" onClick={handleNextMonth()}>Next month</Button>
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