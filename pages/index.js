import Release from './releases';
import { FaArrowUp } from "react-icons/fa";
import Head from 'next/head';

const Home = () => {

  return <>

      <Head>
        <title>Home/ Releases</title>
        <link rel="icon" href="/small_logo.png" />
      </Head>

    <a href="#" className="button is-floating is-primary">
      <FaArrowUp/>
    </a>
    <Release />
  </>

}

export default Home
