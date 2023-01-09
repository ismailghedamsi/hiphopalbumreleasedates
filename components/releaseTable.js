/**
 * legacy code
 */
import { Group, Modal, Select, Text, TextInput, useMantineTheme } from '@mantine/core';
import { IconPhoto, IconSearch, IconUpload, IconX } from '@tabler/icons';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

const Headers = ({ headersArray }) => {

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

const Content = ({ setReleaseId, setOpened, loggedUser, dates, data, setSearchedDay, setSearchedArtistName, setSearchedAlbumName }) => {

    const getCover = (coverPath) => {
        if (coverPath === "" && loggedUser) {
            return "/no_cover_logged.png"
        } else if (coverPath === "" && !loggedUser) {
            return "/no_cover_unlogged.png"
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
                    <Td><img onClick={() => {d.cover === "" && setOpened(true); setReleaseId(d.id) }} alt={"album cover"} width={120} src={getCover(d.cover)} /></Td>
                    <Td>{d.artist}</Td>
                    <Td>{d.album}</Td>
                </Tr>
            })
            }
        </Tbody>
    )
}

export default function CollapsibleTable({ setData, loggedUser, dates, data, setSearchedDay, setSearchedArtistName, setSearchedAlbumName }) {
    const [opened, setOpened] = useState(false)
    const theme = useMantineTheme();
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false)
    const [releaseId, setReleaseId] = useState()

    const headersArray = [
        "Release Date",
        "Album Cover",
        "Artist",
        "Album"
    ]


    const coverUploadFailed = () => toast.error("Cover can't be uploaded", {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const coverUploadSucceed = () => toast.success("The release was added", {
        position: toast.POSITION.BOTTOM_CENTER
    });


    return (
        <div className="table-container" style={{ margin: "auto 0" }} >
            <Modal
                opened={opened}
                centered
                onClose={() => setOpened(false)}
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
                title="Add release"
            >
                <Dropzone
                    onDrop={async (files) => {
                        setFiles(files)
                        if(files.length > 0){
                            setIsUploading(true)
                            const { error } = await supabase.storage.from('album-covers').upload(`public/${releaseId}/${files[0].name}`, files[0])
                            if (!error) {
                                const publicURL = supabase.storage.from('album-covers').getPublicUrl(`public/${releaseId}/${files[0].name}`)
                                await supabase.from("releases").update({ cover : publicURL.data.publicUrl }).eq("id", releaseId)
                                let copy = [...data]
                                let objIndex = copy.findIndex((obj => obj.id == releaseId));
                                copy[objIndex].cover = publicURL.data.publicUrl 
                                setData(copy)
                                coverUploadSucceed()
                                setOpened(false)
                            } else {
                                coverUploadFailed()
                            }
                            setIsUploading(false)
                        }
                    }}
                    onReject={(files) => console.log('rejected files', files)}
                    maxSize={3 * 1024 ** 2}
                    multiple={false}
                    accept={IMAGE_MIME_TYPE}
                    maxFiles={1}
                    loading={isUploading}
                >
                    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
                        <Dropzone.Accept>
                            <IconUpload
                                size={50}
                                stroke={1.5}
                                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                            />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <IconX
                                size={50}
                                stroke={1.5}
                                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                            />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <IconPhoto size={50} stroke={1.5} />
                        </Dropzone.Idle>

                        <div>
                            <Text size="xl" inline>
                                Drag images here or click to select files
                            </Text>
                            <Text size="sm" color="dimmed" inline mt={7}>
                                Attach as many files as you like, each file should not exceed 5mb
                            </Text>
                        </div>
                    </Group>
                </Dropzone>
            </Modal>
            <Table className="table is-bordered">
                <Headers headersArray={headersArray} />
                <Content setReleaseId={setReleaseId}
                    setOpened={setOpened}
                    loggedUser={loggedUser}
                    dates={dates}
                    setSearchedDay={setSearchedDay}
                    setSearchedAlbumName={setSearchedAlbumName}
                    setSearchedArtistName={setSearchedArtistName}
                    data={data} />
            </Table>
            <ToastContainer />
        </div>
    )
}