
import Head from "next/head"
import { useState } from "react"
import PreviousNext from "../components/previousNext"
import ReleaseGrid from "../components/ReleaseGrid"

const Release = () => {

    const [selectedIndex, setSelectedIndex] = useState(new Date().getMonth())
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
    const [additionId, setAdditionId] = useState()

    return (
        <>
            <Head>
                <title>Home / Release Dates</title>
                <meta name="description" content="Upcoming release dates for hip hop and rap albums" />
                <meta name="keywords" content="releases, hip hop, music, rap, upcoming, releases calendar, hip hop release calendar" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <link rel="icon" href="/small_logo.png" />
            </Head>

            <div>

                <PreviousNext additionId={additionId} setAdditionId={setAdditionId} selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear}
                />
                <ReleaseGrid additionId={additionId} setAdditionId={setAdditionId} selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
            </div>
        </>

    )

}

export default Release