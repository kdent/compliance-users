import { useEffect } from 'react'
import Results from '../components/results'
import useStore from '../components/store'

const FacilityIndex = () => {
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)

  useEffect(() => {
    if (!searchBy.facility) {
      setSearchBy({ project: false, user: false, facility: true })
      setShowResultsBy({
        user: true,
      })
    }
  }, [])

  return <Results />
}

export default FacilityIndex
