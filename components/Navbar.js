import { Flex } from "@mantine/core"
import Image from "next/image"
import { useContext, useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import AppContext from "./AppContext"

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
                bg={"red"}
                align="center"
                direction="row"
                wrap="wrap"
            >
                <Image  alt="hip hop logo" priority src="/logo_no_background.png" width={160} height={160} />

                <a href="/">Home</a>
                {!loggedUser ? <a href="/register">Register</a> : ""}
                {!loggedUser ? <a href="/signIn">Login</a> :
                    <a hre="#"
                        onClick={async () => {
                            await supabase.auth.signOut()
                            setLoggedUser(null)
                        }}
                        type="button"
                    > <span >Sign out</span></a>}
                <a target={"_blank"} href="https://www.buymeacoffee.com/ismailghedp">
                    Donate
                </a>

            </Flex>
        </nav>
    )
}

export default Navbar