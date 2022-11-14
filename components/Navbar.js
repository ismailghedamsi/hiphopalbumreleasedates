import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import AppContext from "./AppContext"

const Navbar = () => {
    const {loggedUser, setLoggedUser} = useContext(AppContext)
    const getLoggedUser =  async () => {
          const res = await supabase.auth.getUser()
          setLoggedUser(res.data.user)
        
      }
      useEffect(() => {
        getLoggedUser()
      },[])


    return (
        <nav>
            <div className="logo">
                <Image alt="hip hop logo" priority src="/logo.png" width={300} height={300}/>
            </div>
            <a href="/">Home</a>
            <a href="/register">Register</a>
            {!loggedUser ? <a href="/signIn">Login</a>  :
            <button 
            onClick={async () => {await supabase.auth.signOut()
                setLoggedUser(null)
            }}
            style={{
                 background: "none!important",
                 marginLeft: "5px",
                 border: "none",
                 padding: "0 !important",
                 fontFamily: "arial, sans-serif",
                 color: "#0000EE",
                 cursor: "pointer"
            }} type="button"
            > Sign out</button>}
        
        </nav>
    )
}

export default Navbar