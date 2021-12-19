import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Divider } from 'theme-ui'
import { Input } from '@carbonplan/components'
import { shade } from '@theme-ui/color'
import { sx } from './styles'
import useStore from './store'

const getMatches = (search, targets) => {
  let matches = targets.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  )
  return matches
}

const getUniqueKey = (search, obj1, obj2, obj3) => {
  if (obj1[search]) {
    return search
  } else if (obj2[search]) {
    return obj2[search]
  } else if (obj3 && obj3[search]) {
    return obj3[search]
  }
}

const PreviewResult = ({ result, search, setSearch, setUniqueId }) => {
  const sx = {
    base: {
      width: 'fit-content',
      color: 'secondary',
      fontSize: [1, 1, 1, 2],
      pr: [3],
      fontFamily: 'mono',
      letterSpacing: 'mono',
    },
    active: {
      cursor: 'pointer',
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover': {
          color: 'primary',
        },
        '&:hover > #inner': {
          color: 'primary',
        },
      },
    },
  }

  if (result.toLowerCase().includes(search.toLowerCase())) {
    const i = result.toLowerCase().indexOf(search.toLowerCase())
    const j = search.length
    return (
      <Box
        sx={{ ...sx.base, ...sx.active }}
        onClick={() => {
          setSearch(result)
          setUniqueId(result)
        }}
      >
        <Box as='span'>{result.slice(0, i)}</Box>
        <Box as='span' id='inner' sx={{ color: shade('primary', 0.2) }}>
          {result.slice(i, i + j)}
        </Box>
        <Box as='span'>{result.slice(i + j)}</Box>
      </Box>
    )
  } else {
    return <Box sx={sx.base}>{result}</Box>
  }
}

const Search = () => {
  const { push } = useRouter()
  const [preview, setPreview] = useState([])

  const data = useStore((state) => state.data)
  const search = useStore((state) => state.search)
  const searchId = useStore((state) => state.searchId)
  const searchBy = useStore((state) => state.searchBy)
  const setSearch = useStore((state) => state.setSearch)
  const setSearchId = useStore((state) => state.setSearchId)

  const getSearchId = (match) => {
    let id
    if (searchBy.project) {
      id = getUniqueKey(
        match,
        data.opr_to_arbs,
        data.arb_to_oprs,
        data.project_name_to_opr
      )
    }
    if (searchBy.user) {
      id = getUniqueKey(match, data.user_to_arbs, data.user_name_to_id)
    }
    if (searchBy.facility) {
      id = getUniqueKey(match, data.facility_to_user, data.facility_name_to_id)
    }
    return id
  }

  const setUniqueId = (match) => {
    const id = getSearchId(match)
    if (searchBy.project) {
      setSearchId(id)
      push(`/project/${id}`, null, { scroll: false })
    }
    if (searchBy.user) {
      setSearchId(id)
      push(`/user/${id}`, null, { scroll: false })
    }
    if (searchBy.facility) {
      setSearchId(id)
      push(`/facility/${id}`, null, { scroll: false })
    }
  }

  useEffect(() => {
    if (!data) return
    if (search === '') {
      setPreview([])
      return
    }
    if (getSearchId(search) === searchId) {
      setPreview([])
      return
    }
    if (searchBy.project) {
      let matches = getMatches(search, data.project_targets)
      if (matches.length > 1) {
        setPreview(matches)
      } else if (matches.length === 1) {
        setPreview(matches)
      } else {
        setPreview(['no matching projects'])
      }
    }
    if (searchBy.user) {
      let matches = getMatches(search, data.user_targets)
      if (matches.length > 1) {
        setPreview(matches)
      } else if (matches.length === 1) {
        setPreview(matches)
      } else {
        setPreview(['no matching users'])
      }
    }
    if (searchBy.facility) {
      let matches = getMatches(search, data.facility_targets)
      if (matches.length > 1) {
        setPreview(matches)
      } else if (matches.length === 1) {
        setPreview(matches)
      } else {
        setPreview(['no matching facilities'])
      }
    }
  }, [data, search, searchId, searchBy])

  return (
    <>
      <Box
        sx={{
          ml: [3],
          mb: [1],
          flexGrow: 1,
          borderBottom: ({ colors }) => `solid 1px ${colors.muted}`,
        }}
      >
        <Input
          placeholder={'enter search term'}
          onChange={(e) => {
            setSearch(e.currentTarget.value)
          }}
          value={search}
          sx={{
            borderStyle: 'none',
            fontFamily: 'mono',
            fontSize: [1, 1, 1, 2],
            pt: [1],
            letterSpacing: 'mono',
            width: '100%',
          }}
        />
        {preview.length > 0 && (
          <Box sx={{ pt: [2], mb: [3] }}>
            {preview.slice(0, 7).map((d, i) => {
              return (
                <PreviewResult
                  key={i}
                  result={d}
                  search={search}
                  setSearch={setSearch}
                  setUniqueId={setUniqueId}
                />
              )
            })}
            {preview.length > 7 && (
              <Box
                sx={{
                  color: 'secondary',
                  fontSize: [1, 1, 1, 2],
                  fontFamily: 'mono',
                  letterSpacing: 'mono',
                }}
              >
                <br />+{preview.length - 7} more
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Divider />
    </>
  )
}

export default Search
