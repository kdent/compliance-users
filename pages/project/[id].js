import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Main from '../../components/main'
import useStore from '../../components/store'

const Project = () => {
  const router = useRouter()
  const id = router.query.id

  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const setSearch = useStore((state) => state.setSearch)
  const setFiltered = useStore((state) => state.setFiltered)
  const setSearchId = useStore((state) => state.setSearchId)

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath && as === '/') {
        setSearch('')
        setSearchId(null)
        setFiltered([])
      }
      return true
    })

    return () => {
      router.beforePopState(() => true)
    }
  }, [router])

  useEffect(() => {
    if (!searchBy.project) {
      setSearchBy({ project: true, user: false, facility: false })
    }
  }, [])

  useEffect(() => {
    if (id) setSearchId(id)
  }, [id])

  return <Main />
}

export default Project
