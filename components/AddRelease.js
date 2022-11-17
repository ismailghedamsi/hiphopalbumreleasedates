import {useState } from "react";
import {  Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { DatePicker } from "@mantine/dates";
import { getMonth, getYear } from "date-fns";
import dayjs from "dayjs";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/AddRelease.module.css"
import { TextInput } from "@mantine/core";

const schema = yup.object({
  releaseDate: yup.string().required("You need to select a release date"),
  album: yup.string().required("You need to select the album name").min(2, "An artist name can't be of two characters "),
  artist: yup.string().required("You need to select the artist name").min(2),
})

export default function AddRelease({setOpened, setInsertedData, setSelectedIndex, setSelectedYear}) {

  const { control, handleSubmit,reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const duplicateToast = () =>  toast.error("Release already exists", {
    position: toast.POSITION.BOTTOM_CENTER
  });

  const success = () =>  toast.success("The release was added", {
    position: toast.POSITION.BOTTOM_CENTER
  });


  const insertRelease = async (rel) => {
    rel.releaseDate =   dayjs(rel.releaseDate).format('YYYY-MM-DD')
  
    const { error, data } = await supabase.from("releases").insert(rel).select('*')

    if(data){
      setInsertedData(data)
      if(data && data.length > 0 && !isNaN(getMonth(data[0].releaseDate)+1) ) {
        setSelectedIndex(getMonth(data[0].releaseDate)+1)
        setSelectedYear(getYear(data[0].releaseDate))
      }
      reset({releaseDate: data[0].releaseDate,  album : "", artist : ""})
      success()

    }
    if(error){
      duplicateToast()
    }
  }

  return (
    <div>
      <form style={{ marginLeft : "5px", paddingLeft: "10px"}} onSubmit={handleSubmit((data) => insertRelease(data))}>
        <div className="field">
          <label className="label">Release Date</label>
          <div className="control">
            <Controller
              name="releaseDate"
              control={control}
              render={({ field }) => <DatePicker clearable={false}  defaultValue={""} focusable data-autofocus  error={errors.releaseDate?.message} placeholder="Pick date" label="" withAsterisk {...field} dateParser={(dateString) => new Date(dateString).toISOString()} />}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Artist</label>
          <div className="control">
          <Controller
              name="artist"
              control={control}
              render={({ field }) =>  <TextInput error={errors.artist?.message}  placeholder="Type an artist name"  {...field} />}
            />
          </div>
        </div>

        <div className="field">
          <label className="label">Album</label>
          <div className="control">
            <Controller
              name="album"
              control={control}
              render={({ field }) =>   <TextInput error={errors.album?.message} placeholder="Type an album name"  {...field} />}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button type="submit" className="button is-link">Add</button>
          </div>
        </div>
      </form>
      <ToastContainer/>
    </div>
    
  );
}
