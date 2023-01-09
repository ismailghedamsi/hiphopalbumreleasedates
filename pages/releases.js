
import { Header } from "@mantine/core"
import Head from "next/head"
import { useState } from "react"
import PreviousNext from "../components/previousNext"
import ReleaseGrid from "../components/ReleaseGrid"

const Release = () => {
  
    const [selectedIndex, setSelectedIndex] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [additionId, setAdditionId] = useState()

    return (
        <div>
            <Head>

            </Head>
            <PreviousNext additionId={additionId} setAdditionId={setAdditionId}  selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}
             />
            <ReleaseGrid additionId={additionId} setAdditionId={setAdditionId}  selectedIndex={selectedIndex} 
            setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}/>
        </div>
    )

}

export default Release