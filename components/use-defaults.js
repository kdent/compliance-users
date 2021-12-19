import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useStore from './use-store'

const useDefaults = () => {
  const router = useRouter()

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

  return null
}

export default useDefaults
