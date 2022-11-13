import { Textarea, TextInput } from '@mantine/core';
import { IconAt, IconSearch } from '@tabler/icons';
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
        <Tbody>
            <Tr>
                <Td><TextInput label="" placeholder="Release Date" icon={<IconSearch size={14} />} /></Td>
                <Td><TextInput label="" placeholder="Artist name" icon={<IconSearch size={14} />} /></Td>
                <Td><TextInput label="" placeholder="Album name" icon={<IconSearch size={14} />} /></Td>
            </Tr>
            {data.map((d, index) => {
                return <Tr key={index}>
                    <Td>{d.releaseDate.toString()}</Td>
                    <Td>{d.artist}</Td>
                    <Td>{d.album}</Td>
                </Tr>
            })
            }
        </Tbody>
    )
}


export default function CollapsibleTable({ data }) {

    const headersArray = [
        "Release Date",
        "Artist",
        "Album"
    ]

    return (
        <div className="table-container" style={{ marginLeft: "5px", paddingLeft: "10px" }} >

            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content data={data} />
            </Table>
        </div>
    )
}