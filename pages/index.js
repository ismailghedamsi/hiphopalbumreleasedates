import Release from './releases';
import { FaArrowUp } from "react-icons/fa";
import Head from 'next/head';

const Home = () => {

  return <>
    <Head>
      <title>Home / Release Dates</title>
      <meta name="keywords" content={`${new Date().getFullYear()} hip hop albums, Hip hop album calendar, Upcoming hip hop albums, New hip hop releases, Latest hip hop albums, Hip hop music releases, Upcoming rap albums`} />
      <meta name="description" content="Stay updated on the latest hip hop music releases. Discover upcoming hip hop albums and the newest rap releases." />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="language" content="en" />
      <meta property="og:title" content="Albums dropping this month" />
      <meta
        property="og:description"
        content="List of hip hop albums dropping this month"
      />
      <meta property="og:image" content="https://upcomingrapcalendar.com/preview.png" />
      <link rel="canonical" href="https://www.upcomingrapcalendar.com" />
      <link rel="icon" href="/small_logo.png" />
    </Head>
    <a href="#" aria-label="Scroll to top of the page" role="button" className="button is-floating is-primary">
      <FaArrowUp aria-hidden="true" />
    </a>
    <Release />
  </>

}

export default Home
