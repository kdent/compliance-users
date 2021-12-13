import { useEffect } from 'react'
import Results from '../components/results'
import useStore from '../components/store'

const UserIndex = () => {
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)

  useEffect(() => {
    if (!searchBy.user) {
      setSearchBy({ project: false, user: true, facility: false })
      setShowResultsBy({
        project: true,
        facility: false,
      })
    }
  }, [])

  return <Results />
}

export default UserIndex
