import { Grid } from "@mantine/core"
import { StyledEngineProvider } from "@mui/material"
import dayjs from "dayjs"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
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
    const now = new Date()
    const [month, setMonth] = useState(now.getMonth() + 1)
    const [year, setYear] = useState(now.getFullYear())
    const [selectedDayNumber, setSelectedDayNumber] = useState()
    const router = useRouter()
    const [uniqueDays, setUniqueDays] = useState()
    const anyValue = 5

    useEffect(() => {
        if (!router.isReady) {
            return
        }

        const { year: yearParam, month: monthParam, day: dayParam } = router.query

        if (yearParam) {
            const parsedYear = parseInt(yearParam, 10)
            if (!Number.isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100) {
                setYear(parsedYear)
            }
        }

        if (monthParam) {
            const parsedMonth = parseInt(monthParam, 10)
            if (!Number.isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
                setMonth(parsedMonth)
            }
        } else {
            const currentMonth = new Date().getMonth() + 1
            if (month !== currentMonth) {
                setMonth(currentMonth)
            }
        }

        if (dayParam) {
            const parsedDay = parseInt(dayParam, 10)
            if (!Number.isNaN(parsedDay)) {
                setSelectedDayNumber(String(parsedDay))
            }
        }
    }, [router.isReady, router.query.year, router.query.month, router.query.day, month])
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