import { Modal, useMantineTheme } from "@mantine/core";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../supabaseClient";
import AppContext from "./AppContext";
import { Card, CardContent, CardHeader, CardImage, CardLink, CardSecondaryText } from "./styled/Cards/Card.style";
import SharedUploadZone from "./Upload/UploadZone";

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
        console.log('rejected files', files)
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
                <SharedUploadZone onDrop={handleUpload} onReject={handleRejectedFile} uploading={isUploading} maxSize={5 * 1024 ** 2} maxFiles={1} multiple={false}/>
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