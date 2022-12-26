import { StyledEngineProvider } from "@mui/material"
import { useState } from "react"
import DateHelpers from "../helper/dateUtilities"
import AppContext from "./AppContext"
import Footer from "./Footer"
import NavbarComponent from "./Navbar"
import Navbar from "./Navbar"

const Layout = ({children}) => {
    const [appContext, setAppContext] = useState("default")
    const [loggedUser, setLoggedUser] = useState()
    const [month, setMonth] = useState(DateHelpers.getMonth(new Date()))
    const [year, setYear] = useState(new Date().getFullYear())
    const anyValue = 5
   return (
    <StyledEngineProvider injectFirst>
    <AppContext.Provider value={{ year, month,setMonth, setYear, loggedUser, setLoggedUser, appContext, setAppContext, anyValue}}>
            <NavbarComponent/>
                {children}
            <Footer/>
    </AppContext.Provider>
    </StyledEngineProvider>
   )
}

export default Layout