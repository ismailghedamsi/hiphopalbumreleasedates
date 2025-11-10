import { useContext, useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import AppContext from "./AppContext"
import "../styles/Navbar.module.css"
import { NavbarContainer, LeftContainer, NavbarExtendedContainer, NavbarInnerContainer, NavbarLink, NavbarLinkContainer, NavbarLinkExtended, OpenLinksButton, HeaderSearchWrapper, HeaderSearchForm, HeaderSearchInput, HeaderSearchIcon, MobileSearchContainer, MobileSearchForm, MobileSearchInput, MobileSearchIcon } from "./styled/Navbar.style"
import { IconMenu, IconX, IconSearch } from "@tabler/icons"
import { useRouter } from "next/router"

const Navbar = () => {
  const router = useRouter()
  const { loggedUser, setLoggedUser } = useContext(AppContext)
  const [extendNavbar, setExtendNavbar] = useState(false);
  const [activeLink, setActiveLink] = useState(router.pathname);
  const [activeLinkMobile, setActiveLinkMobile] = useState(router.pathname);
  const [searchValue, setSearchValue] = useState("");
  const getLoggedUser = async () => {
    const res = await supabase.auth.getUser()
    setLoggedUser(res.data.user)
  }

  useEffect(() => {
    getLoggedUser()
  }, [])

  useEffect(() => {
    if (router.pathname === "/search") {
      const q = router.query.q;
      if (typeof q === "string") {
        setSearchValue(q);
      } else if (!q) {
        setSearchValue("");
      }
    }
  }, [router.pathname, router.query.q]);

  const handleSearchSubmit = (value) => {
    const trimmed = value.trim();
    setExtendNavbar(false);
    if (trimmed.length === 0) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleActiveLink = (active) => {
    return activeLink === `${active}` ? { "color": "aliceblue", paddingBottom: "10px", textDecoration: "none", borderBottom: "1px solid ", lineHeight: "48px" } : {}
  }

  const handleActiveLinkMobile = (active) => {
    return activeLinkMobile === `${active}` ? { "color": "aliceblue", paddingBottom: "10px", textDecoration: "none", borderBottom: "1px solid ", lineHeight: "48px" } : {}
  }

  return (

    <NavbarContainer extendNavbar={extendNavbar}>
      <NavbarInnerContainer>
        <LeftContainer>
          <NavbarLinkContainer>
            <NavbarLink href="/" style={handleActiveLink("/")} onClick={() => setActiveLink('/')}> Releases</NavbarLink>
            <NavbarLink href="/ressources" style={handleActiveLink("/ressources")} onClick={() => setActiveLink('/ressources')}> Ressources</NavbarLink>
            <NavbarLink style={handleActiveLink("/topContributors")} href="/topContributors" onClick={() => setActiveLink('/topContributors')}> Top Contributors</NavbarLink>
            
            {!loggedUser && <NavbarLink style={handleActiveLink("/register")} href="/register" onClick={() => setActiveLink('/register')}> Register</NavbarLink>}
            {!loggedUser ? <NavbarLink style={handleActiveLink("/signIn")} href="/signIn" onClick={() => setActiveLink('/signIn')}>Login</NavbarLink>
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
              {extendNavbar ? <IconX /> : <IconMenu />}
            </OpenLinksButton>
          </NavbarLinkContainer>
        </LeftContainer>
        <HeaderSearchWrapper>
          <HeaderSearchForm
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              handleSearchSubmit(searchValue);
            }}
          >
            <HeaderSearchInput
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search releases..."
              aria-label="Search releases"
            />
            <HeaderSearchIcon>
              <IconSearch size={18} />
            </HeaderSearchIcon>
          </HeaderSearchForm>
        </HeaderSearchWrapper>
      </NavbarInnerContainer>

      {extendNavbar && (
        <NavbarExtendedContainer>
          <NavbarLinkExtended style={handleActiveLinkMobile("/")} href="/"  onClick={() => setActiveLinkMobile('/')}> Releases</NavbarLinkExtended>
          <NavbarLinkExtended style={handleActiveLinkMobile("/ressources")} href="/ressources"  onClick={() => setActiveLinkMobile('/ressources')}> Ressources</NavbarLinkExtended>
          <NavbarLinkExtended href="/topContributors" style={handleActiveLinkMobile("/topContributors")} onClick={() => setActiveLinkMobile('/topContributors')}> Top Contributors
          </NavbarLinkExtended>
          {!loggedUser && <NavbarLinkExtended href="/register" style={handleActiveLinkMobile("/register")} onClick={() => setActiveLinkMobile('/register')}> Register</NavbarLinkExtended>}
          {!loggedUser ? <NavbarLinkExtended href="/signIn" style={handleActiveLinkMobile("/signIn")} onClick={() => setActiveLinkMobile('/signIn')}>Log In</NavbarLinkExtended>
            : <NavbarLinkExtended href="#"
              onClick={async () => {
                await supabase.auth.signOut()
                setLoggedUser(null)
              }}
              type="button"
            > <span >Sign out</span></NavbarLinkExtended>
          }
          <MobileSearchContainer>
            <MobileSearchForm
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                handleSearchSubmit(searchValue);
              }}
            >
              <MobileSearchInput
                type="search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search releases..."
                aria-label="Search releases"
              />
              <MobileSearchIcon>
                <IconSearch size={18} />
              </MobileSearchIcon>
            </MobileSearchForm>
          </MobileSearchContainer>
        </NavbarExtendedContainer>
      )}
    </NavbarContainer>
  )
}
export default Navbar
