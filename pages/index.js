import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export const getStaticProps = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await res.json()
  console.log("data ",data)
  return {
    props: {users: data}
  }
}

 const  Home = ({users}) => {
  console.log("uuu ",users)
  return (
    <>
    <Head>
      <title>Hip Hop Album Releases</title>
      <meta name="keywords" content='release dates'/>
    </Head>
    <div 
    // className={styles.container}
    >
      <h1>Homepage</h1>
      { users.map(u => {
        return <div key={u.id}>
            <Link href={'users/'+ u.id}>
              <h3>{u.name}</h3>
            </Link>
        </div>
      })}
    </div>
    </>
  )
}

export default Home
