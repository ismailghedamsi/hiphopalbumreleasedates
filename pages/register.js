import { useEffect, useState } from "react";
import { appendErrors, Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { DatePicker } from "@mantine/dates";
import { format, getMonth, getYear } from "date-fns";
import dayjs from "dayjs";

const schema = yup.object({
  email: yup.string().required().min(2),
  username: yup.string().required().min(2),
  password: yup.string().required().min(8,"Your password must contains 8 characters"),
  rPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
})

export default function Register() {

  const { register, control, handleSubmit,reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const [data, setData] = useState("");

  const handleRegistration = async (data) => {

    const {user, session, error} = await supabase.auth.signUp({
        email : data.email,
        password : data.password
    })
  }

  return (
    <form style={{ marginLeft : "5px", paddingLeft: "10px"}} onSubmit={handleSubmit((data) => handleRegistration(data))}>

      <div className="field">
        <label className="label">Email</label>
        <div className="control">
          <input {...register("email")} className="input" type="text" placeholder="Your email" />
          <p>{errors.email?.message}</p>
        </div>
      </div>

      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input {...register("username")} className="input" type="text" placeholder="Your username" />
          <p>{errors.username?.message}</p>
        </div>
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input type="password" {...register("password")} className="input"  placeholder="Your password" />
          <p>{errors.password?.message}</p>
        </div>
      </div>

      <div className="field">
        <label className="label">Repeat your password</label>
        <div className="control">
          <input type="password" {...register("rPassword")} className="input" placeholder="Repeat your password" />
          <p>{errors.rPassword?.message}</p>
        </div>
      </div>


      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link">Subscribe</button>
        </div>
        <div className="control">
          <button className="button is-link is-light">Cancel</button>
        </div>
      </div>
    </form>
  );
}
