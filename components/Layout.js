import { useState } from "react"
import AppContext from "./AppContext"
import Footer from "./Footer"
import Navbar from "./Navbar"

const Layout = ({children}) => {
    const [appContext, setAppContext] = useState("default")
    const anyValue = 5
   return (
    <AppContext.Provider value={{ appContext, setAppContext, anyValue}}>
        <div className="content">
            <Navbar/>
                {children}
            <Footer/>
        </div>
    </AppContext.Provider>
   )
}

export default Layout