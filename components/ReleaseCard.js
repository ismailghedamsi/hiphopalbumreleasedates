import { Button, Center, Skeleton } from "@mantine/core";
import { useContext, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { supabase } from "../supabaseClient";
import AppContext from "./AppContext";
import styles from '../styles/ReleaseCard.module.css';
import SharedUploadZone from "./Upload/UploadZone";
import dynamic from "next/dynamic";
import Linktree from "./Linktree";

import {
    Card,
    CardContent,
    CardHeader,
    CardImage,
    CardContainer,
    CardSecondaryText,
  } from './styled/Cards/Card.style'; // Adjust the import path based on your actual file structure
  

const Modal = dynamic(() => import('@mantine/core').then(mod => mod.Modal), {
    ssr: false,
    loading: () => <p>Loading modal...</p>
});

const LinksModal = styled(Modal)`
   & .mantine-Modal-modal {
    background: radial-gradient(circle at center, #fd4335 , yellow);
    }
`;

// Assuming Card, CardContent, CardHeader, CardImage, CardContainer, and CardSecondaryText are imported from "./styled/Cards/Card.style";
// If adjustments are needed, apply them directly in your styled-components file.

const ReleaseCard = React.memo(({ fetching, index, release, releases, setReleases }) => {
    const { loggedUser } = useContext(AppContext);
    const [releaseId, setReleaseId] = useState();
    const [uploadModalOpened, setUploadModalOpened] = useState(false);
    const [linksModalOpened, setLinksModalOpened] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const showToast = useCallback((message, type) => {
        const options = {
            position: toast.POSITION.BOTTOM_CENTER,
        };
        if (type === "success") {
            toast.success(message, options);
        } else if (type === "error") {
            toast.error(message, options);
        }
    }, []);

    const coverImage = useMemo(() => {
        if (release.cover === "" && loggedUser) {
            return "/no_cover_logged.png";
        } else if (release.cover === "" && !loggedUser) {
            return "/no_cover_unlogged.png";
        }
        return release.cover;
    }, [release.cover, loggedUser]);

    const handleUpload = useCallback(async (files) => {
        setIsUploading(true);
        const file = files[0];
        const { error } = await supabase.storage.from('album-covers').upload(`public/${releaseId}/${file.name}`, file);
        if (!error) {
            const publicURL = await supabase.storage.from('album-covers').getPublicUrl(`public/${releaseId}/${file.name}`);
            const copy = [...releases];
            const objIndex = copy.findIndex((obj => obj.id === releaseId));
            copy[objIndex].cover = publicURL.data.publicUrl;
            setReleases(copy);
            showToast("The release was added", "success");
        } else {
            showToast("Cover can't be uploaded", "error");
        }
        setIsUploading(false);
    }, [releaseId, releases, showToast]);

    const handleRejectedFile = useCallback(() => {
        console.error('Rejected files');
    }, []);

    const openUploadModal = useCallback(() => {
        setUploadModalOpened(true);
        setReleaseId(release.id);
    }, [release.id]);

    return (
        <>
            {uploadModalOpened && (
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
            )}

            {linksModalOpened && (
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
            )}

            <CardContainer>
                <Skeleton visible={fetching}>
                    <picture className={styles.thumbnail}>
                        <CardImage
                            height={250}
                            width={250}
                            loading="eager"
                            onClick={release.cover === "" ? openUploadModal : undefined}
                            src={coverImage}
                            alt={`Album cover of ${release.album} by ${release.artist}`}
                        />
                    </picture>
                </Skeleton>
                <CardContent>
                    <CardHeader>{release.artist}</CardHeader>
                    <CardSecondaryText>{release.album}</CardSecondaryText>
                    <Center>
                        <Button variant="gradient" gradient={{ from: 'orange', to: 'red' }} onClick={() => setLinksModalOpened(true)}>
                            Links
                        </Button>
                    </Center>
                </CardContent>
            </CardContainer>
        </>
    );
});

export default ReleaseCard;
