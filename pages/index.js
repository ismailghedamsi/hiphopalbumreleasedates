import Head from 'next/head'
import { useEffect, useState } from 'react'
import AddRelease from '../components/AddRelease'
import CollapsibleTable from '../components/CollapsibleTable'
import { supabase } from '../supabaseClient';
import { getMonth, parseISO, setYear } from 'date-fns'
import { Select } from '@mantine/core';

export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await res.json()

  return {
    props: { users: data }
  }
}

const MonthTabs = ({ selectedIndex, setSelectedIndex }) => {

  var mL = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return (
    <>
      <div className="tabs is-toggle is-toggle-rounded ">
        <ul>
          {mL.map((month, index) => {
            return (
              <li key={index} onClick={() => setSelectedIndex(index)} className={index === selectedIndex ? "is-active" : ""}>
                <a>
                  <span className="is-size-7">{month}</span>
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


  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const getReleases = async (month) => {

    let query = supabase.from('releases').select()
    if (selectedIndex != 0) {
      query = query.gte("releaseDate", `${selectedYear}-${selectedIndex}-01`).lte("releaseDate", `${selectedYear}-${selectedIndex}-${getDaysInMonth(2022, selectedIndex)}`)
    }
    query = query.order('releaseDate', { ascending: true })
    const { data, error } = await query
    if (!error) {
      setReleases(data)
    }

  }

  useEffect(() => {

    getReleases()
  }, [insertedData, selectedIndex, selectedYear])


  return (
    <>
      <Head>
        <title>Hip Hop Album Releases</title>
        <meta name="keywords" content='release dates' />
      </Head>
      <div
      >
        
        <Select
          label="Select a year"
          placeholder="Select a year"
          onChange={setSelectedYear}
          defaultValue={new Date().getFullYear()}
          data={[
            { value: 2022, label: '2022' },
            { value: 2023, label: '2023' },
          ]}
        />
        <MonthTabs selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
        <CollapsibleTable data={releases} />
        <AddRelease setInsertedData={setInsertedData} setSelectedIndex={setSelectedIndex} />

        {/* { users.map(u => {
        return <div key={u.id}>
            <Link href={'users/'+ u.id}>
              <h3>{u.name}</h3>
            </Link>
        </div>
      })} */}
      </div>
    </>
  )
}

export default Home
