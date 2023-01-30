import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { supabase } from "../supabaseClient";
import { useRouter } from "next/router";
import AppContext from "../components/AppContext";
import ErrorMessage from "../components/ ErrorMessage";
import StyledForm from "../components/styled/StyledForm.style";
import Head from "next/head";

const schema = yup.object({
  email: yup.string().required().min(2),
  password: yup.string().required().min(8, "Your password must contains 8 characters"),
})

export default function SignIn() {
  const router = useRouter()
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { setLoggedUser } = useContext(AppContext)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const login = async (data) => {
    setIsLoading(true)
    const { data: user, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })
    setIsLoading(false)

    if (!error && user) {
      setLoggedUser(user.user)
      router.push("/")
    } else {
      setLoginError(error)
    }

  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Form to login in to the app" />
        <meta name="keywords" content="signin, login, sign in" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="language" content="en" />
        <link rel="icon" href="/small_logo.png" />
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <StyledForm onSubmit={handleSubmit((data) => login(data))}>

        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input {...register("email")} className="input" type="text" placeholder="Your email" />
            <ErrorMessage message={loginError.message} />
            <ErrorMessage message={errors.email?.message} />
          </div>
        </div>

        <div className="field">
          <label className="label">Password</label>
          <div className="control">
            <input type="password" {...register("password")} className="input" placeholder="Your password" />
            <ErrorMessage message={errors.password?.message} />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button disabled={isLoading} aria-disabled={isLoading} aria-pressed={isSubmitting} aria-label="Login" className="button is-link">Login</button>
          </div>
          <div className="control">
            <button aria-label="Cancel Login" className="button is-link is-light">Cancel</button>
          </div>
        </div>
      </StyledForm>
    </>
  );
}
