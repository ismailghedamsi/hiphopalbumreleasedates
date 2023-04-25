import { Grid } from "@mantine/core"
import { StyledEngineProvider, useMediaQuery } from "@mui/material"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import DateHelpers from "../helper/dateUtilities"
import AppContext from "./AppContext"
import Footer from "./Footer"
import DaysList from './DaysList'
import styles from '../styles/Releases.module.css'


const NavbarComponent = dynamic(() => import('./Navbar'), {
    ssr: false,
});

const Layout = ({ children }) => {
    const [appContext, setAppContext] = useState("default")
    const [loggedUser, setLoggedUser] = useState()
    const [month, setMonth] = useState(DateHelpers.getMonth(new Date()))
    const [year, setYear] = useState(new Date().getFullYear())
    const [selectedDayNumber, setSelectedDayNumber] = useState()
    const router = useRouter()
    const [uniqueDays, setUniqueDays] = useState()
    const isMobile = useMediaQuery('(max-width: 768px)'); // Adjust the breakpoint as needed
    const anyValue = 5

    return (
        <StyledEngineProvider injectFirst>
            <AppContext.Provider value={{ uniqueDays, setUniqueDays, selectedDayNumber, setSelectedDayNumber, year, month, setMonth, setYear, loggedUser, setLoggedUser, appContext, setAppContext, anyValue }}>
                <NavbarComponent />
                {router.pathname === '/' && <div className={styles.container}>
                    <h1 className={styles.description}>A comprehensive and regularly updated compilation of upcoming hip hop music releases is available.
                        There is no differentiation between popular and lesser-known releases, and anyone has the freedom to contribute new
                        or forthcoming releases to the database.</h1>
                </div>}
                <Grid>
                    <div className="column is-11-desktop is-11-tablet  is-8-mobile">{children}</div>
                    {router.pathname === '/' && <div className="column is-1-desktop   is-1-tablet is-1-mobile"><DaysList /></div>}
                </Grid>


                <Footer />
            </AppContext.Provider>
        </StyledEngineProvider>
    )
}

export default Layout