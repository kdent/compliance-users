import { useState, useEffect } from 'react'
import { Box } from 'theme-ui'
import Entry from './entry'

const url =
  'https://raw.githubusercontent.com/carbonplan/compliance-users/main/data/outputs/user_data_2013_2019.json'

const Results = ({ search, searchBy, showResultsBy, timePeriods }) => {
  const [data, setData] = useState()
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data)
      })
  }, [])

  useEffect(() => {
    if (!data) return

    const reportingPeriod = Object.keys(timePeriods).filter(
      (d) => timePeriods[d]
    )[0]
    if (searchBy.project && showResultsBy.user) {
      if (Object.keys(data.arb_to_users).includes(search)) {
        setFiltered(
          data.arb_to_users[search].filter(
            (d) => d.reporting_period === reportingPeriod
          )
        )
      } else {
        setFiltered([])
      }
    } else if (searchBy.user && showResultsBy.project) {
      if (Object.keys(data.user_to_arbs).includes(search)) {
        setFiltered(
          data.user_to_arbs[search].filter(
            (d) => d.reporting_period === reportingPeriod
          )
        )
      } else {
        setFiltered([])
      }
    } else {
      setFiltered([])
    }
  }, [search, searchBy, showResultsBy, timePeriods, data])

  return (
    <Box>
      {filtered.length > 0 &&
        filtered.map((d, i) => {
          return (
            <Entry key={i} showResultsBy={showResultsBy} data={data} d={d} />
          )
        })}
      {filtered.length === 0 && (
        <Box sx={{ mt: ['32px'] }}>
          <Box
            sx={{
              fontFamily: 'mono',
              color: 'secondary',
              textTransform: 'uppercase',
              fontSize: [1],
              letterSpacing: 'mono',
            }}
          >
            no results found
          </Box>
          <Box sx={{ mt: [3], fontSize: [2], width: '50%' }}>
            Please try changing the settings in the Search panel and try again.
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default Results
