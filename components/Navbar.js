import { useContext, useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import AppContext from "./AppContext"
import "../styles/Navbar.module.css"

import {NavbarContainer, LeftContainer, NavbarExtendedContainer, NavbarInnerContainer, NavbarLink, NavbarLinkContainer, NavbarLinkExtended, OpenLinksButton, RightContainer}  from "./styled/Navbar.style"

const Navbar = () => {
    const { loggedUser, setLoggedUser } = useContext(AppContext)
    const [extendNavbar, setExtendNavbar] = useState(false);
    const getLoggedUser = async () => {
        const res = await supabase.auth.getUser()
        setLoggedUser(res.data.user)

    }
    useEffect(() => {
        getLoggedUser()
    }, [])

    return (
        <NavbarContainer extendNavbar={extendNavbar}>
      <NavbarInnerContainer>
        <LeftContainer>
          <NavbarLinkContainer>
          <NavbarLink href="/"> Releases</NavbarLink>
          <NavbarLink href="/topContributors"> Top Contributors</NavbarLink>
          {!loggedUser && <NavbarLink href="/register"> Register</NavbarLink>}
          {!loggedUser ? <NavbarLink href="/signIn">Login</NavbarLink> 
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
              {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
            </OpenLinksButton>
          </NavbarLinkContainer>
        </LeftContainer>
      </NavbarInnerContainer>
      {extendNavbar && (
        <NavbarExtendedContainer>
          <NavbarLinkExtended href="/"> Releases</NavbarLinkExtended>
          <NavbarLinkExtended href="/topContributors"> Top Contributors</NavbarLinkExtended>
          {!loggedUser && <NavbarLinkExtended href="/register"> Register</NavbarLinkExtended>}
          {!loggedUser ? <NavbarLinkExtended href="/signIn">Log In</NavbarLinkExtended> 
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
        // <nav>
        //     <Flex
        //         mih={20}
        //         gap="md"
        //         justify="center"
        //         align="center"
        //         direction="row"
        //         wrap="wrap"
        //     >
        //         <Image alt="hip hop logo" priority src="/logo_no_background.png" width={160} height={160} />

        //         <StyledLink label={"Home"} href={"/"}/>
        //         <StyledLink href="/topContributors" label={"Top contributors"}/>
        //         {!loggedUser ? <StyledLink label={"Register"} href="/register"/> : ""}
        //         {!loggedUser ? <StyledLink href="/signIn" label={"Login"}/> :
        //             <Link href="#"
        //                 onClick={async () => {
        //                     await supabase.auth.signOut()
        //                     setLoggedUser(null)
        //                 }}
        //                 type="button"
        //             > <span >Sign out</span></Link>}
        //         <Link target={"_blank"} href="https://www.buymeacoffee.com/ismailghedp">
        //             Donate
        //         </Link>

        //     </Flex>
        // </nav>
    )
}

export default Navbar