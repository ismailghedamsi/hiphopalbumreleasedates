import Head from 'next/head'
import { useEffect, useState } from 'react'
import AddRelease from '../components/AddRelease'
import CollapsibleTable from '../components/CollapsibleTable'
import { supabase } from '../supabaseClient';
import {addMonths, getMonth} from 'date-fns'

export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await res.json()
  console.log("data ",data)
  return {
    props: {users: data}
  }
}

 const  Home = ({users}) => {
  const [releases, setReleases] = useState([])
  const [insertedData, setInsertedData] = useState([])
  console.log("aaa month ", getMonth(new Date()+1))


  const getReleases = async () => {
    const { data, error } = await supabase.from('Releases').select().order('releaseDate', { ascending: true })
    if(!error){
      setReleases(data)
    }
    data && console.log("data ", data)

  }

  useEffect(() => {
    getReleases()
  }, [insertedData])


  releases
  return (
    <>
    <Head>
      <title>Hip Hop Album Releases</title>
      <meta name="keywords" content='release dates'/>
    </Head>
    <div 
    >
      <h1>Homepage</h1>
      <CollapsibleTable data={releases}/>
      <AddRelease setInsertedData={setInsertedData}/>
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
