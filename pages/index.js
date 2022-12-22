import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import AddRelease from '../components/AddRelease'
import { supabase } from '../supabaseClient';
import { Col, Grid, Modal, useMantineTheme } from '@mantine/core';
import { isMobile } from 'react-device-detect';
import { useMediaQuery } from 'react-responsive';
import CollapsibleTable from '../components/releaseTable';
import { CSVLink } from 'react-csv';
import AppContext from '../components/AppContext';
import { useRouter } from 'next/router'
import dayjs from 'dayjs';
import MonthYearPicker from '../components/MonthPicker';
import * as React from 'react';
import { Box } from '@mui/system';
import { Label } from '@mui/icons-material';
import ReleaseGrid from '../components/ReleaseGrid';
import Release from './releases';




export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await res.json()


  return {
    props: { users: data }
  }
}

const Home = ({ users }) => {

  return <>
    <Release />
  </>

}

export default Home
