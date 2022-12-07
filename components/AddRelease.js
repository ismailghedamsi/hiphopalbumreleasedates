import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { DatePicker } from "@mantine/dates";
import { addMonths, getMonth, getYear } from "date-fns";
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/AddRelease.module.css"
import { Group, Image, SimpleGrid, Tabs, Text, TextInput, useMantineTheme } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX, IconHourglass } from "@tabler/icons";

const schema = yup.object({
  releaseDate: yup.string().required("You need to select a release date"),
  album: yup.string().required("You need to select the album name").min(2, "An artist name can't be of two characters "),
  artist: yup.string().required("You need to select the artist name").min(2),
})

export default function AddRelease({ setStartDate, setDefaultValueYearSelect, setYear, setMonth,month, setOpened, setInsertedData, setSelectedIndex, setSelectedYear }) {
  const [isUploading, setIsUploading] = useState(false)
  const [coverSource, setCoverSource] = useState("local")
  const [files, setFiles] = useState([]);

  const theme = useMantineTheme();

  const { control, handleSubmit, reset, formState: { errors,isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const duplicateToast = () => toast.error("Release already exists", {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const success = () => toast.success("The release was added", {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const fileRejectedToast = () => toast.success("Your cover was rejected", {
    position: toast.POSITION.BOTTOM_CENTER
  });


  const insertRelease = async (rel) => {
    if(!rel.cover){
      rel.cover = ""
    }

    rel.releaseDate = dayjs(rel.releaseDate).format('YYYY-MM-DD')


    const { error, data } = await supabase.from("releases_duplicate").insert(rel).select('*')
  
    if (data) {
      if (coverSource === "local" && files.length > 0) {
        setIsUploading(true)
        const { error: errorUpload } = await supabase.storage.from('album-covers').upload(`public/${data[0].id}/${files[0].name}`, files[0])
        if (!errorUpload) {
          const publicURL = supabase.storage.from('album-covers').getPublicUrl(`public/${data[0].id}/${files[0].name}`)
          await supabase.from("releases_duplicate").update({ cover: publicURL.data.publicUrl }).eq("id", data[0].id)
        }
        setIsUploading(false)
      }
      setInsertedData(data)
      if (data && !isNaN(new Date(data[0].releaseDate).getMonth() + 1)) {
        var releaseDate = new Date(data[0].releaseDate)
        var releaseDate = new Date(releaseDate.setHours(releaseDate.getHours()+24));
        console.log("releaseDate", releaseDate)
        console.log("insertRelease month ",month)
        setSelectedIndex(new Date(data[0].releaseDate).getMonth()+1)
        setMonth(releaseDate.getMonth()+1)
        setYear(new Date(data[0].releaseDate).getFullYear())
        setStartDate(new Date(data[0].releaseDate))
        setSelectedYear(getYear(data[0].releaseDate))
        setDefaultValueYearSelect(getYear(data[0].releaseDate))

      }
      reset({ releaseDate: data[0].releaseDate, album: "", artist: "" })
      success()

    }
    if (error) {
      duplicateToast()
    }
  }

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
    <div>
      <form style={{ marginLeft: "5px", paddingLeft: "10px" }} onSubmit={handleSubmit((data) => insertRelease(data))}>
        <div className="field">
          <label className="label">Release Date</label>
          <div className="control">
            <Controller
              name="releaseDate"
              control={control}
              render={({ field }) => <DatePicker clearable={false} defaultValue={""} focusable data-autofocus error={errors.releaseDate?.message} placeholder="Pick date" label="" withAsterisk {...field} dateParser={(dateString) => new Date(dateString).toISOString()} />}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Artist</label>
          <div className="control">
            <Controller
              name="artist"
              control={control}
              render={({ field }) => <TextInput error={errors.artist?.message} placeholder="Type an artist name"  {...field} />}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Album</label>
          <div className="control">
            <Controller
              name="album"
              control={control}
              render={({ field }) => <TextInput error={errors.album?.message} placeholder="Type an album name"  {...field} />}
            />
          </div>
        </div>

        <label className="label">Album cover</label>
        <Tabs
          defaultValue="local"
          unstyled
          onTabChange={(value) => setCoverSource(value)}
          styles={(theme) => ({
            tab: {
              ...theme.fn.focusStyles(),
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
              color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
              border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]}`,
              padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
              cursor: 'pointer',
              fontSize: theme.fontSizes.sm,
              display: 'flex',
              alignItems: 'center',

              '&:disabled': {
                opacity: 0.5,
                cursor: 'not-allowed',
              },

              '&:not(:first-of-type)': {
                borderLeft: 0,
              },

              '&:first-of-type': {
                borderTopLeftRadius: theme.radius.md,
                borderBottomLeftRadius: theme.radius.md,
              },

              '&:last-of-type': {
                borderTopRightRadius: theme.radius.md,
                borderBottomRightRadius: theme.radius.md,
              },

              '&[data-active]': {
                backgroundColor: theme.colors.blue[7],
                borderColor: theme.colors.blue[7],
                color: theme.white,
              },
            },

            tabIcon: {
              marginRight: theme.spacing.xs,
              display: 'flex',
              alignItems: 'center',
            },

            tabsList: {
              display: 'flex',
            },
          })}
        >
          <Tabs.List styles={{ border: "2px black double" }}>
            <Tabs.Tab value="local">Local file</Tabs.Tab>
            <Tabs.Tab value="url">Cover url</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="local" pt="xs" style={{ paddingBottom: "20px" }}>
            <Dropzone
              onDrop={async (files) => {
                setFiles(files)
              }}
              onReject={(files) => fileRejectedToast()}
              maxSize={5 * 1024 ** 2}
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
            <h1>Preview</h1>
            <SimpleGrid
              cols={4}
              breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
              mt={previews.length > 0 ? 'xl' : 0}
            >
              {previews}
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="url" pt="xs">
            <div className="field">
              <div className="control">
                <Controller
                  name="cover"
                  control={control}
                  render={({ field }) => <TextInput error={errors.cover?.message} placeholder="Insert the link to the cover image"  {...field} />}
                />
              </div>
            </div>
          </Tabs.Panel>
        </Tabs>

        <div className="field is-grouped">
          <div className="control">
            <button disabled={isUploading && isSubmitting} type="submit" className="button is-link">Add</button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>

  );
}
