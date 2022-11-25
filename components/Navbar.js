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
            {!loggedUser ? <a href="/register">Register</a> : ""}
            {!loggedUser ? <a href="/signIn">Login</a>  :
            <a  hre="#"
            style={{wordBreak : "break-word"}}
            onClick={async () => {await supabase.auth.signOut()
                setLoggedUser(null)
            }}
             type="button"
            > Sign out</a>}
            <a target={"_blank"} href= "https://www.buymeacoffee.com/ismailghedp">
                Donate
            </a>
        
        </nav>
    )
}

export default Navbar