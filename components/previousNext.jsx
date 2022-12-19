import { Button, Group } from "@mantine/core";
import dayjs from "dayjs";


const PreviousNext = ({month, setMonth, year, setYear, selectedIndex, setSelectedIndex, setSelectedYear, selectedYear}) => {
 console.log("previousnext month ",month)
    return (
        <Group position="apart" spacing="xl">
            <Button onClick={() => {
                if(month === 0){
                    setMonth(11)
                    setYear(year-1)
                }else {
                    setMonth(month-1)
                }
            }} variant="outline">Previous month</Button>
            <div>{dayjs(new Date(year, month, 1)).format("MMMM")}</div>
            <Button variant="outline"
            onClick={() => {
                if(month === 11){
                    setMonth(0)
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