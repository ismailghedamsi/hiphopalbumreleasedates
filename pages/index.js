import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import AddRelease from '../components/AddRelease'
import { supabase } from '../supabaseClient';
import { getMonth, parseISO, setYear } from 'date-fns'
import { Col, Grid, Modal, Select, SimpleGrid, useMantineTheme } from '@mantine/core';
import { isMobile } from 'react-device-detect';
import { useMediaQuery } from 'react-responsive';
import CollapsibleTable from '../components/releaseTable';
import { CSVLink } from 'react-csv';
import AppContext from '../components/AppContext';
import { useRouter } from 'next/router'

export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await res.json()


  return {
    props: { users: data }
  }
}

const MonthTabs = ({ selectedIndex, setSelectedIndex }) => {
  console.log("selected index ",selectedIndex)
  var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <>
      <div className="tabs is-toggle is-toggle-rounded ">
        <ul>
          {mL.map((month, index) => {
            return (
              <li key={index} onClick={() => setSelectedIndex(index)} className={index === selectedIndex ? "is-active" : ""}>
                <a>
                  <span style={{fontSize : "11.7px"}}>{month}</span>
                </a>
              </li>
            )
          })
          }
        </ul>
      </div>
    </>
  )
}

const Home = ({ users }) => {
  const [releases, setReleases] = useState([])
  const [insertedData, setInsertedData] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [searchedArtistName, setSearchedArtistName] = useState("")
  const [searchedAlbumName, setSearchedAlbumName] = useState("")
  const [searchedDay, setSearchedDay] = useState("-")
  const [dates, setDates] = useState([])
  const [defaultValueYearSelect, setDefaultValueYearSelect] = useState(new Date().getFullYear())
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1000px)' })
  const { loggedUser, setLoggedUser } = useContext(AppContext)
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter()


  var monthList = [{ label: 'January', value: 1 }, { label: 'February', value: 2 }, { label: 'March', value: 3 },
  { label: 'April', value: 4 }, { label: 'May', value: 5 }, { label: 'June', value: 6 },
  { label: 'July', value: 7 }, { label: 'August', value: 8 }, { label: 'September', value: 9 },
  { label: 'October', value: 10 }, { label: 'November', value: 11 },
  { label: 'December', value: 12 }];

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const appendZero = (month) => {
    if (month < 10) {
      return "0" + month
    }
    return month
  }

  const getReleases = async (month) => {
    console.log("get release selected index ",selectedIndex)
    let query = supabase.from('releases').select()
      query = query.gte("releaseDate", `${selectedYear}-${appendZero(selectedIndex+1)}-01`).lte("releaseDate", `${selectedYear}-${appendZero(selectedIndex+1)}-${getDaysInMonth(selectedYear, selectedIndex)}`)
    

    if (searchedArtistName !== "") {
      query = query.ilike('artist', `%${searchedArtistName}%`)
    }

    if (searchedAlbumName !== "") {
      query = query.ilike('album', `%${searchedAlbumName}%`)
    }


    if (searchedDay !== "-") {
      query = query.eq("releaseDate", searchedDay)
    }

    query = query.order('releaseDate', { ascending: true })
    const { data, error } = await query
    if (!error) {
      setReleases(data)
    }

  }

  const getUniqueDays = async () => {
    const { data, error } = await supabase.from('distinct_dates').select("releaseDate").gte("releaseDate", `${selectedYear}-${appendZero(selectedIndex)}-01`).lte("releaseDate", `${selectedYear}-${appendZero(selectedIndex)}-${getDaysInMonth(selectedYear, selectedIndex)}`)
    if (!error) {
      setDates(data)
    }
  }

  useEffect(() => {
    console.log("default ",defaultValueYearSelect)
    getUniqueDays()
    getReleases()
  }, [defaultValueYearSelect, insertedData, selectedIndex, selectedYear, searchedArtistName, searchedAlbumName, searchedDay, loggedUser])


  const getDefaultMonth = () => {
    return monthList.filter(m => { return m.value === new Date().getMonth() + 1 })
  }

  getDefaultMonth()


  return (
    <>
      <Head>
        <title>Hip Hop Album Releases</title>
        <meta name="keywords" content='release dates' />
      </Head>
      <div style={{margin : "10px"}}>
        {loggedUser && <Modal
          opened={opened}
          centered
          
          onClose={() => setOpened(false)}
          transition="fade"
          transitionDuration={600}
          transitionTimingFunction="ease"
          title="Add a release"
        >
          <AddRelease setDefaultValueYearSelect={setDefaultValueYearSelect} closeOnClickOutside closeOnEscape setOpened={setOpened} setInsertedData={setInsertedData} setSelectedIndex={setSelectedIndex} setSelectedYear={setSelectedYear} />
        </Modal>
        }
        <div class="box has-text-centered">
          {loggedUser ? <button onClick={() => setOpened(true)}>Add a release</button> : <button onClick={() => router.push("/signIn")}>Login to add a release</button>}
        </div>
        {isTabletOrMobile && <Select
          label="Select a month"
          placeholder="Select a month"
          onChange={setSelectedIndex}
          sx={{marginBottom : "20px"}}
          defaultValue={monthList.filter(m => { return m.value === new Date().getMonth() + 1 })[0].value}
          data={monthList}
        />}

        <Select
          label="Select a year"
          placeholder="Select a year"
          onChange={setSelectedYear}
          value={defaultValueYearSelect}
          sx={{marginBottom : "20px"}}
          data={[
            { value: 2022, label: '2022' },
            { value: 2023, label: '2023' },
          ]}
        />
        {!isTabletOrMobile && <MonthTabs selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />}
        <CollapsibleTable dates={dates} setSearchedDay={setSearchedDay} searchedArtistName={searchedArtistName} setSearchedAlbumName={setSearchedAlbumName} setSearchedArtistName={setSearchedArtistName} data={releases} />
        {/* <CSVLink data={releases}>Download me</CSVLink>; */}
      </div>
    </>
  )
}

export default Home
