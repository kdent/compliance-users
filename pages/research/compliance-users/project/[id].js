import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Main from '../../../../components/main'
import useStore from '../../../../components/use-store'
import useDefaults from '../../../../components/use-defaults'
import useId from '../../../../components/use-id'

const Project = () => {
  const router = useRouter()
  const id = router.query.id

  const data = useStore((state) => state.data)
  const searchBy = useStore((state) => state.searchBy)
  const setSearchBy = useStore((state) => state.setSearchBy)
  const setSearchId = useStore((state) => state.setSearchId)

  useDefaults()

  useEffect(() => {
    if (!searchBy.project) {
      setSearchBy({ project: true, user: false, facility: false })
    }
  }, [])

  useEffect(() => {
    if (data) {
      if (useId(data, id.toUpperCase())) {
        setSearchId(id.toUpperCase())
      } else {
        router.push('/research/compliance-users')
      }
    }
  }, [data, id])

  return <Main />
}

export default Project
