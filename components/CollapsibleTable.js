import { getMonth } from "date-fns"
import { useState } from "react"
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Headers = ({ headersArray }) => {
    console.log(headersArray[0])
    return (
        <Thead>
            <Tr>
                {
                    headersArray.map((header) => {
                        return <Th>{header}</Th>
                    })
                }
            </Tr>
        </Thead>
    )
}

const Content = ({ data }) => {
    return (
        data.map((d => {
            return <Tbody>
                <Tr>
                    <Td>{d.releaseDate.toString()}</Td>
                    <Td>{d.artist}</Td>
                    <Td>{d.album}</Td>
                </Tr>
            </Tbody>
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
    const [selectedIndex, setSelectedIndex] = useState(getMonth(new Date())+1)
    const headersArray = [
        "Release Date",
        "Artist",
        "Album"
    ]

    return (
        <div className="table-container">
            <MonthTabs selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content data={data} />
            </Table>
        </div>
    )
}