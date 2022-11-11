import { useEffect, useState } from "react";
import { appendErrors, Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { DatePicker } from "@mantine/dates";
import { format, getMonth } from "date-fns";
import dayjs from "dayjs";

const schema = yup.object({
  releaseDate: yup.string().required().min(2),
  album: yup.string().required().min(2),
  artist: yup.string().required().min(2),
})

export default function AddRelease({setInsertedData, setSelectedIndex}) {

  const { register, control, handleSubmit,reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [data, setData] = useState("");

  const insertRelease = async (rel) => {
    rel.releaseDate =   dayjs(rel.releaseDate).format('YYYY-MM-DD')
  
    console.log("rel ",rel)
    const { error, data } = await supabase.from("releases").insert(rel).select('*')
    console.log("inserted ", data)
    // console.log("error ",error)
    if(data){
      setInsertedData(data)
      if(data && data.length > 0 && !isNaN(getMonth(data[0].releaseDate)+1) ) {
        console.log("ca rentre")
        setSelectedIndex(getMonth(data[0].releaseDate)+1)
      }
      reset()
    }
    // console.log("insert error ",error)
  }

  return (
    <form onSubmit={handleSubmit((data) => insertRelease(data))}>
      <div className="field">
        <label className="label">Release Date</label>
        <div className="control">
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => <DatePicker clearable={false} placeholder="Pick date" label="Event date" withAsterisk {...field} dateParser={(dateString) => new Date(dateString).toISOString()} />}
          />
          <p>{errors.releaseDate?.message}</p>
        </div>

      </div>


      <div className="field">
        <label className="label">Artist</label>
        <div className="control">
          <input {...register("artist")} className="input" type="text" placeholder="Type an artist name" />
          <p>{errors.artist?.message}</p>
        </div>
      </div>

      <div className="field">
        <label className="label">Album</label>
        <div className="control">
          <input {...register("album")} className="input" type="text" placeholder="Type an album name" />
          <p>{errors.album?.message}</p>
        </div>
      </div>


      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link">Submit</button>
        </div>
        <div className="control">
          <button className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  );
}
