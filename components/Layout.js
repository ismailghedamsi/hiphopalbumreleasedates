import { Grid } from "@mantine/core"
import { StyledEngineProvider } from "@mui/material"
import dayjs from "dayjs"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import DateHelpers from "../helper/dateUtilities"
import AppContext from "./AppContext"
import Footer from "./Footer"
import DaysList from './DaysList'


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
    const anyValue = 5
    return (
        <StyledEngineProvider injectFirst>
            <AppContext.Provider value={{ uniqueDays, setUniqueDays, selectedDayNumber, setSelectedDayNumber, year, month, setMonth, setYear, loggedUser, setLoggedUser, appContext, setAppContext, anyValue }}>
                <NavbarComponent />
                <Grid>
                
                    <div  className="column is-11-desktop is-11-tablet  is-8-mobile">{children}</div>
                    {router.pathname === '/' &&<div className="column is-1-desktop   is-1-tablet is-1-mobile"><DaysList/></div>}
                </Grid>


                <Footer />
            </AppContext.Provider>
        </StyledEngineProvider>
    )
}

export default Layout