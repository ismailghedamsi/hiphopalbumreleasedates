import styled from "@emotion/styled"
import { Group, Modal, Text, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import Image from "next/image";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import AppContext from "./AppContext";

const ReleaseCard = ({ release, releases, setReleases }) => {

    const { loggedUser } = useContext(AppContext)
    const [releaseId, setReleaseId] = useState()
    const [files, setFiles] = useState([]);
    const [uploadModalOpened, setUploadModalOpened] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const coverUploadFailed = () => toast.error("Cover can't be uploaded", {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const coverUploadSucceed = () => toast.success("The release was added", {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const theme = useMantineTheme();

    const Card = styled.article`
      background: white;
     width: 250px;
     margin: 20px;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
      @media (max-width: 500px) {
        width: 140px;
        margin: 5px;
      }
   `;

    const CardContent = styled.div`
      padding: 1.4em;
   `

    const CardHeader = styled.h2`
    margin-top: 0;
	margin-bottom: .5em;
	font-weight: bold;
`

    const CardSecondaryText = styled.h3`
    margin-top: 0;
    margin-bottom: .5em;
`

    const CardImage = styled(Image)`
    display: block;
	border: 0;
	width: 100%;
   `

    const CardLink = styled.a`
      color: black;
	   text-decoration: none;
      
      &:hover {
         box-shadow: 3px 3px 8px hsl(0, 0%, 80%);
       }
   `

    const getCover = (coverPath) => {
        if (coverPath === "" && loggedUser) {
            return "/no_cover_logged.png"
        } else if (coverPath === "" && !loggedUser) {
            return "/no_cover_unlogged.png"
        }
        return coverPath
    }
    return (
        <>
            <Modal
                opened={uploadModalOpened}
                centered
                onClose={() => setUploadModalOpened(false)}
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
                title="Add a release"
            >
                <Dropzone
                    onDrop={async (files) => {
                        setFiles(files)
                        if (files.length > 0) {
                            setIsUploading(true)
                            const { error } = await supabase.storage.from('album-covers').upload(`public/${releaseId}/${files[0].name}`, files[0])
                            if (!error) {
                                const publicURL = supabase.storage.from('album-covers').getPublicUrl(`public/${releaseId}/${files[0].name}`)
                                await supabase.from("releases").update({ cover: publicURL.data.publicUrl }).eq("id", releaseId)
                                let copy = [...releases]
                                let objIndex = copy.findIndex((obj => obj.id == releaseId));
                                copy[objIndex].cover = publicURL.data.publicUrl
                                setReleases(copy)
                                coverUploadSucceed()
                                setUploadModalOpened(false)
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
            <Card className="animate__animated animate__backInLeft">
                <CardLink href="#">
                    <picture className="thumbnail">
                        <CardImage height={250} width={250} onClick={() => { release.cover === "" && setUploadModalOpened(true); setReleaseId(release.id) }} src={getCover(release.cover)} alt="album cover" />
                    </picture>
                    <CardContent>

                        <CardHeader>{`${release.artist}`}</CardHeader>
                        <CardSecondaryText>{`${release.album}`}</CardSecondaryText>
                        {/* <CardParagraph>TUX re-inventing the wheel, and move the needle. Feature creep dogpile that but diversify kpis but market-facing.</CardParagraph> */}
                    </CardContent>
                </CardLink>
            </Card>
        </>
    )
}

export default ReleaseCard