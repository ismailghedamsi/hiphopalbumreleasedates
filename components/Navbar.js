import { useContext, useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import AppContext from "./AppContext"
import "../styles/Navbar.module.css"

import {NavbarContainer, LeftContainer, NavbarExtendedContainer, NavbarInnerContainer, NavbarLink, NavbarLinkContainer, NavbarLinkExtended, OpenLinksButton} from "./styled/Navbar.style"
import { IconMenu, IconX } from "@tabler/icons"
import { color } from "@mui/system"
import { useRouter } from "next/router"

const Navbar = () => {
  const router = useRouter()
const { loggedUser, setLoggedUser } = useContext(AppContext)
const [extendNavbar, setExtendNavbar] = useState(false);
const [activeLink, setActiveLink] = useState(router.pathname);
const getLoggedUser = async () => {
const res = await supabase.auth.getUser()
setLoggedUser(res.data.user)


}
useEffect(() => {
    getLoggedUser()
}, [])

const  handleActiveLink = (active) => {
  return activeLink === `${active}` ? { "color" : "aliceblue",  paddingBottom: "10px", textDecoration : "none", borderBottom : "1px solid ", lineHeight: "48px"} : {}
}

return (
    <NavbarContainer extendNavbar={extendNavbar}>
  <NavbarInnerContainer>
    <LeftContainer>
      <NavbarLinkContainer>
      <NavbarLink href="/" style={handleActiveLink("/")} onClick={()=>setActiveLink('/')}> Releases</NavbarLink>
      <NavbarLink style={handleActiveLink("/topContributors")} href="/topContributors"  onClick={()=>setActiveLink('/topContributors')}> Top Contributors</NavbarLink>
      {!loggedUser && <NavbarLink style={handleActiveLink("/register")} href="/register"  onClick={()=>setActiveLink('/register')}> Register</NavbarLink>}
      {!loggedUser ? <NavbarLink style={handleActiveLink("/signIn")} href="/signIn"  onClick={()=>setActiveLink('/signIn')}>Login</NavbarLink> 
        : <NavbarLink href="#"
        onClick={async () => {
            await supabase.auth.signOut()
             setLoggedUser(null)
         }}
          type="button"
       > <span >Sign out</span></NavbarLink> 
      }
      
        <OpenLinksButton
          onClick={() => {
            setExtendNavbar((curr) => !curr);
          }}
        >
          {extendNavbar ? <IconX/> : <IconMenu/>}
        </OpenLinksButton>
      </NavbarLinkContainer>
    </LeftContainer>
  </NavbarInnerContainer>
  {extendNavbar && (
    <NavbarExtendedContainer>
      <NavbarLinkExtended href="/" className={activeLink === '/' ? 'active' : ''} onClick={()=>setActiveLink('/')}> Releases</NavbarLinkExtended>
      <NavbarLinkExtended href="/topContributors" className={activeLink === '/topContributors' ? 'active' : ''} onClick={()=>setActiveLink('/topContributors')}> Top Contributors
      </NavbarLinkExtended>
          {!loggedUser && <NavbarLinkExtended href="/register" className={activeLink === '/register' ? 'active' : ''} onClick={()=>setActiveLink('/register')}> Register</NavbarLinkExtended>}
          {!loggedUser ? <NavbarLinkExtended href="/signIn" className={activeLink === '/signIn' ? 'active' : ''} onClick={()=>setActiveLink('/signIn')}>Log In</NavbarLinkExtended> 
            :  <NavbarLinkExtended href="#"
             onClick={async () => {
                              await supabase.auth.signOut()
                               setLoggedUser(null)
                           }}
                            type="button"
                         > <span >Sign out</span></NavbarLinkExtended>
          }
        </NavbarExtendedContainer>
      )}
    </NavbarContainer>
    )
}
export default Navbar
