import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Left, Down } from '@carbonplan/icons'
import Entry from './entry'

const Results = ({
  data,
  search,
  searchBy,
  showResultsBy,
  reportingPeriods,
}) => {
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    if (!data) return

    const reportingPeriodsActive = Object.keys(reportingPeriods).filter(
      (d) => reportingPeriods[d]
    )

    if (searchBy.project) {
      let searchId

      if (data.opr_to_arbs[search]) {
        searchId = data.opr_to_arbs[search][0]
      } else if (data.arb_to_oprs[search]) {
        searchId = search
      }

      if (searchId) {
        if (showResultsBy.user) {
          setFiltered(
            data.arb_to_users[searchId].filter((d) =>
              reportingPeriodsActive.includes(d.reporting_period)
            )
          )
        }
      } else {
        setFiltered([])
      }
    } else if (searchBy.user && showResultsBy.project) {
      if (Object.keys(data.user_to_arbs).includes(search)) {
        setFiltered(
          data.user_to_arbs[search].filter((d) =>
            reportingPeriodsActive.includes(d.reporting_period)
          )
        )
      } else {
        setFiltered([])
      }
    } else {
      setFiltered([])
    }
  }, [search, searchBy, showResultsBy, reportingPeriods, data])

  return (
    <Box>
      {filtered.length > 0 &&
        filtered.map((d, i) => {
          return (
            <Entry
              key={i}
              showResultsBy={showResultsBy}
              data={data}
              d={d}
              last={i === filtered.length - 1}
            />
          )
        })}
      {data && search === '' && filtered.length === 0 && (
        <>
          <Divider sx={{ mb: ['12px'], mt: [3] }} />
          <Box>
            <Left sx={{ color: 'secondary', width: 14 }} />
          </Box>
          <Box sx={{ mt: [1], fontSize: [2], width: '75%' }}>
            Please enter a search term on the left.
          </Box>
          <Divider sx={{ mt: ['18px'] }} />
        </>
      )}
      {data && search !== '' && filtered.length === 0 && (
        <>
          <Divider sx={{ mb: ['12px'], mt: [3] }} />
          <Box>
            <Left sx={{ color: 'secondary', width: 14 }} />
          </Box>
          <Box sx={{ mt: [1], fontSize: [2], width: '75%' }}>
            Please finish entering a valid search term or try changing the
            search settings.
          </Box>
          <Divider sx={{ mt: ['18px'] }} />
        </>
      )}
      {!data && (
        <>
          <Divider sx={{ mb: ['12px'], mt: [3] }} />
          <Box>
            <Down sx={{ color: 'secondary', width: 14 }} />
          </Box>
          <Box sx={{ mt: [1], fontSize: [2], width: '75%' }}>
            Please wait while the data loads.
          </Box>
          <Divider sx={{ mt: ['18px'] }} />
        </>
      )}
    </Box>
  )
}

export default Results
