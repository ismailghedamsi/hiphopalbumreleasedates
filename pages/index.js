import Release from './releases';
import { FaArrowUp } from "react-icons/fa";
import Head from 'next/head';

const Home = () => {

  return <>
    <a href="#" className="button is-floating is-primary">
      <FaArrowUp />
    </a>
    <Release />
  </>

}

export default Home
