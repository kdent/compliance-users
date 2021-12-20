import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Main from '../../components/main'
import useStore from '../../components/use-store'
import useDefaults from '../../components/use-defaults'

const Facility = () => {
  const router = useRouter()
  const id = router.query.id

  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const setSearchId = useStore((state) => state.setSearchId)

  useDefaults()

  useEffect(() => {
    if (!searchBy.facility) {
      setSearchBy({ project: false, user: false, facility: true })
    }
  }, [])

  useEffect(() => {
    if (id) setSearchId(id)
  }, [id])

  return <Main />
}

export default Facility
