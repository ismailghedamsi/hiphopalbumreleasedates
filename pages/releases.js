import styled from "@emotion/styled"
import { style } from "@mui/system"
import { useContext, useState } from "react"
import AppContext from "../components/AppContext"
import PreviousNext from "../components/previousNext"
import ReleaseGrid from "../components/ReleaseGrid"

const Release = ({ release }) => {
  
    const [selectedIndex, setSelectedIndex] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [additionId, setAdditionId] = useState()
    const { loggedUser, year, month } = useContext(AppContext)

    return (
        <div>
            <PreviousNext additionId={additionId} setAdditionId={setAdditionId}  selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}
             />
            <ReleaseGrid additionId={additionId} setAdditionId={setAdditionId}  selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}/>
        </div>
    )

}

export default Release