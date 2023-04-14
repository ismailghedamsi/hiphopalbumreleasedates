import { Button, Center, Skeleton } from "@mantine/core";
import { useContext, useRef, useState } from "react";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import { supabase } from "../supabaseClient";
import AppContext from "./AppContext";
import { Card, CardContent, CardHeader, CardImage, CardContainer, CardSecondaryText } from "./styled/Cards/Card.style";
import styles from '../styles/ReleaseCard.module.css'
import SharedUploadZone from "./Upload/UploadZone";
import dynamic from "next/dynamic";
import Linktree from "./Linktree";

const Modal = dynamic(() => import('@mantine/core').then(mod => mod.Modal), {
    ssr: false,
    loading: () => <p>Loading modal...</p>
});


const LinksModal = styled(Modal)`
   & .mantine-Modal-modal {
    background: radial-gradient(circle at center, #fd4335 , yellow)
    }
`

const ReleaseCard = ({ fetching, index, release, releases, setReleases }) => {

    const { loggedUser } = useContext(AppContext)
    const [releaseId, setReleaseId] = useState()
    const [files, setFiles] = useState([]);
    const [uploadModalOpened, setUploadModalOpened] = useState(false)
    const [linksModalOpened, setLinksModalOpened] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const inputRef = useRef()

    const showToast = (message, type) => {
        const options = {
          position: toast.POSITION.BOTTOM_CENTER
        };
      
        if (type === "success") {
          toast.success(message, options);
        } else if (type === "error") {
          toast.error(message, options);
        }
      };
      

    const getCover = (coverPath) => {
        if (coverPath === "" && loggedUser) {
            return "/no_cover_logged.png"
        } else if (coverPath === "" && !loggedUser) {
            return "/no_cover_unlogged.png"
        }
        return coverPath
    }


    const handleUpload = async (files) => {
        setFiles(files);
        if (files.length > 0) {
          setIsUploading(true);
          const { error } = await supabase.storage.from('album-covers').upload(`public/${releaseId}/${files[0].name}`, files[0]);
          if (!error) {
            const publicURL = supabase.storage.from('album-covers').getPublicUrl(`public/${releaseId}/${files[0].name}`);
            await supabase.from("releases").update({ cover: publicURL.data.publicUrl }).eq("id", releaseId);
            let copy = [...releases];
            let objIndex = copy.findIndex((obj => obj.id === releaseId));
            copy[objIndex].cover = publicURL.data.publicUrl;
            setReleases(copy);
            showToast("The release was added", "success");
            setUploadModalOpened(false);
          } else {
            showToast("Cover can't be uploaded", "error");
          }
          setIsUploading(false);
        }
      };

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
                title="Add release"d
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
                title={`${release.artist} - ${release.album}`}
            >
                <Linktree release={release} />
            </LinksModal>

            <Card ref={index === 3 ? inputRef : null}>
                <CardContainer>
                    <Skeleton visible={fetching}>
                        <picture className="thumbnail">
                            <CardImage height={250} width={250}
                                loading="eager"
                                onClick={() => { release.cover === "" && setUploadModalOpened(true); setReleaseId(release.id) }}
                                src={getCover(release.cover)}
                                alt={`Album cover of ${release.album} album by ${release.artist} `} />
                        </picture>
                    </Skeleton>

                    <CardContent>

                        <CardHeader><span className={styles.labels}>Artist : </span>{`${release.artist}`}</CardHeader>

                        <CardSecondaryText><span className={styles.labels}>Album : </span> {`${release.album}`}</CardSecondaryText>
                        <Center>
                            {<Button variant="gradient" gradient={{ from: 'orange', to: 'red' }} onClick={() => {
                                setLinksModalOpened(true)
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