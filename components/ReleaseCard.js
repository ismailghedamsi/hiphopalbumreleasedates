import { Button, Center } from "@mantine/core";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import { supabase } from "../supabaseClient";
import AppContext from "./AppContext";
import { Card, CardContent, CardHeader, CardImage, CardContainer, CardSecondaryText } from "./styled/Cards/Card.style";
import styles from '../styles/ReleaseCard.module.css'
import SharedUploadZone from "./Upload/UploadZone";
import dynamic from "next/dynamic";

const Modal = dynamic(() => import('@mantine/core').then(mod => mod.Modal), {
    ssr: false,
    loading: () => <p>Loading modal...</p>
});

const Linktree = dynamic(() => import('./Linktree'), {
    ssr: false,
    loading: () => <p>Loading the links of the album...</p>
});


const LinksModal = styled(Modal)`
   & .mantine-Modal-modal {
    background: radial-gradient(circle at center, #fd4335 , yellow)
    }
`

const ReleaseCard = ({ index, release, releases, setReleases }) => {

    const { loggedUser } = useContext(AppContext)
    const [releaseId, setReleaseId] = useState()
    const [files, setFiles] = useState([]);
    const [uploadModalOpened, setUploadModalOpened] = useState(false)
    const [linksModalOpened, setLinksModalOpened] = useState(false)
    const [releaseTitle, setReleaseTitle] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    let inputRef = useRef()

    const coverUploadFailed = () => toast.error("Cover can't be uploaded", {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const coverUploadSucceed = () => toast.success("The release was added", {
        position: toast.POSITION.BOTTOM_CENTER
    });

    const getCover = (coverPath) => {
        if (coverPath === "" && loggedUser) {
            return "/no_cover_logged.png"
        } else if (coverPath === "" && !loggedUser) {
            return "/no_cover_unlogged.png"
        }
        return coverPath
    }


    const handleUpload = async (files) => {
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
    }

    const handleRejectedFile = () => {
        console.error('rejected files', files)
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
                title="Add release"
            >
                <SharedUploadZone onDrop={handleUpload} onReject={handleRejectedFile} uploading={isUploading} maxSize={5 * 1024 ** 2} maxFiles={1} multiple={false} />
            </Modal>

            <LinksModal
                opened={linksModalOpened}
                centered
                onClose={() => setLinksModalOpened(false)}
                transition="fade"
                transitionDuration={600}

                transitionTimingFunction="ease"
                title={releaseTitle}
            >
                <Linktree release={release} />
            </LinksModal>

            <Card ref={index === 3 ? inputRef : null}>
                <CardContainer>
                    <picture className="thumbnail">
                        <CardImage height={250} width={250}
                            onClick={() => { release.cover === "" && setUploadModalOpened(true); setReleaseId(release.id) }}
                            src={getCover(release.cover)}
                            alt={`Album cover of ${release.album} album by ${release.artist} `} />
                    </picture>
                    <i className="fas fa-pen fa-pen-indicateur" title="Modifier"></i>
                    <CardContent>

                        <CardHeader><span className={styles.labels}>Artist : </span>{`${release.artist}`}</CardHeader>

                        <CardSecondaryText><span className={styles.labels}>Album : </span> {`${release.album}`}</CardSecondaryText>
                        <Center>
                            {<Button variant="gradient" gradient={{ from: 'orange', to: 'red' }} onClick={() => {
                                setLinksModalOpened(true)
                                setReleaseTitle(release.artist + " - " + release.album)
                            }
                            }>
                                Links
                            </Button>
                            }
                        </Center>
                    </CardContent>
                </CardContainer>
            </Card>
        </>
    )
}

export default ReleaseCard