import { Center } from "@mantine/core"
import Head from "next/head"
import { useEffect, useState } from "react"
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
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    useEffect(() => {
        let active = true
        const fetchContributors = async () => {
            setLoading(true)
            const { data: contributors, error } = await supabase
                .from("top_contributors")
                .select("*")
            if (!active) {
                return
            }
            if (error) {
                setError(error)
            } else {
                setData(contributors ?? [])
            }
            setLoading(false)
        }
        fetchContributors()
        return () => {
            active = false
        }
    }, [])

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
                {error && <p role="alert">Unable to load contributors.</p>}
                {loading && !error && <p>Loading...</p>}
                <table className="table is-bordered">
                    <Headers headersArray={headersArray} />
                    <Content data={data} />
                </table>
            </Center>
        </>
    )
}

export default TopContributor