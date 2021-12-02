import { useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import { Input } from '@carbonplan/components'
import { shade } from '@theme-ui/color'

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
    if (Array.isArray(obj2[search])) {
      return obj2[search][0]
    } else {
      return obj2[search]
    }
  } else if (obj3 && obj3[search]) {
    return obj2[obj3[search]][0]
  }
}

const PreviewResult = ({ result, search }) => {
  const sx = {
    color: 'secondary',
    fontSize: [1],
    fontFamily: 'mono',
    letterSpacing: 'mono',
  }

  if (result.toLowerCase().includes(search.toLowerCase())) {
    const i = result.toLowerCase().indexOf(search.toLowerCase())
    const j = search.length
    return (
      <Box sx={sx}>
        <Box as='span'>{result.slice(0, i)}</Box>
        <Box as='span' sx={{ color: shade('primary', 0.2) }}>
          {result.slice(i, i + j)}
        </Box>
        <Box as='span'>{result.slice(i + j)}</Box>
      </Box>
    )
  } else {
    return <Box sx={sx}>{result}</Box>
  }
}

const Search = ({ data, search, searchBy, setSearch, setSearchId }) => {
  const [preview, setPreview] = useState([])

  useEffect(() => {
    if (!data) return
    if (search === '') {
      setPreview([])
      setSearchId(null)
      return
    }
    if (searchBy.project) {
      let matches = getMatches(search, data.project_targets)
      if (matches.length > 1) {
        setPreview(matches)
        setSearchId(null)
      } else if (matches.length === 1) {
        setPreview(matches)
        setSearchId(
          getUniqueKey(
            matches[0],
            data.arb_to_users,
            data.opr_to_arbs,
            data.project_name_to_opr
          )
        )
      } else {
        setPreview(['no matching projects'])
        setSearchId(null)
      }
    }
    if (searchBy.user) {
      let matches = getMatches(search, data.user_targets)
      if (matches.length > 1) {
        setPreview(matches)
        setSearchId(null)
      } else if (matches.length === 1) {
        setPreview(matches)
        setSearchId(
          getUniqueKey(matches[0], data.user_to_arbs, data.user_name_to_id)
        )
      } else {
        setPreview(['no matching users'])
        setSearchId(null)
      }
    }
    if (searchBy.facility) {
      let matches = getMatches(search, data.facility_targets)
      if (matches.length > 1) {
        setPreview(matches)
        setSearchId(null)
      } else if (matches.length === 1) {
        setPreview(matches)
        setSearchId(
          getUniqueKey(
            matches[0],
            data.facility_to_user,
            data.facility_name_to_id
          )
        )
      } else {
        setPreview(['no matching users'])
        setSearchId(null)
      }
    }
  }, [data, search, searchBy])

  return (
    <>
      <Input
        placeholder={'enter search term'}
        onChange={(e) => {
          setSearch(e.currentTarget.value)
        }}
        value={search}
        sx={{
          borderStyle: 'none',
          fontFamily: 'mono',
          fontSize: [1],
          width: '100%',
          py: [2],
          letterSpacing: 'mono',
        }}
      />
      {preview.length > 0 && (
        <Box sx={{ mb: [3] }}>
          {preview.slice(0, 5).map((d, i) => {
            return <PreviewResult key={i} result={d} search={search} />
          })}
          {preview.length > 5 && (
            <Box
              sx={{
                color: 'secondary',
                fontSize: [1],
                fontFamily: 'mono',
                letterSpacing: 'mono',
              }}
            >
              <br />+{preview.length - 5} more
            </Box>
          )}
        </Box>
      )}
    </>
  )
}

export default Search
