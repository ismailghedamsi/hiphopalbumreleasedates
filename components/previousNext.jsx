import { Button, Group } from "@mantine/core";
import dayjs from "dayjs";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import AppContext from "./AppContext";


const PreviousNext = ({additionId, setAdditionId }) => {
    const { loggedUser, year,setMonth, month, setYear} = useContext(AppContext)
    // const [monthName, setMonthName] = useState(dayjs(new Date(year, month, 1)).format("MMMM"))

   useEffect(() => {
    // console.log("prevnext eff")
    console.log("year ",year)
    console.log("month-1 ",month-1)
    console.log("moment( new Date(year,month-1,1)).format(MMMM) ",moment( new Date(year,month-1,1)).format("MMMM"))
    // console.log("new Date(year,month,1) ", moment( new Date(year,month,1)).format("MMMM"))
  
    // console.log("monthName ",monthName)
    console.log("ca rentre previousNext")

   },[month,year,additionId])

    return (
        <Group position="apart" spacing="xl">
            <Button onClick={() => {
                if(month-1 === 0){
                    setMonth(12)
                    setYear(year-1)
                }else {
                    setMonth(month-1)
                }
            }} variant="outline">Previous month</Button>
            <div>{moment( new Date(year,month-1,1)).format("MMMM")}</div>
            <Button variant="outline"
            onClick={() => {
                if(month-1 === 11){
                    setMonth(1)
                    setYear(year+1)
                }else {
                    setMonth(month+1)
                }
            }}
            >Next month</Button>
        </Group>
    )
}

export default PreviousNext