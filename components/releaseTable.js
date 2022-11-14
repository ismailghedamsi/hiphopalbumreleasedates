import { Select, Textarea, TextInput } from '@mantine/core';
import { IconAt, IconEraser, IconSearch } from '@tabler/icons';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { sortBy, uniq } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import AppContext from './AppContext';

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

const Content = ({ dates, data, setSearchedDay, setSearchedArtistName, setSearchedAlbumName }) => {

    let sorted = dates.sort(function (a, b) {
        console.log("a b ", a, b)
        a = a.releaseDate.split('-').reverse().join('');
        b = b.releaseDate.split('-').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
        // return a.localeCompare(b);         // <-- alternative 
    });

    console.log("dates ", sorted)

    return (
        <Tbody>
            <Tr>
                <Td>
                    <Select
                        label=""
                        placeholder="Select a date"
                        defaultValue={new Date().getFullYear()}
                        onChange={setSearchedDay}
                        data={["-", ...dates.map(e => e.releaseDate)]}
                    />
                </Td>
                <Td><TextInput onChange={(event) => setSearchedArtistName(event.currentTarget.value)}
                    label="" placeholder="Artist name"
                    icon={<IconSearch size={14} />} />
                </Td>
                <Td><TextInput onChange={(event) => setSearchedAlbumName(event.currentTarget.value)} label="" placeholder="Album name" icon={<IconSearch size={14} />} /></Td>
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



export default function CollapsibleTable({ dates, data, setSearchedDay, setSearchedArtistName, setSearchedAlbumName }) {
    const {loggedUser} = useContext(AppContext)
    const headersArray = [
        "Release Date",
        "Artist",
        "Album"
    ]

    console.log("releaseDate loggeduser ",loggedUser)

    return (
        <div className="table-container" style={{ marginLeft: "5px", paddingLeft: "10px" }} >

            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content dates={dates} setSearchedDay={setSearchedDay} setSearchedAlbumName={setSearchedAlbumName} setSearchedArtistName={setSearchedArtistName} data={data} />
            </Table>
            <ToastContainer />
        </div>
    )
}