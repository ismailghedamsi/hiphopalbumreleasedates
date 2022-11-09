import { useState } from "react"

const Headers = ({ headersArray }) => {
    console.log(headersArray[0])
    return (
        <thead>
            <tr>
                {
                    headersArray.map((header) => {
                        return <th>{header}</th>
                    })
                }
            </tr>
        </thead>
    )
}

const Content = ({ data }) => {
    return (
        data.map((d => {
            return <tbody>
                <tr>
                    <td>{d.releaseDate.toString()}</td>
                    <td>{d.artist}</td>
                    <td>{d.album}</td>
                </tr>
            </tbody>
        }))
    )
}


const MonthTabs = ({selectedIndex, setSelectedIndex}) => {
    var mL = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return (
        <>
            <div class="tabs is-toggle is-toggle-rounded ">
                <ul>
                    {mL.map((month, index) => {
                        return (
                            <li key={index} onClick={() => setSelectedIndex(index)} className={index === selectedIndex ? "is-active" : ""}>
                            <a>
                                <span className="is-size-7">{month}</span>
                            </a>
                        </li>
                        )
                    })
                }
                </ul>
            </div>
        </>
    )
}

export default function CollapsibleTable({data}) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const headersArray = [
        "Release Date",
        "Artist",
        "Album"
    ]

    return (
        <div className="table-container">
            <MonthTabs selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
            <table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content data={data} />
            </table>
        </div>
    )
}