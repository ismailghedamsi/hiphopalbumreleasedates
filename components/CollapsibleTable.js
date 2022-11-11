import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const Headers = ({ headersArray }) => {
    console.log(headersArray[0])
    return (
        <Thead>
            <Tr>
                {
                    headersArray.map((header) => {
                        return <Th key={header}>{header}</Th>
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


export default function CollapsibleTable({data}) {

    const headersArray = [
        "Release Date",
        "Artist",
        "Album"
    ]

    return (
        <div className="table-container">
            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content data={data} />
            </Table>
        </div>
    )
}