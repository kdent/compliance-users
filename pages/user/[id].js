import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Results from '../../components/results'
import useStore from '../../components/store'

const User = () => {
  const router = useRouter()
  const id = router.query.id

  const search = useStore((state) => state.search)
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)
  const setSearch = useStore((state) => state.setSearch)
  const searchId = useStore((state) => state.searchId)

  useEffect(() => {
    router.beforePopState(({ as }) => {
      if (as !== router.asPath && as === '/user') {
        setSearch('')
      }
      return true
    })

    return () => {
      router.beforePopState(() => true)
    }
  }, [router])

  useEffect(() => {
    if (!searchBy.user) {
      setSearchBy({ project: false, user: true, facility: false })
      setShowResultsBy({
        project: showResultsBy.facility ? false : true,
        facility: showResultsBy.facility ? true : false,
      })
    }
  }, [id])

  useEffect(() => {
    if ((id && id !== searchId) || (id && search === '')) setSearch(id)
  }, [id])

  return <Results />
}

export default User
