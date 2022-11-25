import { Select, Textarea, TextInput } from '@mantine/core';
import { IconAt, IconEraser, IconSearch } from '@tabler/icons';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { sortBy, uniq } from 'lodash';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';
import AppContext from './AppContext';
import Image from 'next/image';

const Headers = ({ headersArray }) => {
    
    return (
        <Thead>
            <Tr>
                {
                    headersArray.map((header) => {
                        console.log("header ",header)
                        return <Th key={header}>{header}</Th>
                    })
                }
            </Tr>
        </Thead>
    )
}



const Content = ({ loggedUser, dates, data, setSearchedDay, setSearchedArtistName, setSearchedAlbumName }) => {
    console.log("data ",data)

    let sorted = dates.sort(function (a, b) {
        a = a.releaseDate.split('-').reverse().join('');
        b = b.releaseDate.split('-').reverse().join('');
        return a > b ? 1 : a < b ? -1 : 0;
    });

    console.log("dates ", sorted)

    const getCover = (coverPath) => {
        if(coverPath === "" && loggedUser){
            return "/no_cover_logged.png"
        }else if(coverPath === "" && loggedUser){
            return "/no_cover_unogged.png"
        }
        return coverPath
    }

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
                <Td></Td>
                <Td><TextInput onChange={(event) => setSearchedArtistName(event.currentTarget.value)}
                    label="" placeholder="Artist name"
                    icon={<IconSearch size={14} />} />
                </Td>
                <Td><TextInput onChange={(event) => setSearchedAlbumName(event.currentTarget.value)} label="" placeholder="Album name" icon={<IconSearch size={14} />} /></Td>
            </Tr>
            {data.map((d, index) => {
                return <Tr key={index}>
                    <Td>{d.releaseDate.toString()}</Td>
                     <Td><img alt={"album cover"} width={200} src={getCover(d.cover)}/></Td>
                    <Td>{d.artist}</Td>
                    <Td>{d.album}</Td>
                </Tr>
            })
            }
        </Tbody>
    )
}



export default function CollapsibleTable({ loggedUser, dates, data, setSearchedDay, setSearchedArtistName, setSearchedAlbumName }) {
    const headersArray = [
        "Release Date",
        "Album Cover",
        "Artist",
        "Album"
    ]

    return (
        <div className="table-container" style={{margin: "auto 0"}} >

            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content loggedUser={loggedUser} dates={dates} setSearchedDay={setSearchedDay} setSearchedAlbumName={setSearchedAlbumName} setSearchedArtistName={setSearchedArtistName} data={data} />
            </Table>
            <ToastContainer />
        </div>
    )
}