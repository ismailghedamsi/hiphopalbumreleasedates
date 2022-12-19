import styled from "@emotion/styled"
import { style } from "@mui/system"
import { useState } from "react"
import PreviousNext from "../components/previousNext"
import ReleaseGrid from "../components/ReleaseGrid"

const Release = ({ release }) => {
    const [month, setMonth] = useState(new Date().getMonth())
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedIndex, setSelectedIndex] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    return (
        <div>
            <PreviousNext month={month} setMonth={setMonth} year={year} setYear={setYear} selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}
             />
            <ReleaseGrid  t month={month} setMonth={setMonth} year={year} setYear={setYear} selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}/>
        </div>
    )

}

export default Release