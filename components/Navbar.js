import { Flex } from "@mantine/core"
import Image from "next/image"
import { useContext, useEffect } from "react"
import { supabase } from "../supabaseClient"
import AppContext from "./AppContext"
import "../styles/Navbar.module.css"
import Link from "next/link"
import StyledLink from "./StyledLink"

const Navbar = () => {
    const { loggedUser, setLoggedUser } = useContext(AppContext)

    const getLoggedUser = async () => {
        const res = await supabase.auth.getUser()
        setLoggedUser(res.data.user)

    }
    useEffect(() => {
        getLoggedUser()
    }, [])

    return (
        <nav>
            <Flex
                mih={20}
                gap="md"
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
            >
                <Image alt="hip hop logo" priority src="/logo_no_background.png" width={160} height={160} />

                <StyledLink label={"Home"} href={"/"}/>
                <StyledLink href="/topContributors" label={"Top contributors"}/>
                {!loggedUser ? <StyledLink label={"Register"} href="/register"/> : ""}
                {!loggedUser ? <StyledLink href="/signIn" label={"Login"}/> :
                    <Link href="#"
                        onClick={async () => {
                            await supabase.auth.signOut()
                            setLoggedUser(null)
                        }}
                        type="button"
                    > <span >Sign out</span></Link>}
                <Link target={"_blank"} href="https://www.buymeacoffee.com/ismailghedp">
                    Donate
                </Link>

            </Flex>
        </nav>
    )
}

export default Navbar