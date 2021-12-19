import { useState, useEffect } from 'react'
import { Box, Divider } from 'theme-ui'
import { Badge, FadeIn } from '@carbonplan/components'
import { Left, Down } from '@carbonplan/icons'
import { sx } from './styles'
import { Entry, Group, Label, Value } from './entry'
import useStore from './store'

const addType = (data, type) => {
  return data.map((d) => Object.assign({}, d, { type: type }))
}

const Results = () => {
  const data = useStore((state) => state.data)
  const filtered = useStore((state) => state.filtered)
  const setFiltered = useStore((state) => state.setFiltered)
  const search = useStore((state) => state.search)
  const searchId = useStore((state) => state.searchId)
  const searchBy = useStore((state) => state.searchBy)
  const showResultsBy = useStore((state) => state.showResultsBy)
  const reportingPeriods = useStore((state) => state.reportingPeriods)

  useEffect(() => {
    if (!data) return

    if (!searchId) {
      setFiltered([])
      return
    }

    const reportingPeriodsActive = Object.keys(reportingPeriods).filter(
      (d) => reportingPeriods[d]
    )

    if (data.arb_to_users[searchId]) {
      if (!data.arb_to_users[searchId]) {
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
    } else if (data.user_to_arbs[searchId]) {
      if (!data.user_to_arbs[searchId]) {
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
      }
    } else if (data.facility_to_user[searchId]) {
      if (!data.facility_to_user[searchId]) {
        return
      }
      if (showResultsBy.user) {
        let users = []
        reportingPeriodsActive.forEach((d) => {
          if (data.facility_to_user[searchId][d]) {
            data.facility_to_user[searchId][d].map((id) => {
              users.push(
                Object.assign(
                  {},
                  {
                    user_id: id,
                    reporting_period: d,
                  }
                )
              )
            })
          }
        })
        setFiltered(addType(users, 'user'))
      } else if (showResultsBy.project) {
        let users = []
        reportingPeriodsActive.forEach((d) => {
          if (data.facility_to_user[searchId][d]) {
            data.facility_to_user[searchId][d].map((id) => {
              users.push(
                Object.assign(
                  {},
                  {
                    user_id: id,
                    reporting_period: d,
                  }
                )
              )
            })
          }
        })
        let projects = []
        users.forEach((d) => {
          if (data.user_to_arbs[d.user_id]) {
            projects.push(data.user_to_arbs[d.user_id])
          }
        })
        projects = projects
          .flat()
          .filter((d) => reportingPeriodsActive.includes(d.reporting_period))
        setFiltered(addType(projects, 'project'))
      } else {
        setFiltered([])
      }
    } else {
      setFiltered([])
    }
  }, [searchId, searchBy, showResultsBy, reportingPeriods, data])

  return (
    <>
      <Box>
        {searchId && filtered.length > 0 && (
          <>
            {filtered.map((d, i) => {
              return (
                <Entry
                  key={i}
                  d={d}
                  data={data}
                  first={i === 0}
                  last={i === filtered.length - 1}
                />
              )
            })}
          </>
        )}
        {filtered.length === 0 && (
          <Box>
            <Box sx={{ ...sx.label, mb: [1] }}>No results</Box>
            <Box>Try changing the reporting period?</Box>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Results
