import { useEffect } from 'react'
import Main from '../components/main'
import useStore from '../components/use-store'

const Index = () => {
  const setSearch = useStore((state) => state.setSearch)
  const setSearchId = useStore((state) => state.setSearchId)
  const setFiltered = useStore((state) => state.setFiltered)

  useEffect(() => {
    setSearch('')
    setSearchId(null)
    setFiltered([])
  }, [])
  return <Main />
}

export default Index
