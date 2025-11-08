import { Button, Center, Skeleton, Tabs, TextInput, Stack, Text } from "@mantine/core";
import { useContext, useRef, useState } from "react";
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

const ReleaseCard = ({ fetching, index, release, releases, setReleases }) => {
    const { loggedUser } = useContext(AppContext);
    const [releaseId, setReleaseId] = useState();
    const [files, setFiles] = useState([]);
    const [uploadModalOpened, setUploadModalOpened] = useState(false);
    const [linksModalOpened, setLinksModalOpened] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [isSavingUrl, setIsSavingUrl] = useState(false);
    const [urlError, setUrlError] = useState("");
    const inputRef = useRef();

    const showToast = (message, type) => {
        const options = {
            position: toast.POSITION.BOTTOM_CENTER,
        };
        if (type === "success") {
            toast.success(message, options);
        } else if (type === "error") {
            toast.error(message, options);
        }
    };

    const getCover = (coverPath) => {
        if (coverPath === "" && loggedUser) {
            return "/no_cover_logged.png";
        } else if (coverPath === "" && !loggedUser) {
            return "/no_cover_unlogged.png";
        }
        return coverPath;
    };

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
                setImageUrl("");
                setUrlError("");
            } else {
                showToast("Cover can't be uploaded", "error");
            }
            setIsUploading(false);
        }
    };

    const handleSaveImageUrl = async () => {
        if (!imageUrl) {
            setUrlError("Please enter an image URL.");
            return;
        }
        try {
            const parsedUrl = new URL(imageUrl);
            if (!parsedUrl.protocol.startsWith("http")) {
                throw new Error("Invalid protocol");
            }
        } catch (err) {
            setUrlError("Please enter a valid URL (http/https).");
            return;
        }

        setUrlError("");
        setIsSavingUrl(true);

        const coverUrl = imageUrl.trim();
        const currentReleaseId = releaseId ?? release.id;

        const { error } = await supabase
            .from("releases")
            .update({ cover: coverUrl })
            .eq("id", currentReleaseId);

        if (!error) {
            const copy = [...releases];
            const objIndex = copy.findIndex((obj => obj.id === currentReleaseId));
            if (objIndex !== -1) {
                copy[objIndex].cover = coverUrl;
                setReleases(copy);
            }
            showToast("Cover updated from URL", "success");
            setUploadModalOpened(false);
            setImageUrl("");
        } else {
            showToast("Cover can't be updated from URL", "error");
        }
        setIsSavingUrl(false);
    };

    const handleRejectedFile = () => {
        console.error('Rejected files', files);
    };

    return (
        <>
            <Modal
                opened={uploadModalOpened}
                centered
                onClose={() => {
                    setUploadModalOpened(false);
                    setUrlError("");
                    setImageUrl("");
                }}
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
                title="Add release"
            >
                <Tabs defaultValue="upload">
                    <Tabs.List grow>
                        <Tabs.Tab value="upload">Upload file</Tabs.Tab>
                        <Tabs.Tab value="url">Use image URL</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="upload" pt="md">
                        <SharedUploadZone onDrop={handleUpload} onReject={handleRejectedFile} uploading={isUploading} maxSize={5 * 1024 ** 2} maxFiles={1} multiple={false} />
                    </Tabs.Panel>
                    <Tabs.Panel value="url" pt="md">
                        <Stack spacing="sm">
                            <Text size="sm" color="dimmed">
                                Paste a direct link to an image (jpg, png, etc.). We will use this link as the cover.
                            </Text>
                            <TextInput
                                placeholder="https://example.com/cover.jpg"
                                value={imageUrl}
                                onChange={(event) => setImageUrl(event.currentTarget.value)}
                                error={urlError}
                            />
                            <Button
                                variant="gradient"
                                gradient={{ from: 'indigo', to: 'cyan' }}
                                onClick={handleSaveImageUrl}
                                loading={isSavingUrl}
                            >
                                Save cover from URL
                            </Button>
                        </Stack>
                    </Tabs.Panel>
                </Tabs>
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

                <CardContainer>
                    <Skeleton visible={fetching}>
                        <picture className={styles.thumbnail}>
                            <CardImage
                                height={250}
                                width={250}
                                sizes="(max-width: 768px) 80vw, 250px"
                                priority={index === 0}
                                loading={index === 0 ? undefined : "lazy"}
                                onClick={() => {
                                    if (release.cover === "") {
                                        setUploadModalOpened(true);
                                        setReleaseId(release.id);
                                        setImageUrl("");
                                        setUrlError("");
                                    }
                                }}
                                src={getCover(release.cover)}
                                alt={`Album cover of ${release.album} by ${release.artist}`} />
                        </picture>
                    </Skeleton>
                    <CardContent>
                        <CardHeader> {release.artist}</CardHeader>
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
};

export default ReleaseCard;
