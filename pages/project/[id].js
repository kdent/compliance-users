import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import Main from '../../components/main'
import useStore from '../../components/store'

const Project = () => {
  const {
    query: { id: id },
  } = useRouter()
  const data = useStore((state) => state.data)
  const fetch = useStore((state) => state.fetch)

  useEffect(() => {
    if (!data) fetch()
  }, [])

  return (
    <Layout>
      <Main data={data} searchId={id} />
    </Layout>
  )
}

export default Project
