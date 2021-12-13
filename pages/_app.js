import { useEffect } from 'react'
import { ThemeProvider } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import { FadeIn } from '@carbonplan/components'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import useStore from '../components/store'
import Main from '../components/main'
import Layout from '../components/layout'

const App = ({ Component, pageProps }) => {
  const data = useStore((state) => state.data)
  const fetch = useStore((state) => state.fetch)

  useEffect(() => {
    if (!data) fetch()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <MDXProvider>
        <FadeIn>
          <Layout>
            <Main>
              <Component {...pageProps} />
            </Main>
          </Layout>
        </FadeIn>
      </MDXProvider>
    </ThemeProvider>
  )
}

export default App
