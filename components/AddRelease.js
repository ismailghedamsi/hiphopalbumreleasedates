import { useEffect, useState } from "react";
import { appendErrors, Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { DatePicker } from "@mantine/dates";

const schema = yup.object({
  releaseDate: yup.string().required().min(2),
  album: yup.string().required().min(2),
  artist: yup.string().required().min(2),
})

export default function AddRelease({setInsertedData}) {

  const { register, control, handleSubmit,reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [data, setData] = useState("");

  const insertRelease = async (rel) => {
    rel.releaseDate = new Date (rel.releaseDate).toISOString()
    const { error, data } = await supabase.from("Releases").insert(rel).select('*')
    console.log("inserted ", data)
    console.log("error ",error)
    if(data){
      setInsertedData(data)
      reset()
    }
    console.log("insert error ",error)
  }

  return (
    <form onSubmit={handleSubmit((data) => insertRelease(data))}>
      <div class="field">
        <label class="label">Release Date</label>
        <div class="control">
          <Controller
            name="releaseDate"
            control={control}
            render={({ field }) => <DatePicker placeholder="Pick date" label="Event date" withAsterisk {...field} dateParser={(dateString) => new Date(dateString).toISOString()} />}
          />
          <p>{errors.releaseDate?.message}</p>
        </div>

      </div>


      <div class="field">
        <label class="label">Artist</label>
        <div class="control">
          <input {...register("artist")} class="input" type="text" placeholder="Type an artist name" />
          <p>{errors.artist?.message}</p>
        </div>
      </div>

      <div class="field">
        <label class="label">Album</label>
        <div class="control">
          <input {...register("album")} class="input" type="text" placeholder="Type an album name" />
          <p>{errors.album?.message}</p>
        </div>
      </div>


      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link">Submit</button>
        </div>
        <div class="control">
          <button class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  );
}
