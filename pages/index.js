import Release from './releases';
import { FaArrowUp } from "react-icons/fa";
import Head from 'next/head';

const Home = () => {

  return <>
    <Head>
      <title>Home / Release Dates</title>
      <meta name="description" content="Upcoming release dates for hip hop and rap albums" />
      <meta name="keywords" content="releases, hip hop, music, rap, upcoming, releases calendar, hip hop release calendar" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content="en" />
      <link rel="icon" href="/small_logo.png" />
    </Head>
    <a href="#" aria-label="Scroll to top of the page" role="button" className="button is-floating is-primary">
      <FaArrowUp aria-hidden="true" />
    </a>
    <Release />
  </>

}

export default Home
