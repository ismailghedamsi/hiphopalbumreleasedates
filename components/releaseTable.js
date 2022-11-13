import { Textarea, TextInput } from '@mantine/core';
import { IconAt, IconEraser, IconSearch } from '@tabler/icons';
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

const Content = ({ data,searchedArtistName, setSearchedArtistName, setSearchedAlbumName }) => {
    return (
        <Tbody>
            <Tr>
                <Td><TextInput label="" placeholder="Release Date" icon={<IconSearch size={14} />} /></Td>
                <Td><TextInput  onChange={(event) => setSearchedArtistName(event.currentTarget.value)}
                 label="" placeholder="Artist name" 
                icon={<IconSearch size={14} />} />
                  </Td>
                <Td><TextInput onChange={(event) => setSearchedAlbumName(event.currentTarget.value)}  label="" placeholder="Album name" icon={<IconSearch size={14} />} /></Td>
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


export default function CollapsibleTable({ data,searchedArtistName, setSearchedArtistName, setSearchedAlbumName }) {

    const headersArray = [
        "Release Date",
        "Artist",
        "Album"
    ]

    return (
        <div className="table-container" style={{ marginLeft: "5px", paddingLeft: "10px" }} >

            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content setSearchedAlbumName={setSearchedAlbumName} setSearchedArtistName={setSearchedArtistName} data={data} />
            </Table>
        </div>
    )
}