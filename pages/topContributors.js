import { useQuery } from "@supabase-cache-helpers/postgrest-swr"
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

    const { data} = useQuery(
        supabase.from("top_contributors_duplicate").select("*")
    )

    const headersArray = [
        "User",
        "Number of contribution",
    ]

    return (
        <div>
            <h1 className="has-text-centered">Top contributors</h1>
            <table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content data={data} />
            </table>
        </div>
    )
}

export default TopContributor