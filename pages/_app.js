import { MantineProvider } from '@mantine/core'
import Layout from '../components/Layout'
import '../styles/globals.css'
import 'animate.css';
import '../node_modules/bulma-fab-button/src/bulma-fab-button.sass';
import { Analytics } from '@vercel/analytics/react';
import styles from '../styles/Layout.module.css'
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {

  const router = useRouter()

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div className={styles.container}>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
      </div>
    </MantineProvider>
  )
}

export default MyApp
