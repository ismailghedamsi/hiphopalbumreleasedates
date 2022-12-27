import { Image, SimpleGrid } from "@mantine/core";

const UploadPreview = ({ files }) => {
    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return (
            <Image
                key={index}
                width={"300px"}
                height={"300px"}
                src={imageUrl}
                imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />
        );
    });

    return (
        <SimpleGrid
            cols={4}
            breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
            mt={previews.length > 0 ? 'xl' : 0}
        >
            {previews}
        </SimpleGrid>
    )
}

export default UploadPreview