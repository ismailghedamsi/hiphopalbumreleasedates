import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";
import ErrorMessage from "../components/ ErrorMessage";
import StyledForm from "../components/styled/StyledForm.style";
import PageTitle from "../components/PageTitle";

const schema = yup.object({
  email: yup.string().required().min(2),
  username: yup.string().required().min(2),
  password: yup.string().required().min(8,"Your password must contains 8 characters"),
  rPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
})


export default function Register() {

  const [registerError, setRegisterError] = useState("")
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });


  const handleRegistration = async (data) => {

    const {error} = await supabase.auth.signUp({
        email : data.email,
        password : data.password,
        options: {
          data: {
            username: data.username
          }
        }
    })

    if(!error){
      router.push("/signIn")
    }else{
      setRegisterError(error.message)
    }
  }

  return (
    <>
      <PageTitle title={"Register"} />
      <StyledForm>
      <form style={{ width: "500px",marginLeft : "5px", paddingLeft: "10px"}} onSubmit={handleSubmit((data) => handleRegistration(data))}>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input {...register("email")} className="input" type="text" placeholder="Your email" />
            <ErrorMessage message={registerError}/>
            <ErrorMessage message={errors.email?.message}/>
          </div>
        </div>

        <div className="field">
          <label className="label">Username</label>
          <div className="control">
            <input {...register("username")} className="input" type="text" placeholder="Your username" />
            <ErrorMessage message={errors.username?.message}/>
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input type="password" {...register("password")} className="input"  placeholder="Your password" />
            <ErrorMessage message={errors.password?.message}/>
          </div>
        </div>

        <div className="field">
          <label className="label">Repeat your password</label>
          <div className="control">
            <input type="password" {...register("rPassword")} className="input" placeholder="Repeat your password" />
            <ErrorMessage message={errors.rPassword?.message}/>
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
      </StyledForm>
    </>
  );
}
