import { Center } from "@mantine/core"
import { useQuery } from "@supabase-cache-helpers/postgrest-swr"
import Head from "next/head"
import { supabase } from "../supabaseClient"

const Headers = ({ headersArray }) => {

    return (
        <thead>
            <tr>
                {
                    headersArray.map((header, key) => {
                        return <th key={key}>{header}</th>
                    })
                }
            </tr>
        </thead>
    )
}

const Content = ({ data }) => {

    return (
        <tbody>

            {data && data.map((d, index) => {
                return <tr key={index}>
                    <td>{d.username}</td>
                    <td>{d.count}</td>
                </tr>
            })
            }
        </tbody>
    )
}

const TopContributor = () => {

    const { data } = useQuery(
        supabase.from("top_contributors").select("*")
    )

    const headersArray = [
        "User",
        "Number of contribution",
    ]

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Table of users that have added albums to the database ordered by the number of addition" />
                <meta name="keywords" content="top contributors" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="language" content="en" />
                <meta name="robots" content="noindex,nofollow" />
                <link rel="icon" href="/small_logo.png" />
            </Head>
            <Center sx={{ marginBottom: "4vh" }}>
                <h1 className="has-text-centered">Top contributors</h1>
            </Center>
            <Center>
                <table className="table is-bordered">
                    <Headers headersArray={headersArray} />
                    <Content data={data} />
                </table>
            </Center>
        </>
    )
}

export default TopContributor