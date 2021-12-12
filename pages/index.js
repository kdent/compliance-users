import { useEffect } from 'react'
import Layout from '../components/layout'
import Main from '../components/main'
import useStore from '../components/store'

const Index = () => {
  const data = useStore((state) => state.data)
  const fetch = useStore((state) => state.fetch)

  useEffect(() => {
    if (!data) fetch()
  }, [])

  return (
    <Layout>
      <Main data={data} />
    </Layout>
  )
}

export default Index
