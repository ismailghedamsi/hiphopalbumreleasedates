import Head from 'next/head'
import { useEffect, useState } from 'react'
import AddRelease from '../components/AddRelease'
import CollapsibleTable from '../components/CollapsibleTable'
import { supabase } from '../supabaseClient';
import {getMonth, parseISO} from 'date-fns'

export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await res.json()
  console.log("data ",data)
  return {
    props: {users: data}
  }
}

const MonthTabs = ({selectedIndex, setSelectedIndex}) => {
    
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


 const  Home = ({users}) => {
  const [releases, setReleases] = useState([])
  const [insertedData, setInsertedData] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(new Date().getMonth()+1)


  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  const getReleases = async (month) => {
    console.log("selectedIndex", selectedIndex)
    let query = supabase.from('releases').select()
    if(selectedIndex != 0){
      query = query.gte("releaseDate",`2022-${selectedIndex}-01`).lte("releaseDate",`2022-${selectedIndex}-${getDaysInMonth(2022,selectedIndex)}`)
    }
    query = query.order('releaseDate', { ascending: true })
    const { data, error } = await query
    if(!error){
      setReleases(data)
    }
    data && console.log("data ", data)

  }

  useEffect(() => {

    getReleases()
  }, [insertedData, selectedIndex])


  return (
    <>
    <Head>
      <title>Hip Hop Album Releases</title>
      <meta name="keywords" content='release dates'/>
    </Head>
    <div 
    >
      <h1>Homepage</h1>
      <MonthTabs selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      <CollapsibleTable data={releases}/>
      <AddRelease setInsertedData={setInsertedData} setSelectedIndex={setSelectedIndex}/>
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
