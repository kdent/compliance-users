import { useEffect } from 'react'
import { ThemeProvider } from 'theme-ui'
import { MDXProvider } from '@mdx-js/react'
import { FadeIn } from '@carbonplan/components'
import '@carbonplan/components/fonts.css'
import '@carbonplan/components/globals.css'
import theme from '@carbonplan/theme'
import useStore from '../components/use-store'
import Header from '../components/header'
import Layout from '../components/layout'
import Info from '../components/info'

const App = ({ Component, pageProps, router }) => {
  const data = useStore((state) => state.data)
  const fetch = useStore((state) => state.fetch)

  useEffect(() => {
    if (!data) fetch()
  }, [])

  if (router.route === '/404') {
    return (
      <ThemeProvider theme={theme}>
        <MDXProvider>
          <FadeIn>
            <Component {...pageProps} />
          </FadeIn>
        </MDXProvider>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <MDXProvider>
        <FadeIn>
          <Layout>
            <Header />
            <Component {...pageProps} />
            <Info />
          </Layout>
        </FadeIn>
      </MDXProvider>
    </ThemeProvider>
  )
}

export default App
