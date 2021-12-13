import { useEffect } from 'react'
import Results from '../components/results'
import useStore from '../components/store'

const ProjectIndex = () => {
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const setShowResultsBy = useStore((state) => state.setShowResultsBy)

  useEffect(() => {
    if (!searchBy.project) {
      setSearchBy({ project: true, user: false, facility: false })
      setShowResultsBy({
        user: true,
      })
    }
  }, [])

  return <Results />
}

export default ProjectIndex
