import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Left, Down } from '@carbonplan/icons'
import Entry from './entry'

const addType = (data, type) => {
  return data.map((d) => Object.assign({}, d, { type: type }))
}

const Results = ({
  data,
  search,
  searchId,
  searchBy,
  showResultsBy,
  reportingPeriods,
}) => {
  const [filtered, setFiltered] = useState([])

  useEffect(() => {
    if (!data) return

    if (!searchId) {
      setFiltered([])
      return
    }

    if (search === '') {
      setFiltered([])
      return
    }

    const reportingPeriodsActive = Object.keys(reportingPeriods).filter(
      (d) => reportingPeriods[d]
    )

    if (searchBy.project) {
      if (!data.arb_to_users[searchId]) {
        setFiltered([])
        return
      }
      if (showResultsBy.user) {
        setFiltered(
          addType(
            data.arb_to_users[searchId].filter((d) =>
              reportingPeriodsActive.includes(d.reporting_period)
            ),
            'user'
          )
        )
      } else if (showResultsBy.facility) {
        const users = data.arb_to_users[searchId]
          .filter((d) => reportingPeriodsActive.includes(d.reporting_period))
          .map((d) => d.user_id)
        let facilities = []
        reportingPeriodsActive.forEach((d) => {
          facilities.push(
            users.map((u) => {
              if (data.user_to_facilities[u][d])
                return {
                  user_id: u,
                  reporting_period: d,
                  facility_ids: data.user_to_facilities[u][d],
                }
            })
          )
        })
        facilities = facilities.flat().filter((d) => d)
        facilities = facilities.map((d) => {
          return d.facility_ids.map((id) => {
            if (data.facility_id_to_info[id]) {
              return Object.assign(
                {},
                {
                  user_id: d.user_id,
                  reporting_period: d.reporting_period,
                  facility_id: id,
                },
                data.facility_id_to_info[id][d.reporting_period]
              )
            }
          })
        })
        facilities = facilities.flat().filter((d) => d)
        setFiltered(addType(facilities, 'facility'))
      }
    } else if (searchBy.user) {
      if (!data.user_to_arbs[searchId]) {
        setFiltered([])
        return
      }
      if (showResultsBy.project) {
        setFiltered(
          addType(
            data.user_to_arbs[searchId].filter((d) =>
              reportingPeriodsActive.includes(d.reporting_period)
            ),
            'project'
          )
        )
      } else if (showResultsBy.facility) {
        let facilities = []
        reportingPeriodsActive.forEach((d) => {
          if (data.user_to_facilities[searchId][d]) {
            data.user_to_facilities[searchId][d].map((id) => {
              facilities.push(
                Object.assign(
                  {},
                  {
                    user_id: searchId,
                    reporting_period: d,
                    facility_id: id,
                  },
                  data.facility_id_to_info[id][d]
                )
              )
            })
          }
        })
        setFiltered(addType(facilities, 'facility'))
      } else {
        setFiltered([])
      }
    } else {
      setFiltered([])
    }
  }, [searchId, searchBy, showResultsBy, reportingPeriods, data])

  return (
    <Box>
      {filtered.length > 0 &&
        filtered.map((d, i) => {
          return (
            <Entry key={i} d={d} data={data} last={i === filtered.length - 1} />
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
            Please finish entering a unique search term or try changing the
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
