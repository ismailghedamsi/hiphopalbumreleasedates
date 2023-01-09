import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/AddRelease.module.css"
import AppContext from "./AppContext";
import DateHelpers from "../helper/dateUtilities";
import { v4 as uuidv4 } from 'uuid';
import { trim } from "lodash";
import UploadMethodTabs from "./Upload/UploadMethodTabs";
import { DatePicker, TextField } from "./Form/FormElements";

const schema = yup.object({
  releaseDate: yup.string().required("You need to select a release date"),
  album: yup.string().required("You need to select the album name").min(2, "An artist name can't be of two characters "),
  artist: yup.string().required("You need to select the artist name").min(2),
})

export default function AddRelease({ setAdditionId, setInsertedData}) {
  const [isUploading, setIsUploading] = useState(false)
  const [coverSource, setCoverSource] = useState("local")
  const [files, setFiles] = useState([]);
  const { loggedUser, setYear, setMonth } = useContext(AppContext)

  const { control, handleSubmit, reset, formState: { errors,isSubmitting } } = useForm({
    resolver: yupResolver(schema)
  });

  const duplicateToast = () => toast.error("Release already exists", {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const success = () => toast.success("The release was added", {
    position: toast.POSITION.BOTTOM_CENTER
  });


  const insertRelease = async (rel) => {
    if(!rel.cover){
      rel.cover = ""
    }
    rel.links = {
      spotify : rel.spotify,
      bandcamp : rel.bandcamp ? rel.bandcamp : "",
      apple_music : rel.apple_music ? rel.apple_music : ""
    }
    delete rel.spotify;
    delete rel.bandcamp
    delete rel.apple_music
    rel.addedBy = loggedUser.id
    rel.artist = trim(rel.artist)
    rel.album = trim(rel.album)
    rel.releaseDate = dayjs(rel.releaseDate).format('YYYY-MM-DD')
    console.log("rel ",rel)

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

      if (data) {
        var releaseDate = new Date(data[0].releaseDate)
        var releaseDate = new Date(releaseDate.setHours(releaseDate.getHours()+24));
        const m = DateHelpers.getMonth(releaseDate)
        setMonth(m)
        setYear(releaseDate.getFullYear())
        setAdditionId(uuidv4())
      }
      reset({ releaseDate: data[0].releaseDate, album: "", artist: "" })
      success()

    }
    if (error) {
      duplicateToast()
    }
  }

  return (
    <div>
      <form style={{ marginLeft: "5px", paddingLeft: "10px" }} onSubmit={handleSubmit((data) => insertRelease(data))}>

        <DatePicker control={control} label={"Pick a release date"} placeholder={"Type an artist name"} name={"releaseDate"} error={errors.releaseDate?.message}  />

        <TextField control={control} label={"Artist"} placeholder={"Type an artist name"} name={"artist"} error={errors.artist?.message} />
    
        <TextField control={control} label={"Album"} placeholder={"Type an album name"} name={"album"} error={errors.album?.message} /> 
        <TextField control={control} label={"Spotify"} placeholder={"Type spotify link"} name={"spotify"} error={errors.spotify?.message} />
        <TextField control={control} label={"Bnadcamp"} placeholder={"Type bandcamp link "} name={"bandcamp"} error={errors.bandcamp?.message} />
        <TextField control={control} label={"Apple Music"} placeholder={"Type apple music link "} name={"apple_music"} error={errors.apple_music?.message} />


        <UploadMethodTabs errors={errors} control={control} files={files} isUploading={isUploading} setFiles={setFiles} setCoverSource={setCoverSource}/>

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
