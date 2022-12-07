import { MantineProvider } from '@mantine/core'
import Layout from '../components/Layout'
import '../styles/globals.css'
import '../node_modules/bulma-fab-button/src/bulma-fab-button.sass';

function MyApp({ Component, pageProps }) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </MantineProvider>
  )
}

export default MyApp
