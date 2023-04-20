
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
                <title>Upcoming Hip Hop Releases - {new Date().toLocaleString('default', { month: 'long' })}</title>
                <meta name="keywords" content={`${new Date().getFullYear()} hip hop albums, Hip hop album calendar, Upcoming hip hop albums, New hip hop releases, Latest hip hop albums, Hip hop music releases, Upcoming rap albums`} />
                <meta name="description" content="Stay updated on the latest hip hop music releases. Discover upcoming hip hop albums and the newest rap releases." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <link rel="icon" href="/small_logo.png" />
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
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